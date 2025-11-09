# Gradle Wrapper Missing - Easy Fix!

## The Problem
The build failed with: `ENOENT: no such file or directory, open '/home/expo/workingdir/build/android/gradlew'`

This means the Gradle wrapper files are missing.

## ✅ Solution - Use Expo Prebuild

The easiest way to generate all Android files properly is to use Expo's prebuild command:

```bash
npx expo prebuild --platform android
```

This will:
- Generate all Android files with correct structure
- Create gradlew and gradle-wrapper.jar
- Set up the Android project correctly for Expo SDK 54
- Use the Kotlin 2.0.21 configuration I already created

## Alternative: Manual Setup (If prebuild doesn't work)

If you prefer manual setup or prebuild fails:

### On Windows (PowerShell):

```powershell
# Navigate to android directory
cd android

# Download gradle-wrapper.jar
$url = "https://raw.githubusercontent.com/gradle/gradle/v8.8.0/gradle/wrapper/gradle-wrapper.jar"
$output = "gradle\wrapper\gradle-wrapper.jar"
New-Item -ItemType Directory -Force -Path "gradle\wrapper"
Invoke-WebRequest -Uri $url -OutFile $output

# Go back to root
cd ..
```

### On Mac/Linux:

```bash
# Run the setup script
chmod +x setup-gradle.sh
./setup-gradle.sh
```

## Then Build Again

After running prebuild or manual setup:

```bash
npx eas build --profile development --platform android
```

## Why This Happened

When I created the Android configuration files, I created:
- ✅ gradle.properties (with Kotlin 2.0.21)
- ✅ build.gradle files
- ✅ Kotlin source files
- ✅ XML resources
- ✅ gradlew and gradlew.bat scripts
- ❌ gradle-wrapper.jar (can't create binary files)

The `gradle-wrapper.jar` is a binary file that needs to be downloaded.

## Recommended Approach

**Just run `npx expo prebuild --platform android`** - it will preserve all the Kotlin 2.0.21 configuration I created and generate the missing files! ✅
