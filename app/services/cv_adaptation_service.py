from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from app.services.file_service import FileService
from openai import OpenAI
from app.models.config import settings
from datetime import datetime
from langchain_core.messages import HumanMessage
from app.agents.cv_adapter_agent import cv_adapter_agent


class CVAdaptationService:
    def __init__(self, file_service: FileService):
        self.file_service = file_service
        self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)

    async def adapt_cv_to_job_offer(self, file_content: bytes, job_offer: str):
        new_file_name = f"{datetime.now().timestamp()}.pdf"
        temp_path = self.file_service.save_pdf(new_file_name, file_content)

        with open(temp_path, "rb") as pdf_file:
            uploaded_file = self.openai_client.files.create(
                file=pdf_file, purpose="assistants"
            )
        file_id = uploaded_file.id

        message_cv_file = HumanMessage(
            content=[
                {
                    "type": "file",
                    "file": {
                        "file_id": file_id,
                    },
                },
                {
                    "type": "text",
                    "text": "current resume",
                },
            ]
        )

        message_job_offer = HumanMessage(
            content=[
                {
                    "type": "text",
                    "text": f"<job description>{job_offer}</job description>",
                },
            ]
        )

        agent = cv_adapter_agent()
        adaptation_result = await agent.ainvoke({"messages": [message_cv_file, message_job_offer]})
        agent_response = adaptation_result["structured_response"]
        return agent_response


def get_cv_adaptation_service() -> CVAdaptationService:
    file_service = FileService()
    return CVAdaptationService(file_service)