# Clerk OAuth Setup Guide

## Current Configuration
- **Clerk Domain**: `light-mutt-72.clerk.accounts.dev`
- **Clerk Publishable Key**: `pk_test_bGlnaHQtbXV0dC03Mi5jbGVyay5hY2NvdW50cy5kZXYk`
- **Google OAuth Client ID**: `164266308190-eg3kmmr0pv7d3b5h5bicnj2jpbb17alr.apps.googleusercontent.com`
- **Redirect URL**: `https://light-mutt-72.clerk.accounts.dev/v1/oauth_callback`

## 1. Install Required Packages

```bash
npm install @clerk/clerk-expo
npx expo install expo-linking expo-auth-session expo-crypto
```

## 2. Environment Variables

Create/update `.env` file:
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bGlnaHQtbXV0dC03Mi5jbGVyay5hY2NvdW50cy5kZXYk
```

## 3. Google OAuth Configuration

### In Google Cloud Console:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Enable Google+ API and Google Sign-In API
4. Go to "Credentials" → "OAuth 2.0 Client IDs"
5. For your **Android** client:
   - Application type: Android
   - Package name: `com.inspire.app`
   - SHA-1 certificate fingerprint: (get from `expo credentials:manager`)

6. For your **iOS** client:
   - Application type: iOS
   - Bundle ID: `com.inspire.app`

7. For **Web** client (required for Clerk):
   - Application type: Web application
   - Authorized redirect URIs:
     - `https://light-mutt-72.clerk.accounts.dev/v1/oauth_callback`
     - `https://light-mutt-72.clerk.accounts.dev/v1/oauth_callback/google`

### In Clerk Dashboard:
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Go to "User & Authentication" → "Social Connections"
4. Enable Google
5. Add your Google OAuth credentials:
   - **Client ID**: Your Google Web Client ID (not Android/iOS)
   - **Client Secret**: Your Google Web Client Secret

## 4. Facebook OAuth Configuration

### In Facebook Developers Console:
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create/select your app
3. Add "Facebook Login" product
4. In Facebook Login settings:
   - Valid OAuth Redirect URIs:
     - `https://light-mutt-72.clerk.accounts.dev/v1/oauth_callback`
     - `https://light-mutt-72.clerk.accounts.dev/v1/oauth_callback/facebook`
   - Valid OAuth Redirect URIs for Web:
     - `https://light-mutt-72.clerk.accounts.dev/v1/oauth_callback/facebook`

### In Clerk Dashboard:
1. Go to "Social Connections"
2. Enable Facebook
3. Add your Facebook credentials:
   - **App ID**: Your Facebook App ID
   - **App Secret**: Your Facebook App Secret

## 5. Update app.json

Add the following to your `app.json`:

```json
{
  "expo": {
    "scheme": "inspire",
    "plugins": [
      "expo-font",
      [
        "expo-build-properties",
        {
          "ios": {
            "deploymentTarget": "15.1"
          },
          "android": {
            "usesCleartextTraffic": true
          }
        }
      ]
    ],
    "ios": {
      "bundleIdentifier": "com.inspire.app",
      "associatedDomains": [
        "applinks:light-mutt-72.clerk.accounts.dev"
      ]
    },
    "android": {
      "package": "com.inspire.app",
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "light-mutt-72.clerk.accounts.dev"
            },
            {
              "scheme": "inspire"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

## 6. App Integration

### Root App Component (App.tsx):

```tsx
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function App() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      {/* Your app content */}
    </ClerkProvider>
  );
}
```

### Sign In Component:

```tsx
import { useOAuth } from '@clerk/clerk-expo';
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser';

export default function SignInScreen() {
  useWarmUpBrowser();

  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startFacebookFlow } = useOAuth({ strategy: 'oauth_facebook' });

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleFlow();
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startFacebookFlow();
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleGoogleSignIn}>
        <Text>Sign in with Google</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleFacebookSignIn}>
        <Text>Sign in with Facebook</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Warm Up Browser Hook (hooks/useWarmUpBrowser.ts):

```tsx
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};
```

## 7. Common Issues and Solutions

### Issue: "Invalid redirect URI"
**Solution**: Make sure all redirect URIs are exactly:
- `https://light-mutt-72.clerk.accounts.dev/v1/oauth_callback`
- `https://light-mutt-72.clerk.accounts.dev/v1/oauth_callback/google`
- `https://light-mutt-72.clerk.accounts.dev/v1/oauth_callback/facebook`

### Issue: Google OAuth not working on Android
**Solution**: 
1. Get your SHA-1 fingerprint: `expo credentials:manager`
2. Add it to Google Cloud Console → Credentials → Android OAuth client

### Issue: Facebook OAuth not working
**Solution**:
1. Ensure your Facebook app is in "Live" mode (not Development)
2. Add your domain to Facebook app settings
3. Verify redirect URIs are correct

## 8. Testing

1. Run `expo start`
2. Test on both iOS and Android devices/simulators
3. Check Clerk dashboard for successful sign-ins
4. Verify user data is properly stored

## 9. Additional Clerk Configuration

In your Clerk dashboard, you can also configure:
- User profile fields
- Session settings
- Email/SMS verification
- Multi-factor authentication
- Custom domains

## Troubleshooting

If OAuth still doesn't work:
1. Check Clerk dashboard logs
2. Verify all redirect URIs match exactly
3. Ensure OAuth apps are properly configured
4. Test with Clerk's development keys first
5. Check network connectivity and firewall settings