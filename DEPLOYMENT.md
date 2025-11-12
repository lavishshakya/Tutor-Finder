# 🚀 Complete Production Deployment Guide

This guide will help you deploy both backend and frontend to Vercel and make them production-ready.

## 📋 Prerequisites

1. Vercel CLI installed: `npm install -g vercel`
2. MongoDB Atlas account with database created
3. All API keys ready (Google OAuth, Twilio, Razorpay, Gemini)

---

## 🔧 Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to **Network Access**
3. Click **Add IP Address**
4. Select **Allow Access from Anywhere** (`0.0.0.0/0`)
5. Click **Confirm**

> This allows Vercel serverless functions to connect to your database

---

## �️ Step 2: Deploy Backend (API Server)

### 2.1 Navigate to server directory

```bash
cd server
```

### 2.2 Deploy to Vercel

```bash
vercel
```

Follow the prompts:

- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? `tutor-finder-api` (or your choice)
- Directory? **./server** (if asked)
- Override settings? **N**

### 2.3 Add Environment Variables

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

Add these **one by one** (select **Production**, **Preview**, and **Development**):

| Variable               | Value Example / Description                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `MONGO_URI`            | `mongodb+srv://username:password@cluster.mongodb.net/database_name` (from MongoDB Atlas) |
| `JWT_SECRET`           | `your_strong_random_jwt_secret_here` (generate a secure random string)                   |
| `JWT_EXPIRE`           | `30d`                                                                                    |
| `JWT_COOKIE_EXPIRE`    | `30`                                                                                     |
| `NODE_ENV`             | `production`                                                                             |
| `GEMINI_API_KEY`       | `your_google_gemini_api_key` (from Google AI Studio)                                     |
| `GOOGLE_CLIENT_ID`     | `your-client-id.apps.googleusercontent.com` (from Google Cloud Console)                  |
| `GOOGLE_CLIENT_SECRET` | `your_google_oauth_client_secret` (from Google Cloud Console)                            |
| `SESSION_SECRET`       | `your_strong_random_session_secret` (generate a secure random string)                    |
| `TWILIO_ACCOUNT_SID`   | `your_twilio_account_sid` (from Twilio Console)                                          |
| `TWILIO_AUTH_TOKEN`    | `your_twilio_auth_token` (from Twilio Console)                                           |
| `TWILIO_PHONE_NUMBER`  | `+1234567890` (your Twilio phone number)                                                 |
| `RAZORPAY_KEY_ID`      | `your_razorpay_key_id` (from Razorpay Dashboard)                                         |
| `RAZORPAY_KEY_SECRET`  | `your_razorpay_key_secret` (from Razorpay Dashboard)                                     |

> **Note:** Replace all placeholder values with your actual API keys and credentials from your local `.env` file

**Don't add these yet - we'll update them in Step 4:**

- `GOOGLE_CALLBACK_URL`
- `FRONTEND_URL`

### 2.4 Copy Your Backend URL

After saving environment variables, Vercel will automatically redeploy.

Copy your backend URL from Vercel dashboard (e.g., `https://tutor-finder-api.vercel.app`)

## 🎨 Step 3: Deploy Frontend (React App)

### 3.1 Navigate to template directory

```bash
cd ../template
```

### 3.2 Deploy to Vercel

```bash
vercel
```

Follow the prompts:

- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? `tutor-finder` (or your choice)
- Directory? **./template** (if asked)
- Override settings? **N**

### 3.3 Add Environment Variable

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Frontend Project → Settings → Environment Variables

Add:

| Variable       | Value                                                          |
| -------------- | -------------------------------------------------------------- |
| `VITE_API_URL` | Your backend URL (e.g., `https://tutor-finder-api.vercel.app`) |

Select **Production**, **Preview**, and **Development**

### 3.4 Copy Your Frontend URL

Copy your frontend URL from Vercel dashboard (e.g., `https://tutor-finder.vercel.app`)

---

## 🔗 Step 4: Connect Backend and Frontend

### 4.1 Update Backend Environment Variables

Go back to your **Backend Project** in Vercel → Settings → Environment Variables

Add/Update these two:

| Variable              | Value                                                          |
| --------------------- | -------------------------------------------------------------- |
| `GOOGLE_CALLBACK_URL` | `https://YOUR-BACKEND-URL.vercel.app/api/auth/google/callback` |
| `FRONTEND_URL`        | `https://YOUR-FRONTEND-URL.vercel.app`                         |

**Example:**

```
GOOGLE_CALLBACK_URL=https://tutor-finder-api.vercel.app/api/auth/google/callback
FRONTEND_URL=https://tutor-finder.vercel.app
```

### 4.2 Update Google OAuth Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Select your OAuth 2.0 Client ID
4. Add Authorized redirect URIs:
   - `https://YOUR-BACKEND-URL.vercel.app/api/auth/google/callback`
5. Add Authorized JavaScript origins:
   - `https://YOUR-FRONTEND-URL.vercel.app`
   - `https://YOUR-BACKEND-URL.vercel.app`
