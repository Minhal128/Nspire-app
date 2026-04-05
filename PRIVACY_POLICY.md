# Privacy Policy

**Effective Date:** April 14, 2026

**Inspire** ("we," "our," or "us") operates the Inspire mobile application. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.

---

## 1. Information We Collect

### Personal Information
- **Account Information**: Email address, name, and profile data from Clerk authentication
- **Contact Information**: Email addresses for account communications

### Device Information
- Device type and operating system
- Unique device identifiers
- App version information

### Location Data
- Precise location (fine) and approximate location (coarse) permissions are requested but not actively collected or used in the current version of the app

### Media & Photos
- **Camera Access**: Photos you capture using the in-app camera for property inspections and deficiency documentation
- **Photo Library**: Photos you select from your device for uploading to inspection reports

### Inspection Data
- Property inspection records
- Deficiency reports with photos
- Unit inspection data
- Inspection timestamps and progress

### Authentication Data
- Biometric credentials (fingerprint/face) for device authentication via expo-local-authentication
- Secure token storage via expo-secure-store

---

## 2. How We Use Your Information

We use your information to:

- **Provide Inspection Services**: Complete property inspections, document deficiencies, and generate inspection reports
- **Account Management**: Authenticate users via Clerk, manage user profiles, and enable secure login
- **Photo Management**: Capture, store, and upload inspection photos to Cloudinary for cloud storage
- **Offline Functionality**: Store inspection sessions locally for use without internet connectivity
- **App Improvements**: Understand app usage to improve user experience
- **Security**: Protect against unauthorized access using biometric authentication

---

## 3. Third-Party Services & Data Sharing

### Service Providers

| Service | Purpose | Data Shared |
|---------|---------|-------------|
| **Clerk** | User authentication | Email, name, authentication tokens |
| **Cloudinary** | Image hosting & delivery | Inspection photos, property images |
| **Expo** | App framework & updates | App performance data, crash reports |

### API Communications
Your inspection data, property information, and photos are transmitted to our backend servers for:
- Inspection submission and storage
- Report generation
- Team collaboration features

### No Sale of Personal Information
We do not sell, trade, or otherwise transfer your personal information to outside parties.

---

## 4. Data Storage & Security

### Local Storage
- Inspection data and user sessions stored locally on your device via AsyncStorage
- Authentication tokens stored securely via expo-secure-store
- AI API keys stored locally in device storage

### Security Measures
- Biometric authentication for app access
- Secure token storage
- HTTPS encrypted data transmission
- Server-side data protection

---

## 5. Permissions We Request

| Permission | Purpose | Required |
|-------------|---------|----------|
| **Camera** | Capture inspection photos | Yes |
| **Photo Library** | Select existing photos | Yes |
| **Location** | Tag inspections with location | No (not actively used) |
| **Biometric** | Fingerprint/Face ID login | Optional |
| **Microphone** | Audio recording | Not currently used |
| **Storage** | Save/read inspection photos | Yes |

---

## 6. Your Rights

### Android Users
- You can revoke permissions at any time via Settings > Apps > Inspire > Permissions
- Uninstall the app to delete all local data

### iOS Users
- You can revoke permissions at any time via Settings > Privacy > Inspire
- Uninstall the app to delete all local data

### Data Access Requests
Contact us to request access to, correction of, or deletion of your personal data.

---

## 7. Children's Privacy

Our app is not intended for children under 13. We do not knowingly collect information from children under 13. If you believe a child has provided us with personal information, contact us to remove it.

---

## 8. Changes to This Policy

We may update this Privacy Policy periodically. We will notify you of any material changes by posting the new policy in the app and updating the "Effective Date." Your continued use of the app after changes constitutes acceptance of the new policy.

---

## 9. Contact Us

**Inspire**
Email: support@inspire.app
Website: https://inspire.app

---

## 10. Google Play Data Safety (App Content)

### Data Types & Collection

| Data Type | Collected | Shared | Purpose |
|----------|------------|--------|----------|
| Location | No* | - | *Declared but not actively used |
| Photos | Yes | Yes | Inspection documentation |
| App Activity | Yes | No | Analytics & improvements |
| Device ID | Yes | No | Authentication |

### User Control
Users can manage photo and camera permissions through device settings. Uninstalling the app removes all locally stored data.

### Disclosure
This app uses third-party analytics and crash reporting. Data is transmitted securely over HTTPS.