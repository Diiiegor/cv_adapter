from pydantic import BaseModel
from typing import Optional


class AdaptCVRequestBody(BaseModel):
    """Request body for POST /cv/adapt. File must be base64-encoded PDF."""

    file: str  # base64-encoded PDF content
    job_description: Optional[str] = None


class CVUploadRequest(BaseModel):
    filename: str


class JobOfferRequest(BaseModel):
    title: str
    description: str
    requirements: Optional[str] = None


class CVAdaptationRequest(BaseModel):
    cv_filename: str
    job_offer: JobOfferRequest


class CVAdaptationResponse(BaseModel):
    adapted_cv_content: str
    improvements_made: list[str]
    match_score: float
