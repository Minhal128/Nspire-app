# Inspire App - Setup Guide

## Overview
Inspire is a property inspection management application built with React Native and Expo SDK 54. It provides separate interfaces for property inspectors and management personnel.

## Features
- 🏢 **Dual Interface**: Separate workflows for Inspectors and Management
- 📱 **Cross-Platform**: Runs on iOS, Android, and Web
- 🎨 **Modern UI**: Beautiful, intuitive interface with smooth animations
- 🔐 **Secure Authentication**: User authentication and data storage
- 📊 **Property Management**: Comprehensive property listing and management

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or newer): [Download](https://nodejs.org/)
- **npm** (v9 or newer) or **Yarn** (v1.22 or newer)
- **Expo CLI**: Install globally with `npm install -g expo-cli`
- **Git**: [Download](https://git-scm.com/)

### For iOS Development
- **macOS** (required for iOS development)
- **Xcode** (latest version)
- **CocoaPods**: Install with `sudo gem install cocoapods`

### For Android Development
- **Android Studio** with Android SDK
- **Java Development Kit (JDK)** v17 or newer
- Configure Android SDK path in environment variables

## Installation Steps

### 1. Clone the Repository
```bash
cd H:\Development\Inspire\app
```

### 2. Install Dependencies
```bash
npm install
```

Or using Yarn:
```bash
yarn install
```

### 3. Clean Install (if you face issues)
```bash
# Delete node_modules and lock files
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Running the Application

### Development Mode with Expo Go
```bash
npm start
```
This will open the Expo Developer Tools in your browser. You can then:
- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Scan the QR code with Expo Go app on your physical device

### Development Build (Recommended for Full Features)
```bash
npm run start
```

### Platform-Specific Commands

#### iOS
```bash
npm run ios
```

#### Android
```bash
npm run android
```

#### Web
```bash
npm run web
```

### Clean Start (Clear Cache)
```bash
npm run clean
```

## Project Structure

```
inspire-app/
├── src/
│   ├── screens/          # Screen components
│   │   ├── BoardingScreen.tsx
│   │   ├── SignInScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   └── DashboardScreen.tsx
│   ├── types/            # TypeScript type definitions
│   │   └── navigation.ts
│   ├── constants/        # App constants
│   │   ├── Colors.ts
│   │   ├── Layout.ts
│   │   └── index.ts
│   └── utils/            # Utility functions
│       ├── validation.ts
│       ├── storage.ts
│       └── index.ts
├── assets/               # Images, fonts, etc.
├── App.tsx              # Root component
├── app.json             # Expo configuration
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript configuration
```

## Configuration

### Environment Variables (Optional)
Create a `.env` file in the root directory for environment-specific configurations:

```env
API_URL=https://your-api-url.com
API_KEY=your-api-key
```

### EAS Configuration
The app is configured for EAS Build and Updates. To use these features:

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure builds:
```bash
eas build:configure
```

## Building for Production

### Create Development Build
```bash
eas build --profile development --platform android
eas build --profile development --platform ios
```

### Create Production Build
```bash
eas build --profile production --platform android
eas build --profile production --platform ios
```

### Submit to App Stores
```bash
eas submit --platform ios
eas submit --platform android
```

## Technologies Used

- **React Native**: 0.81.4
- **Expo SDK**: 54.0.13
- **React**: 19.1.0
- **TypeScript**: 5.9.2
- **React Navigation**: 6.1.18
- **React Native Reanimated**: 4.1.1

## Key Dependencies

- `@expo/vector-icons`: Icon library
- `@react-navigation/native`: Navigation framework
- `@react-navigation/stack`: Stack navigator
- `@react-native-picker/picker`: Dropdown picker
- `@react-native-async-storage/async-storage`: Data persistence
- `expo-linear-gradient`: Gradient backgrounds
- `expo-haptics`: Haptic feedback
- `react-native-gesture-handler`: Touch gestures
- `react-native-reanimated`: Smooth animations

## Troubleshooting

### Common Issues

#### 1. Metro Bundler Issues
```bash
# Clear Metro cache
npm run clean

# Or manually
npx expo start --clear
```

#### 2. iOS Build Errors
```bash
# Navigate to ios folder and reinstall pods
cd ios
pod deintegrate
pod install
cd ..
```

#### 3. Android Build Errors
```bash
# Clean Android build
cd android
./gradlew clean
cd ..
```

#### 4. Dependency Conflicts
```bash
# Force install with legacy peer deps
npm install --legacy-peer-deps
```

#### 5. TypeScript Errors
```bash
# Regenerate TypeScript types
npx expo customize tsconfig.json
```

### Getting Help

- **Expo Documentation**: https://docs.expo.dev/
- **React Native Documentation**: https://reactnative.dev/
- **GitHub Issues**: Create an issue in the repository

## Development Tips

1. **Hot Reloading**: Save files to see changes instantly
2. **Fast Refresh**: Preserves component state during edits
3. **Debug Menu**: Shake device or press Cmd+D (iOS) / Cmd+M (Android)
4. **Remote Debugging**: Enable in Debug Menu for Chrome DevTools
5. **Performance Monitor**: Enable in Debug Menu to track FPS

## Code Quality

### Linting
```bash
# Run ESLint (when configured)
npm run lint
```

### Type Checking
```bash
# Check TypeScript types
npx tsc --noEmit
```

## Updates and Maintenance

### Updating Expo SDK
```bash
# Update to latest compatible versions
npx expo install --fix
```

### Checking for Outdated Packages
```bash
npm outdated
```

## License

Private - All rights reserved

## Contact

For questions or support, please contact the development team.

---

**Last Updated**: November 2024  
**Expo SDK Version**: 54.0.13  
**Minimum iOS Version**: 13.4  
**Minimum Android Version**: 5.0 (API 21)