6. Click **Save**

---

## ✅ Step 5: Verify Deployment

### 5.1 Test Backend

Visit: `https://YOUR-BACKEND-URL.vercel.app/api/auth`

You should see a JSON response (not an error)

### 5.2 Test Frontend

Visit: `https://YOUR-FRONTEND-URL.vercel.app`

Your app should load correctly

### 5.3 Test Full Flow

1. Try to sign up/login
2. Test Google OAuth login
3. Test tutor/parent functionality

---

## 🔄 Updating Your Deployment

### When you make code changes:

**Backend:**

```bash
cd server
git add .
git commit -m "Update backend"
git push
# Vercel auto-deploys from GitHub
```

**Frontend:**

```bash
cd template
git add .
git commit -m "Update frontend"
git push
# Vercel auto-deploys from GitHub
```

### Manual Deployment:

```bash
# Backend
cd server
vercel --prod

# Frontend
cd template
vercel --prod
```

---

## 🔐 Security Checklist

- [ ] Changed `JWT_SECRET` to a strong random string
- [ ] Changed `SESSION_SECRET` to a strong random string
- [ ] MongoDB Network Access allows `0.0.0.0/0`
- [ ] All environment variables added to Vercel
- [ ] Google OAuth redirect URLs updated
- [ ] CORS configured with production frontend URL
- [ ] All secrets are in environment variables (not in code)

---

## 🐛 Troubleshooting

### "This Serverless Function has crashed"

**Solution:**

1. Check Vercel → Your Project → Functions → View Logs
2. Ensure all environment variables are added
3. Check MongoDB Atlas allows Vercel IPs (`0.0.0.0/0`)

### CORS Errors

**Solution:**

1. Verify `FRONTEND_URL` is set correctly in backend env vars
2. Check browser console for exact error
3. Ensure credentials are enabled in CORS config

### Google OAuth not working

**Solution:**

1. Verify `GOOGLE_CALLBACK_URL` matches Google Console redirect URI
2. Check both frontend and backend URLs are in Google Console origins
3. Clear browser cache and cookies

### MongoDB connection timeout

**Solution:**

1. MongoDB Atlas → Network Access → Allow `0.0.0.0/0`
2. Check `MONGO_URI` environment variable is correct
3. Verify MongoDB cluster is running

---

## 📝 Environment Variables Reference

### Backend (Production)

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=<strong-random-string>
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
NODE_ENV=production
GEMINI_API_KEY=<your-gemini-key>
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
GOOGLE_CALLBACK_URL=https://YOUR-BACKEND.vercel.app/api/auth/google/callback
SESSION_SECRET=<strong-random-string>
TWILIO_ACCOUNT_SID=<your-twilio-sid>
TWILIO_AUTH_TOKEN=<your-twilio-token>
TWILIO_PHONE_NUMBER=<your-twilio-number>
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
FRONTEND_URL=https://YOUR-FRONTEND.vercel.app
```

### Frontend (Production)

```
VITE_API_URL=https://YOUR-BACKEND.vercel.app
```

---

## 🌐 URLs Structure

- **Backend API**: `https://tutor-finder-api.vercel.app` (your actual backend URL)
- **Frontend**: `https://tutor-finder.vercel.app` (your actual frontend URL)
- **API Endpoints**: `https://tutor-finder-api.vercel.app/api/*`

---

## 🎯 Quick Deploy Checklist

- [ ] MongoDB Atlas Network Access configured (`0.0.0.0/0`)
- [ ] Backend deployed to Vercel
- [ ] All backend environment variables added
- [ ] Frontend deployed to Vercel
- [ ] Frontend `VITE_API_URL` points to backend
- [ ] Backend `FRONTEND_URL` points to frontend
- [ ] Google OAuth redirect URLs updated
- [ ] Tested: Sign up, Login, Google OAuth
- [ ] Tested: Tutor/Parent features work

---

🎉 **Congratulations! Your app is now live in production!**

---

## 📝 Important Notes

1. **MongoDB Atlas**: Make sure to whitelist Vercel IPs or use `0.0.0.0/0` in MongoDB Network Access
2. **CORS**: The server is configured to accept requests from your frontend domain
3. **Environment Variables**: Always add sensitive data in Vercel Dashboard, never commit .env files
4. **Google OAuth**: Update callback URL to your production backend domain
5. **Two Separate Projects**: You'll have two separate Vercel projects with different URLs

---

## 🔗 Final Setup

After both deployments:

1. Update `FRONTEND_URL` in backend environment variables with actual frontend URL
2. Update `VITE_API_URL` in frontend environment variables with actual backend URL
3. Update Google OAuth callback URL
4. Redeploy both if needed

---

## 🌐 URLs Structure

- **Backend**: `https://tutor-finder-api.vercel.app` (or your custom domain)
- **Frontend**: `https://tutor-finder.vercel.app` (or your custom domain)
- **API Endpoints**: `https://tutor-finder-api.vercel.app/api/*`
