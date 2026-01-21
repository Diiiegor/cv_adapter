from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from app.models.schemas import (
    JobOfferRequest,
    CVAdaptationRequest,
    CVAdaptationResponse,
)
from app.services.file_service import FileService
from app.services.cv_adaptation_service import CVAdaptationService


router = APIRouter(prefix="/adaptation", tags=["CV Adaptation"])
file_service = FileService()
cv_service = CVAdaptationService()


@router.post("/analyze-job-offer")
async def analyze_job_offer(job_offer: JobOfferRequest):
    try:
        keywords = cv_service._extract_keywords(
            job_offer.description + " " + (job_offer.requirements or "")
        )

        return JSONResponse(
            status_code=200,
            content={
                "title": job_offer.title,
                "keywords": keywords,
                "requirements_count": len(keywords),
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error analyzing job offer")


@router.post("/adapt-cv", response_model=CVAdaptationResponse)
async def adapt_cv(request: CVAdaptationRequest):
    file_path = file_service.get_file_path(request.cv_filename)
    if not file_path:
        raise HTTPException(status_code=404, detail="CV file not found")

    try:
        cv_text = file_service.extract_text_from_pdf(file_path)

        job_offer_dict = {
            "title": request.job_offer.title,
            "description": request.job_offer.description,
            "requirements": request.job_offer.requirements,
        }

        adaptation_result = cv_service.adapt_cv_to_job_offer(cv_text, job_offer_dict)

        return CVAdaptationResponse(**adaptation_result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error adapting CV")
