from langchain.agents import create_agent
from langchain.messages import SystemMessage
from app.agents.outputs.cv_reader_output import CVReaderOutput
from dotenv import load_dotenv


base_prompt = SystemMessage("""Role: Expert CV Data Extractor.
                            Task: Parse raw CV text into a structured JSON.
                            STRICT GUIDELINES:
                            1. CLEANING: Ignore PDF artifacts such as "" tags and "--- PAGE X ---" markers.
                            2. RECONSTRUCTION: Merge lines that were split by the PDF extraction process to restore original sentences.
                            3. FIDELITY: Do not invent data. Use 'null' (or None) if info is missing.
                            4. MULTIPLE ENTRIES: Ensure all work experiences and education entries are captured in their respective arrays.
                             Input: You will receive CV text that has been extracted from PDF documents.
                             Output: Parse the text and structure it according to the provided schema.""")
cv_reader_agent = create_agent(
    model="gpt-5-nano", system_prompt=base_prompt, response_format=CVReaderOutput
)
