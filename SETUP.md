# Firebase Setup Guide

## Prerequisites
You need to set up Firebase for the live user counter feature to work.

## Steps:

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard

### 2. Enable Realtime Database
1. In your Firebase project, go to "Realtime Database"
2. Click "Create Database"
3. Choose "Start in test mode" (you can secure it later)
4. Select a location (preferably close to your users)

### 3. Configure Database Rules
Go to the "Rules" tab and set:
```json
{
  "rules": {
    "activeUsers": {
      ".read": true,
      ".write": true
    },
    "userLogs": {
      ".read": true,
      ".write": true  
    }
  }
}
```

### 4. Get Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web app" icon (</>)
4. Register your app
5. Copy the configuration object

### 5. Setup Local Configuration
1. Copy `js/config.example.js` to `js/config.js`
2. Replace the placeholder values with your Firebase configuration
3. Save the file

```bash
cp js/config.example.js js/config.js
```

Then edit `js/config.js` with your actual Firebase credentials.

## Security Notes
- `js/config.js` is gitignored and will not be committed
- Keep your API keys secure
- For production, consider using Firebase security rules
- The current setup is for development/testing

## Troubleshooting
- Make sure `js/config.js` exists and has valid Firebase configuration
- Check browser console for any Firebase errors
- Verify database rules allow read/write access
- Ensure your database URL matches your region 