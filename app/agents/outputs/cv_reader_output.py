from typing import List, Optional
from pydantic import BaseModel


class PersonalInfo(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    role_name: Optional[str] = None
    professional_summary: Optional[str] = None


class Education(BaseModel):
    institution: Optional[str] = None
    location: Optional[str] = None
    degree: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    details: Optional[List[str]] = None  # bullet points / highlights


class Experience(BaseModel):
    organization: Optional[str] = None
    position: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    details: Optional[List[str]] = None


class CVReaderOutput(BaseModel):
    personal_info: Optional[PersonalInfo] = None
    skills: Optional[List[str]] = None  # e.g. ["Python", "FastAPI", "React", ...]
    experience: Optional[List[Experience]] = None
    education: Optional[List[Education]] = None
    languages: Optional[List[str]] = None  # e.g. ["Spanish", "English"]