# crypto_utils.py
import json
import secrets
import struct
from typing import Tuple, Dict, Any

from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.backends import default_backend

DEFAULT_ITERATIONS = 310000
SALT_LENGTH = 16  # 128 bits
IV_LENGTH = 12    # 96 bits for GCM

def derive_key(password: str, salt: bytes, iterations: int = DEFAULT_ITERATIONS) -> bytes:
    password_bytes = password.encode('utf-8')
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=iterations,
        backend=default_backend()
    )
    return kdf.derive(password_bytes)

def create_package(encrypted_data: bytes, metadata: Dict[str, Any]) -> bytes:
    metadata_json = json.dumps(metadata, separators=(',', ':')).encode('utf-8')
    metadata_length = len(metadata_json)
    header = struct.pack("<I", metadata_length)
    return header + metadata_json + encrypted_data

def encrypt_bytes(plain: bytes, password: str, original_name: str) -> Tuple[bytes, Dict[str, Any]]:
    salt = secrets.token_bytes(SALT_LENGTH)
    iv = secrets.token_bytes(IV_LENGTH)
    iterations = DEFAULT_ITERATIONS

    key = derive_key(password, salt, iterations)
    aesgcm = AESGCM(key)
    ciphertext = aesgcm.encrypt(iv, plain, None)

    metadata = {
        "version": "1.0",
        "algorithm": "AES-256-GCM",
        "kdf": "PBKDF2",
        "salt": list(salt),
        "iterations": iterations,
        "iv": list(iv),
        "originalName": original_name,
        "size": len(plain),
        "createdAt": __import__("datetime").datetime.utcnow().isoformat() + "Z"
    }

    package = create_package(ciphertext, metadata)
    return package, metadata

def decrypt_package(package_bytes: bytes, password: str) -> Tuple[bytes, Dict[str, Any]]:
    if len(package_bytes) < 4:
        raise ValueError("Invalid package: too small")
    metadata_len = struct.unpack_from("<I", package_bytes, 0)[0]
    start = 4
    end = start + metadata_len
    if end > len(package_bytes):
        raise ValueError("Invalid package: metadata length out of bounds")
    metadata_json = package_bytes[start:end].decode('utf-8')
    metadata = json.loads(metadata_json)
    encrypted_data = package_bytes[end:]
    salt = bytes(metadata["salt"])
    iv = bytes(metadata["iv"])
    iterations = int(metadata.get("iterations", DEFAULT_ITERATIONS))
    key = derive_key(password, salt, iterations)
    aesgcm = AESGCM(key)
    try:
        plain = aesgcm.decrypt(iv, encrypted_data, None)
    except Exception as e:
        raise ValueError("Decryption failed") from e
    return plain, metadata

def sha256_hex(value: str) -> str:
    digest = hashes.Hash(hashes.SHA256(), backend=default_backend())
    digest.update(value.encode('utf-8'))
    return digest.finalize().hex()

def generate_strong_password(length: int = 20) -> str:
    if length < 1:
        return ""
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
    import secrets
    return ''.join(secrets.choice(alphabet) for _ in range(length))
