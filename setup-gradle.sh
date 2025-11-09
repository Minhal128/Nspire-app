#!/bin/bash

# Download gradle-wrapper.jar
echo "Downloading Gradle Wrapper JAR..."
mkdir -p android/gradle/wrapper
curl -L https://raw.githubusercontent.com/gradle/gradle/v8.8.0/gradle/wrapper/gradle-wrapper.jar -o android/gradle/wrapper/gradle-wrapper.jar

# Make gradlew executable
chmod +x android/gradlew

echo "Gradle wrapper setup complete!"
