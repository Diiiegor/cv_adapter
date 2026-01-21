from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from app.services.file_service import FileService
from app.models.schemas import CVUploadRequest


router = APIRouter(prefix="/cv", tags=["CV"])
file_service = FileService()


@router.post("/upload")
async def upload_cv(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    try:
        file_content = await file.read()
        file_path = file_service.save_pdf(file.filename, file_content)

        return JSONResponse(
            status_code=200,
            content={
                "message": "CV uploaded successfully",
                "filename": file.filename,
                "file_path": file_path,
            },
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error uploading file")


@router.get("/content/{filename}")
async def get_cv_content(filename: str):
    file_path = file_service.get_file_path(filename)
    if not file_path:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        cv_text = file_service.extract_text_from_pdf(file_path)
        return JSONResponse(
            status_code=200, content={"filename": filename, "content": cv_text}
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error reading file")
