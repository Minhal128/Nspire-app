# Quick Setup Guide

## Installation Steps

1. **Navigate to the project directory**:
   ```bash
   cd H:\Development\Inspire\app
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Start the Expo development server**:
   ```bash
   npm start
   ```

4. **Run on your device**:
   - Press `a` for Android emulator
   - Press `i` for iOS simulator (Mac only)
   - Scan QR code with Expo Go app on your phone

## TypeScript Errors

The lint errors you see are normal before installing packages. They will disappear after running `npm install`.

## Project Status

✅ All screens created:
- BoardingScreen.tsx - Onboarding with user role selection
- SignInScreen.tsx - Login with social auth options
- SignUpScreen.tsx - Registration form
- DashboardScreen.tsx - Property management dashboard with ScrollView

✅ TypeScript configuration complete
✅ Navigation setup complete
✅ Expo 54 configuration ready

## Testing

After installation, you can test the app flow:
1. Start on Boarding screen
2. Select Inspector or Management
3. Sign in or create account
4. View dashboard with scrollable properties

## Troubleshooting

If you encounter any issues:

1. **Clear cache**:
   ```bash
   npm start -- --clear
   ```

2. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Check Node version** (should be 18+):
   ```bash
   node --version
   ```

## Next Steps

- Run `npm install` to install all dependencies
- Start the dev server with `npm start`
- Open on your device or emulator
- Test the authentication flow
