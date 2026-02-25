import base64
import json
from fastapi import APIRouter, UploadFile, File, Form
from fastapi import status
from fastapi.responses import StreamingResponse
from typing import Optional, AsyncGenerator
from app.http.responses import error_response, success_response
from app.models.schemas import AdaptCVRequestBody
from app.services.cv_validation_service import get_cv_validation_service, CVValidationService
from fastapi import Depends
from app.services.cv_adaptation_service import get_cv_adaptation_service, CVAdaptationService


def _sse_event(event: str, data: dict) -> str:
    def default(obj):
        if hasattr(obj, "model_dump"):
            return obj.model_dump()
        if hasattr(obj, "dict"):
            return obj.dict()
        return str(obj)

    return f"event: {event}\ndata: {json.dumps(data, default=default)}\n\n"

router = APIRouter(prefix="/cv", tags=["CV"])


@router.post("/validate")
async def validate_cv(
    file: UploadFile = File(...),
    job_description: Optional[str] = Form(None),
    cv_validation_service: CVValidationService = Depends(get_cv_validation_service),
):
    response = None
    try:
        # Just PDF Files allowed
        if not file.filename or not file.filename.lower().endswith(".pdf"):
            raise Exception("Only PDF files are allowed")

        # Max 10MB file size
        max_cv_size = 10 * 1024 * 1024  # 10MB
        file_content = await file.read()
        if len(file_content) > max_cv_size:
            raise Exception("File is too large to be a CV (max 10MB)")
                
        is_cv = await cv_validation_service.validate_cv(file_content)

        data={"is_cv": is_cv}
        response = success_response(data=data)

    except Exception as e:
        response = error_response(
            status.HTTP_400_BAD_REQUEST, message=str(e), exception=e
        )
    return response

async def _adapt_cv_stream(
    body: AdaptCVRequestBody,
    cv_validation_service: CVValidationService,
    cv_adaptation_service: CVAdaptationService,
) -> AsyncGenerator[str, None]:
    try:
        try:
            file_content = base64.b64decode(body.file, validate=True)
        except Exception:
            yield _sse_event("error", {"success": False, "message": "Invalid base64 encoding for file"})
            return

        yield _sse_event("progress", {"step": 1, "message": "Decoded file, validating size"})

        max_cv_size = 10 * 1024 * 1024  # 10MB
        if len(file_content) > max_cv_size:
            yield _sse_event("error", {"success": False, "message": "File is too large to be a CV (max 10MB)"})
            return

        yield _sse_event("progress", {"step": 2, "message": "Validating file type"})

        if not file_content.startswith(b"%PDF"):
            yield _sse_event("error", {"success": False, "message": "Only PDF files are allowed"})
            return

        yield _sse_event("progress", {"step": 3, "message": "Starting CV validation"})

        is_cv = await cv_validation_service.validate_cv(file_content)

        yield _sse_event("progress", {"step": 4, "message": "CV validation finished", "is_cv": is_cv})

        if not is_cv:
            yield _sse_event("error", {"success": False, "message": "File is not a CV"})
            return

        yield _sse_event("progress", {"step": 5, "message": "Adapting CV to job offer"})

        adapted_cv = await cv_adaptation_service.adapt_cv_to_job_offer(file_content, body.job_description)

        yield _sse_event("done", {
            "success": True,
            "step": 6,
            "message": "CV adaptado correctamente",
            "adapted_cv": adapted_cv,
        })
    except Exception as e:
        yield _sse_event("error", {"success": False, "message": str(e)})


@router.post("/adapt")
async def adapt_cv(
    body: AdaptCVRequestBody,
    cv_validation_service: CVValidationService = Depends(get_cv_validation_service),
    cv_adaptation_service: CVAdaptationService = Depends(get_cv_adaptation_service),
):
    return StreamingResponse(
        _adapt_cv_stream(body, cv_validation_service, cv_adaptation_service),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )