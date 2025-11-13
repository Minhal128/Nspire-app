# 🚀 Quick Start Guide - Inspire App

## Getting Started in 3 Steps

### 1. Dependencies Installed ✅
All dependencies have been installed and configured for Expo SDK 54.

### 2. Start Development Server
```bash
npm start
```

This will open Expo Dev Tools. You can then:
- Press `a` for Android emulator
- Press `i` for iOS simulator (macOS only)
- Press `w` for web browser
- Scan QR code with Expo Go app on your phone

### 3. Alternative: Run Directly on Platform
```bash
# Android
npm run android

# iOS (macOS only)
npm run ios

# Web
npm run web
```

## 📱 What's New in This Redesign

### ✨ Upgraded to Expo SDK 54
- **React Native**: 0.75.4 → 0.81.4
- **React**: 18.3.1 → 19.1.0
- **Expo**: 54.0.0 → 54.0.13
- **TypeScript**: 5.3.3 → 5.9.2

### 🎯 New Features Added
1. **Constants System**: Centralized colors, spacing, fonts in `src/constants/`
2. **Utility Functions**: Validation and storage helpers in `src/utils/`
3. **Type Aliases**: Import aliases (@components, @screens, @utils, etc.)
4. **Enhanced Config**: Better app.json with permissions and plugins
5. **React Native Reanimated**: Smooth animations support
6. **AsyncStorage**: Local data persistence
7. **Improved .gitignore**: Comprehensive ignore patterns

### 📂 New Folder Structure
```
src/
├── constants/      # Colors, Layout, Spacing constants
│   ├── Colors.ts
│   ├── Layout.ts
│   └── index.ts
└── utils/         # Helper functions
    ├── validation.ts
    ├── storage.ts
    └── index.ts
```

## 🎨 Using New Constants in Code

### Colors
```typescript
import { Colors } from '../constants';

backgroundColor: Colors.background.primary,
color: Colors.text.primary,
```

### Spacing & Border Radius
```typescript
import { Spacing, BorderRadius } from '../constants';

padding: Spacing.xl,
borderRadius: BorderRadius.md,
```

### Font Sizes
```typescript
import { FontSizes } from '../constants';

fontSize: FontSizes.lg,
```

## 🛠 Development Commands

```bash
# Start with dev client
npm start

# Clear cache and start
npm run clean

# Run Prettier/ESLint (when configured)
npm run lint

# TypeScript type checking
npx tsc --noEmit

# Update Expo packages
npx expo install --fix
```

## 🔧 Troubleshooting

### "Cannot find module" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Metro bundler cache issues
```bash
npm run clean
# or
npx expo start -c
```

### iOS Pod install issues
```bash
cd ios
pod install
cd ..
```

### Android build issues
```bash
cd android
./gradlew clean
cd ..
```

## 📖 Documentation

- **README.md**: Overview and feature list
- **SETUP_GUIDE.md**: Comprehensive setup instructions
- **QUICKSTART.md**: This file - quick reference

## 🎯 Next Development Steps

1. **API Integration**: Connect to backend services
2. **State Management**: Add Context API or Redux
3. **Authentication**: Implement real auth flows
4. **Database**: Add local database (SQLite/Realm)
5. **Testing**: Add Jest and React Native Testing Library
6. **CI/CD**: Setup automated builds with EAS

## 🌟 App Features

- ✅ Role-based boarding (Inspector/Management)
- ✅ Authentication screens with social login UI
- ✅ Dashboard with property search
- ✅ Property listings with filters
- ✅ Responsive design for all screen sizes
- ✅ TypeScript for type safety
- ✅ Modern UI with smooth animations

## 📱 Running on Physical Device

### Using Expo Go (Development)
1. Install Expo Go from App Store/Play Store
2. Run `npm start`
3. Scan QR code with Expo Go app

### Using Development Build (Recommended)
1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Build: `eas build --profile development --platform android`
4. Install the APK/IPA on your device
5. Run: `npm start`

## 💡 Pro Tips

1. **Hot Reload**: Save files to see instant changes
2. **Debug Menu**: Shake device or Cmd+D (iOS) / Cmd+M (Android)
3. **React DevTools**: Enable in Debug Menu
4. **Performance**: Use React Native Debugger for profiling
5. **Networking**: Use React Native Debugger to inspect API calls

## 🆘 Need Help?

- Check SETUP_GUIDE.md for detailed instructions
- Expo Docs: https://docs.expo.dev/
- React Native Docs: https://reactnative.dev/

---

**Ready to develop! 🎉**

Last updated: November 2024
