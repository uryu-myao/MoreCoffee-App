import {
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
} from '@expo-google-fonts/archivo';
import { InstrumentSerif_400Regular } from '@expo-google-fonts/instrument-serif';

/**
 * Font faces for useFonts(). Keys are the registered family names.
 *
 * tokens.ts describes type the way the design does: a family ('Archivo') plus a
 * weight ('700'). React Native cannot pick a weight out of a custom family —
 * each weight is its own registered face — so resolveTextStyle() maps the pair
 * to a face name at render time. The token values themselves are unchanged.
 */
export const fontAssets = {
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
  InstrumentSerif_400Regular,
};

const FACES = {
  Archivo: {
    500: 'Archivo_500Medium',
    600: 'Archivo_600SemiBold',
    700: 'Archivo_700Bold',
  },
  'Instrument Serif': {
    400: 'InstrumentSerif_400Regular',
  },
};

/**
 * Turn a textStyle token into an RN style: fontFamily becomes the face for that
 * weight, and fontWeight is dropped so the platform does not synthesize bold on
 * top of an already-bold face.
 */
export function resolveTextStyle(token) {
  const { fontFamily, fontWeight, ...rest } = token;
  const face = FACES[fontFamily]?.[fontWeight];
  if (__DEV__ && !face) {
    console.warn(`[fonts] No face loaded for ${fontFamily} ${fontWeight}`);
  }
  return { ...rest, fontFamily: face ?? fontFamily };
}
