from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from langchain_core.messages import HumanMessage
from openai import OpenAI

from app.services.file_service import FileService
from app.models.schemas import CVUploadRequest
from app.agents.cv_validator import cv_validator
from app.models.config import settings
from fastapi import status

router = APIRouter(prefix="/cv", tags=["CV"])
file_service = FileService()


@router.post("/validate")
async def validate_cv(file: UploadFile = File(...)):
    try:
            # Just PDF Files allowed
        if not file.filename or not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        # Max 10MB file size
        max_cv_size = 10 * 1024 * 1024  # 10MB
        file_content = await file.read()
        if len(file_content) > max_cv_size:
            raise HTTPException(
                status_code=400, detail="File is too large to be a CV (max 10MB)"
            )

        temp_path = file_service.save_pdf(file.filename, file_content)



        # Upload file to OpenAI to get file_id
        openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)


        with open(temp_path, "rb") as pdf_file:
            uploaded_file = openai_client.files.create(
                file=pdf_file,
                purpose="assistants"
            )
            file_id = uploaded_file.id


        # Create message with file_id instead of bas
        message_input = HumanMessage(
            content=[
                {
                    "type": "file",
                    "file": {
                        "file_id": file_id,
                    }
                }
            ]
        )

        validation_result = await cv_validator.ainvoke({"messages": [message_input]})
        response = validation_result['structured_response']
        return {
            "is_cv":response.is_curriculum
        }
    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST,detail=str(e))
