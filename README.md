# SmileScan – AI Dental Clinical Decision Support System

SmileScan is an enterprise-grade medical application designed for dental clinics and healthcare providers. It provides automated AI-assisted dental image diagnostic support, patient record management, intelligent scheduling, and printable medical PDF reports.

---

## 🌟 Key Features

- **Doctor & Admin Authentication**: Role-based access control powered by Firebase Authentication and JWT tokens.
- **AI Clinical Decision Support**: Automated analysis of dental radiographs (X-rays, intraoral photos) detecting pathology (Caries, Periodontitis, Impacted Molars, Gingivitis, Periapical Lesion) with confidence percentages, FDI tooth numbering (1-32 / 11-48), and severity ratings.
- **Interactive Dental Chart**: Visual tooth map highlighting teeth with detected conditions and treatment recommendations.
- **Patient Management**: Full patient profiles with medical history, dental records, scan timelines, and uploaded radiograph history.
- **Appointment Management**: Interactive calendar and list view for tracking upcoming, completed, and cancelled patient appointments.
- **PDF Report Generation**: One-click professional medical PDF reports with hospital header, doctor details, diagnostic summaries, prescribed medicines, and digital sign fields.
- **Admin Dashboard**: System analytics, doctor management, patient management overview, and audit trail logs.
- **Modern Medical UI/UX**: Designed with Tailwind CSS, Framer Motion animations, dark mode support, and responsive layouts for desktop, tablet, and mobile.

---

## 🏗️ Project Structure

```text
SSD/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   ├── common/
│   │   │   ├── dental/
│   │   │   └── layout/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── appointments/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── patients/
│   │   │   ├── profile/
│   │   │   ├── reports/
│   │   │   ├── scan/
│   │   │   └── settings/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── .env
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Firebase Account** *(Optional - application includes zero-config fallback mode for instant local testing)*

---

## ⚡ Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend server runs on `http://localhost:5000`.

### 2. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The frontend application runs on `http://localhost:5173`.

---

## 🔑 Firebase Configuration Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named `SmileScan`.
3. Enable **Authentication** (Email/Password sign-in method).
4. Create a **Cloud Firestore** database.
5. Create a **Firebase Storage** bucket.
6. Obtain your web app configuration keys and service account key.
7. Add the keys to `frontend/.env` and `backend/.env` as indicated in `.env.example`.

### Frontend `.env` Example:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=smilescan.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=smilescan
VITE_FIREBASE_STORAGE_BUCKET=smilescan.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend `.env` Example:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=smilescan_super_secret_jwt_key_2026
FIREBASE_PROJECT_ID=smilescan
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@smilescan.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## 🧪 Demo Credentials

When running in Demo Mode (or with initialized mock data):

- **Doctor Account**: `doctor@smilescan.com` / `password123`
- **Admin Account**: `admin@smilescan.com` / `admin123`

---

## 📄 License

This project is proprietary and intended for clinical decision support system demonstration and deployment.
