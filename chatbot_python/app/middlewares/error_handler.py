from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse


async def error_handler_middleware(request: Request, call_next):
    try:
        response = await call_next(request)

        return response

    except HTTPException as http_exc:
        print(
            f"message: {http_exc.detail};\nstatus code: {http_exc.status_code};\npath: {request.url.path}")
        return JSONResponse(status_code=http_exc.status_code, content={"error": "HTTP_Error", "message": http_exc.detail, "status_code": http_exc.status_code})

    except Exception as unexpected_exc:
        print(
            f"Unexpected Error: {str(unexpected_exc)};\nURL: {request.url};\nMethod: {request.method}")
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal Server Error",
                "message": "Something went wrong on the server",
                "path": str(request.url.path)
            }
        )
