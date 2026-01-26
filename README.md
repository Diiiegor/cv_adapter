# CV Adapter API

API para adaptar CVs a ofertas laborales usando IA y LangChain.

## Instalación

### Desarrollo Local

```bash
uv sync
```

### Docker

```bash
# Construir y ejecutar con Docker Compose
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## Configuración

Copia el archivo `.env.example` a `.env` y configura tus variables:

```bash
cp .env.example .env
# Edita .env y añade tus API keys
```

### Variables de Entorno Importantes

- `OPENAI_API_KEY` - Clave API de OpenAI (requerido)
- `TAVILY_API_KEY` - Clave API de Tavily
- `REDIS_HOST` - Host de Redis (default: redis para Docker, localhost para desarrollo)
- `REDIS_PORT` - Puerto de Redis (default: 6379)

## Ejecución

### Desarrollo Local

```bash
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Docker

```bash
docker-compose up
```

La API estará disponible en `http://localhost:8000`

## Servicios

- **API FastAPI**: Puerto 8000
- **Redis**: Puerto 6379 (para cache)

## Endpoints

- `GET /` - Información de la API
- `GET /health` - Health check
- `POST /cv/upload` - Subir PDF del CV
- `GET /cv/content/{filename}` - Obtener texto del CV
- `POST /adaptation/analyze-job-offer` - Analizar oferta laboral
- `POST /adaptation/adapt-cv` - Adaptar CV a la oferta

## Uso

1. Sube un PDF del CV con `POST /cv/upload`
2. Envía la oferta laboral con `POST /adaptation/adapt-cv`
3. Recibe el CV adaptado con optimización ATS

## Redis Cache

El proyecto incluye un servicio Redis para manejo de cache. Puedes usar el servicio `RedisService` desde `app.services.redis_service` para implementar cache en tus endpoints.