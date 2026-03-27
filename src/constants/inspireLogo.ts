import { Image, Platform } from 'react-native';

// Use bundled app asset so report header always reflects inspire_logo.png
const logo = require('../../inspire_logo.png');

let logoUri = '';
if (Platform.OS === 'web') {
  logoUri = typeof logo === 'string' ? logo : logo?.uri || logo?.default || '';
} else {
  const logoAsset = Image.resolveAssetSource ? Image.resolveAssetSource(logo) : logo;
  logoUri = logoAsset?.uri || '';
}

export const INSPIRE_LOGO_BASE64 = logoUri;
