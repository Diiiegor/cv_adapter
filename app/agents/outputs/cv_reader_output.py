from typing import List, Optional
from pydantic import BaseModel, Field


class PersonalInfo(BaseModel):
    full_name: str =Field(description="The full name of the person")
    email: str =Field(description="The email of the person")
    phone_number: str =Field(description="The phone number of the person")
    role_name: str =Field(description="The role of the job offer")
    professional_summary: str =Field(description="The professional summary of the person")


class Education(BaseModel):
    institution: str =Field(description="The institution of the person")
    location: str =Field(description="The location of the institution, if the location is not available, return the country of the institution")
    degree: str =Field(description="The degree of the person")
    start_date: str =Field(description="The start date of the education")
    end_date: str =Field(description="The end date of the education")
    details: List[str] =Field(description="The details of the education")


class Experience(BaseModel):
    organization: str =Field(description="The organization of the person's experience")
    position: str =Field(description="The position of the person's experience")
    start_date: str =Field(description="The start date of the experience")
    end_date: str =Field(description="The end date of the experience")
    details: List[str] =Field(description="The details of the experience")


class CVReaderOutput(BaseModel):
    personal_info: PersonalInfo =Field(description="The personal information of the person")
    skills: List[str] =Field(description="The skills of the person")
    experience: List[Experience] =Field(description="The experiences of the person")
    education: List[Education] =Field(description="The education of the person")
    languages: List[str] =Field(description="The languages of the person")