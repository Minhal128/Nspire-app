# Inspire - Property Management Mobile App

A professional React Native mobile application built with Expo SDK 54 for property inspection and management.

## ✨ Features

- 🎯 **Onboarding Flow**: Choose between Inspector and Management roles
- 🔐 **Authentication**: Sign In and Sign Up screens with social login options
- 📊 **Dashboard**: Property listings with search and filter capabilities
- 📱 **Cross-Platform**: Works on iOS, Android, and Web
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- 💾 **Data Persistence**: AsyncStorage for local data storage
- 🎭 **Type Safety**: Full TypeScript support with strict mode
- 🎬 **Smooth Animations**: React Native Reanimated integration

## 🛠 Tech Stack

- **Framework**: React Native 0.81.4
- **Platform**: Expo SDK 54.0.13
- **Language**: TypeScript 5.9.2
- **UI Framework**: React 19.1.0
- **Navigation**: React Navigation 6.1.18 (Stack Navigator)
- **Animations**: React Native Reanimated 4.1.1
- **Icons**: Expo Vector Icons 15.0.2
- **Form Controls**: React Native Picker 2.9.0
- **Storage**: AsyncStorage 2.2.0

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   # or for dev client
   npm run start
   ```

3. **Run on specific platform**:
   ```bash
   # For Android
   npm run android

   # For iOS
   npm run ios

   # For Web
   npm run web
   ```

4. **Clean start (clear cache)**:
   ```bash
   npm run clean
   ```

> **Note**: For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## Project Structure

```
app/
├── App.tsx                          # Main app entry point
├── src/
│   ├── screens/                     # Screen components
│   │   ├── BoardingScreen.tsx       # Onboarding screen
│   │   ├── SignInScreen.tsx         # Login screen
│   │   ├── SignUpScreen.tsx         # Registration screen
│   │   └── DashboardScreen.tsx      # Main dashboard
│   ├── types/                       # TypeScript definitions
│   │   └── navigation.ts            # Navigation types
│   ├── constants/                   # App constants
│   │   ├── Colors.ts                # Color palette
│   │   ├── Layout.ts                # Layout & spacing
│   │   └── index.ts                 # Exports
│   └── utils/                       # Utility functions
│       ├── validation.ts            # Form validation
│       ├── storage.ts               # AsyncStorage helpers
│       └── index.ts                 # Exports
├── logo.png                         # App logo
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── app.json                         # Expo config
├── babel.config.js                  # Babel config
├── metro.config.js                  # Metro bundler config
├── eas.json                         # EAS Build config
├── README.md                        # This file
└── SETUP_GUIDE.md                   # Detailed setup guide
```

## Screens Overview

### 1. Boarding Screen
- Choose user role (Inspector or Management)
- Clean, modern card-based UI
- Direct navigation to sign-in

### 2. Sign In Screen
- Email and password authentication
- Password visibility toggle
- Social login options (Facebook, Google)
- Link to registration

### 3. Sign Up Screen
- Complete registration form
- User type selection
- Password confirmation
- Form validation

### 4. Dashboard Screen
- User greeting with avatar
- Property search functionality
- Filter by name, city, or state
- Scrollable property listings
- Action buttons for adding properties
- Edit/Update property options

## Color Scheme

- **Primary**: `#0E7490` (Cyan 700)
- **Secondary**: `#FF4D67` (Pink/Red)
- **Success**: `#84CC16` (Lime)
- **Background**: `#7DD3FC` (Sky Blue)
- **Card Background**: `#F0F9E8` (Light Green)
- **Input Background**: `#D1F2EB` (Light Cyan)

## Development Notes

- All screens use TypeScript for type safety
- Safe area context for notch/status bar handling
- ScrollView implementation for dashboard
- Responsive design that adapts to different screen sizes
- Clean, modular code structure

## Next Steps

- [ ] Implement actual API integration
- [ ] Add form validation
- [ ] Implement social authentication
- [ ] Add state management (Redux/Context)
- [ ] Create property detail screens
- [ ] Add user profile management
- [ ] Implement real-time notifications

## License

Private - Inspire Property Management
