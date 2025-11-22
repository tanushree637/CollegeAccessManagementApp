# College Access Management System

A React Native application for managing college access with role-based authentication for Admin, Teachers, Students, and Guards.

## 🚀 Features

- **Role-based Authentication**: Login system for different user types
- **Admin Panel**: Create users, send notifications, view reports
- **Teacher Dashboard**: Assign tasks, manage timetables
- **Student Portal**: View tasks, notifications, and timetables
- **Guard Interface**: QR code scanning for access control
- **Firebase Integration**: Backend powered by Firebase Firestore

## 🎫 QR Attendance Flow

The system supports secure entry/exit tracking via signed QR tokens:

- Admin (or user dashboard) requests a token using `POST /api/admin/generate-qr` with `userId`, `role`, and `type` (`entry` or `exit`).
- The response returns a signed token (`base64Payload.signature`) embedded into a QR code.
- Guard scans the QR code using the `ScanQRScreen` (React Native) which:
  - Detects either a signed token or JSON payload.
  - Calls `POST /api/admin/record-attendance` with the token (preferred) or raw `userId` + `type`.
- Backend verifies token signature & expiry (5 min default) and writes an attendance record with timestamp and location.

QR Payload (before signing) example:

```json
{
  "userId": "abc123",
  "role": "student",
  "type": "entry",
  "iat": 1732212345000,
  "exp": 1732212645000
}
```

Fallback: If a plain JSON QR with `userId` & `type` is scanned, it will still record attendance, but signed tokens are recommended for integrity and expiry enforcement.

To test quickly:

```bash
curl -X POST http://localhost:5000/api/admin/generate-qr \
   -H "Content-Type: application/json" \
   -d '{"userId":"abc123","role":"student","type":"entry"}'

curl -X POST http://localhost:5000/api/admin/record-attendance \
   -H "Content-Type: application/json" \
   -d '{"token":"<PASTE_TOKEN_HERE>"}'
```

The mobile `ScanQRScreen` automatically reactivates the scanner after each scan and displays success/error feedback with an option to scan another code.

## 📋 Prerequisites

- Node.js (v18 or higher)
- React Native development environment
- Android Studio (for Android development)
- Xcode (for iOS development)
- Firebase account and project

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/tanushree637/CollegeAccessManagementApp.git
cd CollegeAccessManagement
```

### 2. Install dependencies

**Frontend (React Native):**

```bash
npm install
```

**Backend:**

```bash
cd backend
npm install
```

### 3. Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Download the service account key JSON file
4. Rename it to `serviceAccountKey.json` and place it in the `backend/` directory
5. Create a `.env` file in the `backend/` directory:

```env
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```

### 4. Configure API URL

Edit `config/config.js` and update the BASE_URL:

- For Android Emulator: `http://10.0.2.2:5000`
- For iOS Simulator: `http://localhost:5000`
- For Physical Device: `http://YOUR_COMPUTER_IP:5000`

## 🏃‍♂️ Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

### Add Test Users (First Time Setup)

```bash
cd backend
npm run add-test-users
```

### Start the React Native Application

```bash
# In the root directory
npx react-native start

# In another terminal
npx react-native run-android
# or
npx react-native run-ios
```

## 👥 Test Accounts

After running the test users script, you can login with:

- **Admin**: admin@college.com / admin123
- **Teacher**: teacher@college.com / teacher123
- **Student**: student@college.com / student123
- **Guard**: guard@college.com / guard123

## 📱 Project Structure

```
├── android/              # Android native code
├── ios/                   # iOS native code
├── backend/              # Node.js backend
│   ├── config/           # Firebase configuration
│   ├── controllers/      # API controllers
│   ├── routes/           # API routes
│   ├── models/           # Data models
│   ├── utils/            # Utility functions
│   └── scripts/          # Setup scripts
├── components/           # Reusable React components
├── screens/              # Screen components
│   ├── Admin/            # Admin screens
│   ├── Auth/             # Authentication screens
│   ├── Teacher/          # Teacher screens
│   ├── Student/          # Student screens
│   └── Guard/            # Guard screens
├── navigation/           # Navigation configuration
├── context/              # React Context (Auth)
├── config/               # App configuration
└── utils/                # Utility functions
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (Admin only)

### Admin Routes

- `GET /api/admin/dashboard` - Admin dashboard data
- `POST /api/admin/users` - Create new user
- `GET /api/admin/reports` - View reports

### Teacher Routes

- `GET /api/teacher/dashboard` - Teacher dashboard
- `POST /api/teacher/tasks` - Assign tasks

### Student Routes

- `GET /api/student/dashboard` - Student dashboard
- `GET /api/student/tasks` - View assigned tasks

### Guard Routes

- `GET /api/guard/dashboard` - Guard dashboard
- `POST /api/guard/scan` - QR code scanning

## 🧹 Recent Fixes

- ✅ Fixed backend entry point (server.js → index.js)
- ✅ Removed duplicate dependencies
- ✅ Updated Firebase configuration with .env support
- ✅ Added proper password validation
- ✅ Made API URL configurable
- ✅ Cleaned up build artifacts
- ✅ Added comprehensive .gitignore
- ✅ Fixed authentication flow
- ✅ Added test user setup script

## 🐛 Troubleshooting

### Common Issues

1. **Login not working**:

   - Make sure backend server is running
   - Check API URL in `config/config.js`
   - Verify test users are added to Firebase

2. **Firebase connection issues**:

   - Verify service account key is correctly placed
   - Check Firebase project settings
   - Ensure Firestore is enabled

3. **Network errors**:
   - For physical devices, use your computer's IP address
   - Check firewall settings
   - Ensure both devices are on the same network

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Developer

**Tanushree Srivastav**

- GitHub: [@tanushree637](https://github.com/tanushree637)

---

For support or questions, please create an issue in the GitHub repository.
