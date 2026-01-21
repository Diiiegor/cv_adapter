from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from typing import List, Dict
import re

from app.models.config import settings


class CVAdaptationService:
    def __init__(self):
        # Validar configuración de OpenAI
        settings.validate_openai_config()

        # Inicializar el modelo LLM con variables de entorno
        openai_config = settings.get_openai_config()
        self.llm = ChatOpenAI(**openai_config)

    def adapt_cv_to_job_offer(self, cv_text: str, job_offer: dict) -> dict:
        prompt = self._create_adaptation_prompt(cv_text, job_offer)

        try:
            response = self.llm.invoke(prompt)
            adapted_content = response.content

            improvements = self._extract_improvements(adapted_content)
            match_score = self._calculate_match_score(
                cv_text, job_offer, adapted_content
            )

            return {
                "adapted_cv_content": adapted_content,
                "improvements_made": improvements,
                "match_score": match_score,
            }
        except Exception as e:
            raise ValueError(f"Error adapting CV: {str(e)}")

    def _create_adaptation_prompt(self, cv_text: str, job_offer: dict) -> str:
        return f"""
Eres un experto en reclutamiento y optimización de CVs. Tu tarea es adaptar el siguiente CV para que cumpla con los requisitos de la oferta laboral y pase los filtros automáticos de los sistemas ATS.

CV ORIGINAL:
{cv_text}

OFERTA LABORAL:
Título: {job_offer.get("title", "")}
Descripción: {job_offer.get("description", "")}
Requisitos: {job_offer.get("requirements", "")}

INSTRUCCIONES:
1. Adapta el CV destacando las habilidades y experiencias relevantes para la oferta
2. Incluye palabras clave de la oferta para mejorar el ATS
3. Mantén la veracidad de la información - no inventes experiencias
4. Estructura el contenido de forma clara y profesional
5. Añade una sección de resumen que conecte el perfil con la oferta
6. Optimiza la descripción de experiencias para alinearlas con los requisitos

Proporciona el CV adaptado en un formato claro y estructurado.
"""

    def _extract_improvements(self, adapted_content: str) -> List[str]:
        improvements = []

        if "resumen" in adapted_content.lower() or "summary" in adapted_content.lower():
            improvements.append("Se añadió resumen profesional")

        if "python" in adapted_content.lower() or "java" in adapted_content.lower():
            improvements.append("Se destacaron habilidades técnicas")

        if "experiencia" in adapted_content.lower():
            improvements.append("Se optimizó la descripción de experiencias")

        if len(improvements) == 0:
            improvements.append("Se adaptó el contenido a la oferta laboral")

        return improvements

    def _calculate_match_score(
        self, original_cv: str, job_offer: dict, adapted_cv: str
    ) -> float:
        job_keywords = self._extract_keywords(
            job_offer.get("description", "") + " " + job_offer.get("requirements", "")
        )

        original_matches = sum(
            1 for keyword in job_keywords if keyword.lower() in original_cv.lower()
        )
        adapted_matches = sum(
            1 for keyword in job_keywords if keyword.lower() in adapted_cv.lower()
        )

        if len(job_keywords) == 0:
            return 0.7

        score = min(adapted_matches / len(job_keywords), 1.0)
        return round(score, 2)

    def _extract_keywords(self, text: str) -> List[str]:
        words = re.findall(r"\b\w+\b", text.lower())
        common_words = {
            "el",
            "la",
            "de",
            "que",
            "y",
            "en",
            "un",
            "es",
            "se",
            "no",
            "te",
            "lo",
            "le",
            "da",
            "su",
            "por",
            "son",
            "con",
            "para",
            "como",
            "las",
            "del",
            "los",
            "una",
            "mi",
            "pero",
            "ser",
            "son",
            "me",
            "si",
            "ya",
            "muy",
            "más",
            "este",
            "esta",
            "esto",
            "estos",
            "estas",
        }

        keywords = [
            word for word in words if len(word) > 3 and word not in common_words
        ]
        return list(set(keywords))
