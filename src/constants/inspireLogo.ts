import { Image } from 'react-native';

// Use bundled app asset so report header always reflects inspire_logo.png
const logoAsset = Image.resolveAssetSource(require('../../inspire_logo.png'));

export const INSPIRE_LOGO_BASE64 = logoAsset?.uri || '';
