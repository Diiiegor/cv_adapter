from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import cv_router
from app.models.config import settings
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(
    title="CV Adapter API",
    description="API para adaptar CVs a ofertas laborales usando IA",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cv_router.router)


@app.get("/")
async def root():
    return {
        "message": "CV Adapter API",
        "version": "1.0.0",
        "endpoints": {
            "cv_upload": "/cv/upload",
            "cv_content": "/cv/content/{filename}",
            "analyze_job": "/adaptation/analyze-job-offer",
            "adapt_cv": "/adaptation/adapt-cv",
        },
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
