# CV Adapter API

API para adaptar CVs a ofertas laborales usando IA y LangChain.

## Instalación

```bash
uv sync
```

## Configuración

Copia el archivo `.env.example` a `.env` y configura tu API key de OpenAI:

```bash
cp .env.example .env
# Edita .env y añade tu OPENAI_API_KEY
```

## Ejecución

```bash
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Endpoints

- `POST /cv/upload` - Subir PDF del CV
- `GET /cv/content/{filename}` - Obtener texto del CV
- `POST /adaptation/analyze-job-offer` - Analizar oferta laboral
- `POST /adaptation/adapt-cv` - Adaptar CV a la oferta

## Uso

1. Sube un PDF del CV con `POST /cv/upload`
2. Envía la oferta laboral con `POST /adaptation/adapt-cv`
3. Recibe el CV adaptado con optimización ATS