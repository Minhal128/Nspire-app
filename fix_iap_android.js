const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'node_modules/react-native-iap/android/src/play/java/com/dooboolab/rniap/RNIapModule.kt');

if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix unresolved currentActivity reference in the Play flavor module.
    if (content.includes('val activity = currentActivity')) {
        console.log('Patching RNIapModule.kt: replacing currentActivity with reactContext.currentActivity');
        content = content.replace('val activity = currentActivity', 'val activity = reactContext.currentActivity');
        fs.writeFileSync(filePath, content);
        console.log('Successfully patched RNIapModule.kt');
    } else if (content.includes('val activity = reactContext.currentActivity')) {
        console.log('RNIapModule.kt already patched');
    } else {
        console.log('RNIapModule.kt already patched or unexpected content');
    }
} else {
    console.error('RNIapModule.kt not found at: ' + filePath);
}
