from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import io

from crypto_utils import encrypt_bytes, decrypt_package, sha256_hex, generate_strong_password

app = FastAPI(title="Surakshitam Secure Vault - Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/encrypt")
async def encrypt_endpoint(file: UploadFile = File(...), password: str = Form(...)):
    try:
        content = await file.read()
        package_bytes, metadata = encrypt_bytes(content, password, file.filename)
        stream = io.BytesIO(package_bytes)
        filename = (file.filename + ".sfl") if not file.filename.endswith(".sfl") else file.filename
        headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
        return StreamingResponse(stream, media_type="application/octet-stream", headers=headers)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Encryption failed")

@app.post("/decrypt")
async def decrypt_endpoint(file: UploadFile = File(...), password: str = Form(...)):
    try:
        package_bytes = await file.read()
        plain, metadata = decrypt_package(package_bytes, password)
        stream = io.BytesIO(plain)
        filename = metadata.get("originalName", "decrypted.dat")
        headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
        return StreamingResponse(stream, media_type="application/octet-stream", headers=headers)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Decryption failed")
