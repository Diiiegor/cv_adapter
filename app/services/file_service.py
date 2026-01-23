import os
import shutil
from pathlib import Path
from typing import Optional
from PyPDF2 import PdfReader

from app.models.config import settings


class FileService:
    def __init__(self):
        self.upload_dir = Path(settings.UPLOAD_DIR)
        self.upload_dir.mkdir(exist_ok=True)

    def save_pdf(self, filename: str, file_content: bytes) -> str:
        file_path = self.upload_dir / filename

        if len(file_content) > settings.MAX_FILE_SIZE:
            raise ValueError(
                f"File size exceeds maximum allowed size of {settings.MAX_FILE_SIZE} bytes"
            )

        with open(file_path, "wb") as f:
            f.write(file_content)

        return str(file_path)


    def get_file_path(self, filename: str) -> Optional[str]:
        file_path = self.upload_dir / filename
        return str(file_path) if file_path.exists() else None

    def delete_file(self, filename: str) -> bool:
        file_path = self.upload_dir / filename
        if file_path.exists():
            file_path.unlink()
            return True
        return False
