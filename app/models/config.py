import os
from dotenv import load_dotenv
from typing import Optional

# Cargar variables de entorno desde .env
load_dotenv()


class Settings:
    # Configuración de OpenAI
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    OPENAI_TEMPERATURE: float = float(os.getenv("OPENAI_TEMPERATURE", "0.3"))

    # Configuración de archivos
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", str(10 * 1024 * 1024)))  # 10MB

    # Configuración del servidor
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    # Configuración de CORS
    ALLOWED_ORIGINS: list = os.getenv("ALLOWED_ORIGINS", "*").split(",")

    # Configuración de Redis
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB: int = int(os.getenv("REDIS_DB", "0"))

    def validate_openai_config(self) -> bool:
        """Valida que la configuración de OpenAI sea correcta"""
        if not self.OPENAI_API_KEY:
            raise ValueError(
                "OPENAI_API_KEY es requerida. Configúrala en el archivo .env"
            )
        if not self.OPENAI_API_KEY.startswith("sk-"):
            raise ValueError(
                "OPENAI_API_KEY debe ser una clave válida de OpenAI (empieza con 'sk-')"
            )
        return True

    def get_openai_config(self) -> dict:
        """Retorna la configuración de OpenAI como diccionario"""
        return {
            "model_name": self.OPENAI_MODEL,
            "temperature": self.OPENAI_TEMPERATURE,
            "openai_api_key": self.OPENAI_API_KEY,
        }


settings = Settings()
