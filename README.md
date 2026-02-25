# 🎓 Tutor Finder

<div align="center">

![Tutor Finder](https://img.shields.io/badge/Tutor-Finder-indigo?style=for-the-badge)
![License](https://img.shields.io/badge/license-ISC-green?style=for-the-badge)

**Connect with Expert Tutors. Transform Your Learning Journey.**

[Tutor Finder](https://tutor-finder-kvwb.vercel.app)
</div>

---

## 📖 About The Project

Tutor Finder is a comprehensive full-stack web platform that bridges the gap between students and qualified tutors. Built with modern technologies, it provides a seamless experience for finding personalized educational support across all subjects and grade levels.

### ✨ Key Highlights

- 🔍 **Smart Tutor Search** - Filter by subject, location, experience, and ratings
- 💬 **Real-time Messaging** - Direct communication between students and tutors
- 🤖 **AI Assistant** - Powered by Google Gemini for instant educational support
- 💳 **Secure Payments** - Integrated with Razorpay for safe transactions
- ⭐ **Rating System** - Transparent reviews and ratings for tutors
- 📱 **Responsive Design** - Seamless experience across all devices
- 🔐 **Secure Authentication** - JWT-based auth with Google OAuth integration
- 📞 **OTP Verification** - SMS verification via Twilio

---

## 🚀 Features

### For Students/Parents
- Browse and search verified tutors by subject, location, and price
- View detailed tutor profiles with qualifications and reviews
- Save favorite tutors for quick access
- Chat with tutors before booking
- Rate and review tutors after sessions
- Secure payment processing
- AI-powered study assistant
- Dashboard to manage bookings and favorites

### For Tutors
- Create comprehensive profiles showcasing expertise
- Set availability and hourly rates
- Receive and manage student requests
- Chat with potential students
- Track ratings and reviews
- Update profile and qualifications
- Dashboard to manage student interactions

### Admin Features
- User verification system
- Content moderation
- Analytics and reporting
- Partner management

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router DOM 7** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Icons** - Icon library
- **React Toastify** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Passport.js** - OAuth middleware
- **Bcrypt.js** - Password hashing

### Third-Party Services
- **Google Gemini AI** - AI-powered study assistant
- **Twilio** - SMS/OTP verification
- **Razorpay** - Payment gateway
- **Google OAuth 2.0** - Social authentication
- **Vercel** - Deployment platform
- **MongoDB Atlas** - Cloud database

---

## 🎬 Preview

<div align="center">

### 🌟 Live Demo

Experience Tutor Finder in action: **[Visit Website](https://tutor-finder-kvwb.vercel.app)**

</div>

### 📸 Platform Highlights

<details>
<summary><b>🏠 Home Page</b> - Welcome to your learning journey</summary>

- Modern, intuitive interface
- Quick stats and highlights
- Easy navigation to find tutors
- Responsive design for all devices

</details>

<details>
<summary><b>🔍 Tutor Search</b> - Find your perfect match</summary>

- Advanced filtering options
- Search by subject, location, and price
- Real-time results
- Detailed tutor cards with ratings

</details>

<details>
<summary><b>👨‍🏫 Tutor Profiles</b> - Comprehensive information</summary>

- Complete tutor credentials
- Subject expertise and qualifications
- Student reviews and ratings
- Direct contact options

</details>

<details>
<summary><b>💬 Chat Interface</b> - Seamless communication</summary>

- Direct messaging with tutors
- Real-time conversations
- Message history
- User-friendly chat interface

</details>

<details>
<summary><b>🤖 AI Assistant</b> - 24/7 study help</summary>

- Powered by Google Gemini AI
- Instant answers to study questions
- Subject-specific guidance
- Natural conversation flow

</details>

<details>
<summary><b>📊 Dashboards</b> - Manage everything in one place</summary>

- **Parent Dashboard**: Track favorites, messages, and bookings
- **Tutor Dashboard**: Manage profile, view reviews, handle requests
- Clean, organized interface
- Quick access to all features

</details>

## 📱 Screenshots
<div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
<img width="45%" alt="Home Page" src="https://github.com/user-attachments/assets/14ea4bd9-35e4-4f29-a0d8-1c5e4762b457" />
<img width="45%" alt="Tutor Search" src="https://github.com/user-attachments/assets/88038077-889b-4c2e-a1c1-11c2397ddce2" />
<img width="45%" alt="Chat Interface" src="https://github.com/user-attachments/assets/3359fe71-d851-469f-aa63-e4189c7415d0" />
<img width="45%" alt="Dashboard" src="https://github.com/user-attachments/assets/6042c558-373f-4229-ac8b-157319f4576f" />
</div>



---

## 🚀 Getting Started

### Quick Start for Users

1. **Visit the Website**: Go to [tutor-finder-kvwb.vercel.app](https://tutor-finder-kvwb.vercel.app)
2. **Sign Up**: Create an account as a Student/Parent or Tutor
3. **Verify**: Complete phone verification for security
4. **Start Learning**: Browse tutors or set up your tutor profile
5. **Connect**: Chat with tutors and book sessions

### For Developers

Want to run this project locally? Follow these steps:

#### Prerequisites
- Node.js (v16 or higher) - [Download](https://nodejs.org/)
- MongoDB account - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- API keys from Google Cloud, Twilio, and Razorpay

#### Installation

**Step 1: Clone the repository**
```bash
git clone https://github.com/yourusername/tutor-finder.git
cd tutor-finder
```

**Step 2: Setup Backend**
```bash
cd server
npm install
```

Create `.env` file in `server` directory with your configuration:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:5173
```

**Step 3: Setup Frontend**
```bash
cd ../template
npm install
```

Create `.env` file in `template` directory:
```env
VITE_API_URL=http://localhost:5001
```

**Step 4: Run the Application**

Start Backend (Terminal 1):
```bash
cd server
npm run dev
```

Start Frontend (Terminal 2):
```bash
cd template
npm run dev
```

**Step 5: Open in Browser**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5001`

---

## 🎨 Features in Detail

### 🔐 Authentication System
- Email/Password registration with JWT tokens
- Google OAuth 2.0 integration
- Phone number verification via OTP
- Role-based access control (Parent/Tutor)
- Secure password hashing with bcrypt
- HTTP-only cookies for token storage

### 👨‍🏫 Tutor Management
- Comprehensive profile creation
- Multi-subject teaching capability
- Qualification and experience showcase
- Hourly rate setting
- Profile activation/deactivation
- Rating and review system

### 🔍 Smart Search & Filtering
- Search by subject, location, and price range
- Filter by experience level
- Sort by ratings, price, and availability
- Real-time search results

### 💬 Messaging System
- Real-time chat between parents and tutors
- Conversation history
- Unread message indicators
- Direct communication before booking

### 🤖 AI Study Assistant
- Powered by Google Gemini AI
- Instant answers to study questions
- Subject-specific assistance
- Natural language processing
- Context-aware responses

### 💳 Payment Integration
- Secure payment processing with Razorpay
- Multiple payment methods support
- Transaction history
- Payment verification

### ⭐ Rating & Review System
- 5-star rating system
- Written reviews
- Average rating calculation
- Review moderation

---

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.

---


</div>
