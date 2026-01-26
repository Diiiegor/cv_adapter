def error_response(status_code: int, message: str | None = None, exception=None):
    if exception:
        print(exception)

    return {
        "success": False,
        "detail": message if message else "general_error",
        "status": status_code,
    }

def success_response(data):
    return {
        "success": True,
        "detail": "request_successfully_processed",
        "status": 200,
        "data":data
    }