# Firebase Setup Guide

## Firebase Configuration Error Fix

If you're getting the error: `Firebase: Error (auth/api-key-not-valid)`, follow these steps:

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `stylish-decoration`
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Authentication
1. In your Firebase project, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Google" sign-in provider
5. Add your domain to authorized domains

### 3. Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web app" icon (</>)
4. Register your app with name: `stylish-decoration-web`
5. Copy the configuration object

### 4. Update .env File
Replace the placeholder values in your `.env` file with real Firebase credentials:

```env
# Replace these with your actual Firebase project credentials
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
VITE_FIREBASE_AUTH_DOMAIN=stylish-decoration.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=stylish-decoration
VITE_FIREBASE_STORAGE_BUCKET=stylish-decoration.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789012345678
```

### 5. Restart Development Server
After updating the .env file:
```bash
npm run dev
```

## Alternative: Disable Google Login
If you don't want to use Google login, you can comment out the Google login button in the Login component.

## Security Notes
- Never commit real Firebase credentials to version control
- Add `.env` to your `.gitignore` file
- Use environment variables in production