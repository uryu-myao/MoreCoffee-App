import {
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
} from '@expo-google-fonts/archivo';
import { InstrumentSerif_400Regular } from '@expo-google-fonts/instrument-serif';
import { Platform } from 'react-native';

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
 * Each face's natural line box (ascent + descent + lineGap), in em, read from
 * the font files. hhea, typo and win agree for both families, so every engine
 * sees the same metrics. design-system.md §3.2.
 */
const NATURAL_LINE_EM = {
  Archivo_500Medium: 1.088,
  Archivo_600SemiBold: 1.088,
  Archivo_700Bold: 1.088,
  InstrumentSerif_400Regular: 1.3,
};

/**
 * Turn a textStyle token into an RN style: fontFamily becomes the face for that
 * weight, and fontWeight is dropped so the platform does not synthesize bold on
 * top of an already-bold face.
 *
 * iOS adjustment (§3.2): a lineHeight shorter than the face's natural line box
 * is laid out differently from CSS. iOS takes the whole deficit from above the
 * baseline, keeps the full descent below, and clips the text to its frame, so
 * ascenders are cut (the "f" in display.lg). On iOS such styles render on the
 * natural line box instead. Today that is the four Instrument Serif styles; no
 * Archivo style is affected.
 */
export function resolveTextStyle(token) {
  const { fontFamily, fontWeight, ...rest } = token;
  const face = FACES[fontFamily]?.[fontWeight];
  if (__DEV__ && !face) {
    console.warn(`[fonts] No face loaded for ${fontFamily} ${fontWeight}`);
  }
  if (Platform.OS === 'ios' && rest.lineHeight != null && rest.lineHeight < NATURAL_LINE_EM[face] * rest.fontSize) {
    delete rest.lineHeight;
  }
  return { ...rest, fontFamily: face ?? fontFamily };
}
