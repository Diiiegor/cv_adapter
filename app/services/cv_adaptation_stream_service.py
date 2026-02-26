import base64
import json
from typing import AsyncGenerator

from app.services.cv_validation_service import CVValidationService
from app.services.cv_adaptation_service import CVAdaptationService
from app.services.cv_pdf_generation_service import CVPdfGenerationService


def _sse_event(event: str, data: dict) -> str:
    def default(obj):
        if hasattr(obj, "model_dump"):
            return obj.model_dump()
        if hasattr(obj, "dict"):
            return obj.dict()
        return str(obj)

    return f"event: {event}\ndata: {json.dumps(data, default=default)}\n\n"


class CVAdaptationStreamService:
    def __init__(
        self,
        cv_validation_service: CVValidationService,
        cv_adaptation_service: CVAdaptationService,
        cv_pdf_generation_service: CVPdfGenerationService,
    ):
        self.cv_validation_service = cv_validation_service
        self.cv_adaptation_service = cv_adaptation_service
        self.cv_pdf_generation_service = cv_pdf_generation_service

    async def stream_adaptation(
        self, file_base64: str, job_description: str
    ) -> AsyncGenerator[str, None]:
        try:
            try:
                file_content = base64.b64decode(file_base64, validate=True)
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

            is_cv = await self.cv_validation_service.validate_cv(file_content)

            yield _sse_event("progress", {"step": 4, "message": "CV validation finished", "is_cv": is_cv})

            if not is_cv:
                yield _sse_event("error", {"success": False, "message": "File is not a CV"})
                return

            yield _sse_event("progress", {"step": 5, "message": "Adapting CV to job offer"})

            adapted_cv = await self.cv_adaptation_service.adapt_cv_to_job_offer(file_content, job_description)

            yield _sse_event("progress", {"step": 6, "message": "Generating PDF"})

            pdf_bytes = self.cv_pdf_generation_service.generate_pdf(adapted_cv)
            pdf_base64 = base64.b64encode(pdf_bytes).decode("utf-8")

            yield _sse_event("done", {
                "success": True,
                "step": 7,
                "message": "CV adaptado correctamente",
                "adapted_cv": adapted_cv,
                "pdf_base64": pdf_base64,
            })
        except Exception as e:
            yield _sse_event("error", {"success": False, "message": str(e)})


def get_cv_adaptation_stream_service(
    cv_validation_service: CVValidationService,
    cv_adaptation_service: CVAdaptationService,
    cv_pdf_generation_service: CVPdfGenerationService | None = None,
) -> CVAdaptationStreamService:
    if cv_pdf_generation_service is None:
        cv_pdf_generation_service = CVPdfGenerationService()
    return CVAdaptationStreamService(cv_validation_service, cv_adaptation_service, cv_pdf_generation_service)
