# Nspire - Property Management Mobile App

A professional React Native mobile application built with Expo 54 for property inspection and management.

## Features

- 🎯 **Onboarding Flow**: Choose between Inspector and Management roles
- 🔐 **Authentication**: Sign In and Sign Up screens with social login options
- 📊 **Dashboard**: Property listings with search and filter capabilities
- 📱 **Cross-Platform**: Works on both iOS and Android
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations

## Tech Stack

- **Framework**: React Native 0.76.5
- **Platform**: Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack Navigator)
- **UI Components**: React Native Paper, Vector Icons
- **Form Controls**: React Native Picker

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
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

## Project Structure

```
app/
├── App.tsx                 # Main app entry point
├── src/
│   ├── screens/
│   │   ├── BoardingScreen.tsx      # Onboarding screen
│   │   ├── SignInScreen.tsx        # Login screen
│   │   ├── SignUpScreen.tsx        # Registration screen
│   │   └── DashboardScreen.tsx     # Main dashboard
│   └── types/
│       └── navigation.ts           # Navigation types
├── logo.png                # App logo
├── package.json
├── tsconfig.json
└── app.json
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

Private - Nspire Property Management
