# Secure Vault Shield — Backend (FastAPI)

This backend provides cryptographic operations for the Surakshitam Secure Vault project.

## Setup

1. Create virtual environment:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate    # Linux / macOS
.venv\Scripts\activate     # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
