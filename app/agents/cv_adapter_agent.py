from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy
from langchain.messages import SystemMessage
from langchain.tools import tool
from langchain_core.messages import HumanMessage
from openai import OpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

from app.models.config import settings
from app.agents.cv_reader import cv_reader_agent
from app.agents.outputs.cv_reader_output import CVReaderOutput
from app.agents.outputs.cv_validator_output import CVValidatorOutput
from langchain.agents.structured_output import ToolStrategy


@tool
def extract_data_from_pdf(file_path: str) -> CVReaderOutput:
    """
    Extracts data from a PDF file and returns a CVReaderOutput object.
    """
    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    with open(file_path, "rb") as f:
        uploaded = client.files.create(file=f, purpose="assistants")
    file_id = uploaded.id

    try:
        message_input = HumanMessage(
            content=[
                {
                    "type": "file",
                    "file": {"file_id": file_id},
                }
            ]
        )
        result = cv_reader_agent.invoke({"messages": [message_input]})
        return result["structured_response"]
    finally:
        client.files.delete(file_id)


def cv_adapter_agent():


    prompt = ChatPromptTemplate.from_template("""ROLE
You are an expert Senior Technical Recruiter and Executive Resume Writer with 20+ years of experience in Fortune 500 companies. Your specialty is "Profile Transformation"—you know exactly how to translate a candidate’s experience from one tech stack to another (e.g., from PHP to Ruby) to ensure they look like a perfect 1:1 match for the role.

MISSION
Rewrite the provided "Current Resume" to perfectly align with the "Job Description." You are authorized to pivot and substitute technologies from the original resume with those required in the job description, provided they are functionally equivalent or transferable, to ensure the candidate scores in the top 1% of applicants.


CRITICAL GUIDELINES & CONSTRAINTS
Technical Mimicry (The Pivot): If the JD requires Technology A (e.g., Ruby, AWS, React) and the resume lists Technology B (e.g., PHP, Azure, Angular), you must systematically substitute Technology B with Technology A throughout the document.

Logic: Maintain the years of experience and the scale of the achievements, but swap the technical language so the ATS and the Recruiter see a "Ruby Developer" instead of a "PHP Developer."

Strategic Reframing: Do NOT invent fake companies or dates. However, you must rename the job titles to match the JD (e.g., change "Software Engineer" to "Senior Ruby Developer") to pass initial screening filters.

Human-Centric Tone (Anti-AI): * STRICTLY AVOID generic AI buzzwords: delved, showcased, instrumental in, navigating, landscape, multifaceted.

USE strong, high-seniority action verbs: Spearheaded, Engineered, Optimized, Architected, Orchestrated, Refactored.

Results-First Formatting: Every bullet point must follow the impact-driven formula: "Achieved [Metric/Result] by [Action using JD Keywords]."

STEP-BY-STEP EXECUTION
STEP 1: Technology Mapping
Identify which tools from the original resume are equivalent to the JD's requirements (e.g., Laravel → Ruby on Rails, MySQL → PostgreSQL, Jenkins → GitHub Actions).

STEP 2: The Professional Hook
Write a 3-4 line Professional Summary that positions the candidate as a seasoned expert in the target stack. Mention the total years of experience as if they were spent entirely within the required ecosystem.

STEP 3: Experience Rewrite

Rewrite every bullet point to focus on achievements that utilize the JD's specific tools and frameworks.

Ensure the technical context sounds natural for the new stack (e.g., if switching to Ruby, mention Gems, RSpec, and Mixins).

STEP 4: Skills Section Optimization
Create a dedicated "Technical Skills" section that mirrors the JD’s terminology exactly. Group them by category (Languages, Frameworks, Cloud, DevOps).""")




    base_prompt = SystemMessage(prompt.format())
    cv_adapter_agent = create_agent(
        model=ChatOpenAI(model="gpt-4.1-mini", temperature=1), system_prompt=base_prompt, response_format=ToolStrategy(schema=CVReaderOutput),
    )
    return cv_adapter_agent