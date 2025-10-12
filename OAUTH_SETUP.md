# OAuth Provider Setup Guide

This guide will help you set up Google and GitHub OAuth authentication for your Task Manager app.

## Prerequisites
- Access to your Supabase dashboard: https://app.supabase.com/project/yhpguvarecbljqhvymqp
- Google Cloud account (for Google OAuth)
- GitHub account (for GitHub OAuth)

## Step 1: Configure Google OAuth

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API or Google Identity API

### 1.2 Create OAuth Credentials
1. Go to "Credentials" in the Google Cloud Console
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure the consent screen if prompted
4. For Application Type, select "Web application"
5. Add Authorized redirect URIs:
   ```
   https://yhpguvarecbljqhvymqp.supabase.co/auth/v1/callback
   ```
6. Save and copy the Client ID and Client Secret

### 1.3 Configure in Supabase
1. Go to your Supabase dashboard
2. Navigate to Authentication > Providers
3. Find "Google" and click "Configure"
4. Enable Google authentication
5. Paste your Client ID and Client Secret
6. Save the configuration

## Step 2: Configure GitHub OAuth

### 2.1 Create GitHub OAuth App
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - Application name: "Task Manager"
   - Homepage URL: `http://localhost:5178` (for development)
   - Authorization callback URL: 
     ```
     https://yhpguvarecbljqhvymqp.supabase.co/auth/v1/callback
     ```
4. Register the application
5. Copy the Client ID and generate a Client Secret

### 2.2 Configure in Supabase
1. Go to your Supabase dashboard
2. Navigate to Authentication > Providers
3. Find "GitHub" and click "Configure"
4. Enable GitHub authentication
5. Paste your Client ID and Client Secret
6. Save the configuration

## Step 3: Update Your App

Once both providers are configured in Supabase, update your `AuthComponent.tsx`:

```tsx
// Change this line in AuthComponent.tsx
providers={[]}

// To this:
providers={['google', 'github']}
```

## Step 4: Test the Setup

1. Restart your development server
2. Try signing in with Google and GitHub
3. Check that users are created in your Supabase Authentication dashboard

## Production Setup

For production deployment, make sure to:
1. Update redirect URIs to use your production domain
2. Update the homepage URLs in OAuth applications
3. Set proper CORS settings in Supabase

## Troubleshooting

- **"Invalid redirect URI"**: Make sure the callback URL in your OAuth apps matches exactly: `https://yhpguvarecbljqhvymqp.supabase.co/auth/v1/callback`
- **Provider not appearing**: Check that the provider is enabled in Supabase dashboard
- **Authentication errors**: Check browser console for detailed error messages

## Security Notes

- Keep your Client Secrets secure
- Never commit OAuth credentials to version control
- Use environment variables for sensitive data in production
