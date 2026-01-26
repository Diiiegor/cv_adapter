"""
Servicio para manejar conexiones y operaciones con Redis
"""
import redis
from typing import Optional, Any
import json
from app.models.config import settings


class RedisService:
    """Servicio para interactuar con Redis como cache"""

    def __init__(self):
        self.client: Optional[redis.Redis] = None
        self._connect()

    def _connect(self):
        """Establece conexión con Redis"""
        try:
            self.client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                db=settings.REDIS_DB,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5,
            )
            # Verificar conexión
            self.client.ping()
        except redis.ConnectionError as e:
            print(f"Warning: No se pudo conectar a Redis: {e}")
            self.client = None
        except Exception as e:
            print(f"Error al conectar con Redis: {e}")
            self.client = None

    def is_connected(self) -> bool:
        """Verifica si hay conexión activa con Redis"""
        if self.client is None:
            return False
        try:
            self.client.ping()
            return True
        except:
            return False

    def get(self, key: str) -> Optional[Any]:
        """Obtiene un valor del cache"""
        if not self.is_connected():
            return None
        try:
            value = self.client.get(key)
            if value:
                # Intentar deserializar JSON
                try:
                    return json.loads(value)
                except json.JSONDecodeError:
                    return value
            return None
        except Exception as e:
            print(f"Error al obtener de Redis: {e}")
            return None

    def set(self, key: str, value: Any, expire: Optional[int] = None) -> bool:
        """Guarda un valor en el cache"""
        if not self.is_connected():
            return False
        try:
            # Serializar si es necesario
            if isinstance(value, (dict, list)):
                value = json.dumps(value)
            self.client.set(key, value, ex=expire)
            return True
        except Exception as e:
            print(f"Error al guardar en Redis: {e}")
            return False

    def delete(self, key: str) -> bool:
        """Elimina una clave del cache"""
        if not self.is_connected():
            return False
        try:
            self.client.delete(key)
            return True
        except Exception as e:
            print(f"Error al eliminar de Redis: {e}")
            return False

    def exists(self, key: str) -> bool:
        """Verifica si una clave existe en el cache"""
        if not self.is_connected():
            return False
        try:
            return self.client.exists(key) > 0
        except Exception as e:
            print(f"Error al verificar existencia en Redis: {e}")
            return False

    def clear_pattern(self, pattern: str) -> int:
        """Elimina todas las claves que coincidan con un patrón"""
        if not self.is_connected():
            return 0
        try:
            keys = self.client.keys(pattern)
            if keys:
                return self.client.delete(*keys)
            return 0
        except Exception as e:
            print(f"Error al limpiar patrón en Redis: {e}")
            return 0


# Instancia singleton del servicio
_redis_service: Optional[RedisService] = None


def get_redis_service() -> RedisService:
    """Obtiene la instancia singleton del servicio Redis"""
    global _redis_service
    if _redis_service is None:
        _redis_service = RedisService()
    return _redis_service
