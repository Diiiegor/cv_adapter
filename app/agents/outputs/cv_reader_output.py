from typing import List, Optional
from pydantic import BaseModel


class PersonalInfo(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    current_job_title: Optional[str] = None


class Education(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class Experience(BaseModel):
    organization: Optional[str] = None
    position: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    responsibilities: Optional[List[str]] = None


class CVReaderOutput(BaseModel):
    personal_info: Optional[PersonalInfo] = None
    education: Optional[List[Education]] = None
    experience: Optional[List[Experience]] = None
