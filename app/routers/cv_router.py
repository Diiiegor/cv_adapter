from fastapi import APIRouter, UploadFile, File
from fastapi import status
from app.http.responses import error_response,success_response
from app.services.cv_validation_service import get_cv_validation_service, CVValidationService
from fastapi import Depends

router = APIRouter(prefix="/cv", tags=["CV"])


@router.post("/validate")
async def validate_cv(file: UploadFile = File(...), cv_validation_service: CVValidationService = Depends(get_cv_validation_service)):
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
