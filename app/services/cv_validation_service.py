from app.services.file_service import FileService
from datetime import datetime
from openai import OpenAI
from app.models.config import settings
from langchain_core.messages import HumanMessage
from app.agents.cv_validator import cv_validator

class CVValidationService():
    def __init__(self, file_service: FileService):
        self.file_service = file_service
        self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)

    async def validate_cv(self, file_content: bytes) -> bool:
        new_file_name = f"{datetime.now().timestamp()}.pdf"
        temp_path = self.file_service.save_pdf(new_file_name, file_content)

        with open(temp_path, "rb") as pdf_file:
            uploaded_file = self.openai_client.files.create(
                file=pdf_file, purpose="assistants"
            )
            file_id = uploaded_file.id

        message_input = HumanMessage(
            content=[
                {
                    "type": "file",
                    "file": {
                        "file_id": file_id,
                    },
                }
            ]
        )

        validation_result = await cv_validator.ainvoke({"messages": [message_input]})
        agent_response = validation_result["structured_response"]
        return agent_response.is_curriculum

def get_cv_validation_service() -> CVValidationService:
    file_service = FileService()
    return CVValidationService(file_service=file_service)