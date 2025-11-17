📘 Surakshitam Secure Vault
🔒 Advanced File Encryption & Decryption System (React + FastAPI + AES-256-GCM)

Surakshitam Secure Vault is a high-security, modern file locker application built using React (frontend) and FastAPI (backend).
It allows users to securely encrypt and decrypt files using AES-256-GCM with PBKDF2-SHA256 key derivation, ensuring military-grade protection.

This system follows a Zero-Knowledge Security Model — your password is never stored, logged, or transmitted anywhere.

🚀 Features
🔐 Military-Grade Encryption

AES-256-GCM (authenticated encryption)

PBKDF2-SHA256 with 310,000 iterations

Random 128-bit salt per encryption

Random 96-bit IV for GCM

📦 Custom .sfl Secure File Format

A structured encrypted package containing:

Metadata (JSON)

Salt, IV, Algorithm details

Original filename

File size

Timestamp

Encrypted payload (ciphertext + auth tag)

🌐 Full-Stack Architecture

Frontend: React + Vite + TypeScript
Backend: FastAPI + Python + Cryptography library

🧭 User-Friendly Interface

Drag-and-drop file zone

Password strength meter

Real-time encryption progress

Language toggle (English / Hindi)

Direct download of encrypted/decrypted files

🧱 Tech Stack
Frontend

React 18

React Router

TypeScript

Tailwind CSS

Vite

Lucide Icons

Backend

FastAPI

Uvicorn

Python Cryptography library

PBKDF2-SHA256

AES-256-GCM

📂 Project Structure
surakshitam-secure-vault/
├── backend/
│   ├── main.py
│   ├── crypto_utils.py
│   ├── requirements.txt
│   └── README.md
├── src/
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   ├── lib/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html

🔌 API Endpoints
1. POST /encrypt

Encrypt a file.

Form-Data:

file: <UploadFile>
password: <string>


Returns:
Binary .sfl encrypted file

2. POST /decrypt

Decrypt a .sfl package.

Form-Data:

file: <UploadFile>
password: <string>


Returns:
Original plaintext file

3. POST /hash

Compute SHA-256 hash of any string.

value: "text"

4. POST /generate-password

Generate a strong random password.

length: <int>

🛠️ How to Run the Project
1️⃣ Clone the repository
git clone https://github.com/<your-username>/surakshitam-secure-vault.git
cd surakshitam-secure-vault

🖥️ 2️⃣ Start Backend (FastAPI)
cd backend
python -m venv .venv
source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000


Backend URL:

http://localhost:8000

💻 3️⃣ Start Frontend (React + Vite)
npm install
npm run dev


Frontend URL:

http://localhost:5173

🔒 Security Architecture
✔ Zero-Knowledge

Your password never leaves your device. Cache/logging is disabled.

✔ AES-256-GCM

Provides both encryption and authentication.

✔ PBKDF2 Hardened Key

310K iterations makes brute-force attacks slow and expensive.

✔ Cryptographic Randomness

Used for:

Salt

IV

Password generator

🧪 Testing the System
Encrypt a file:
curl -X POST -F "file=@input.txt" -F "password=Test123!" http://localhost:8000/encrypt --output encrypted.sfl

Decrypt a file:
curl -X POST -F "file=@encrypted.sfl" -F "password=Test123!" http://localhost:8000/decrypt --output output.txt

🚧 Future Enhancements

Cloud storage integration (AWS / Firebase)

Desktop app (Electron)

Mobile app (React Native)

Batch file encryption

Vault file explorer

Password manager integration

MFA-based encryption

QR-code encrypted sharing

👤 Maintainer

Anish Swarnakar
Creator of Surakshitam Secure Vault 🔐

📝 License

MIT License — free for personal and commercial use.
