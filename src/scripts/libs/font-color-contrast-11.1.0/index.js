import { CssColor } from "./CssNamedColorsType";
import { FontColorContrast } from "./FontColorContrast";

/**
 * Analyses the color (normally used in the background) and retrieves what color (black or white) has a better contrast.
 * @param cssColor The CSS named color string. The list of colors is defined as a TypeScript type to help the usage.
 * @param threshold Contrast threshold to control the resulting font color, float values from 0 to 1. Default is 0.5.
 * @example fontColorContrast('beige')
 * @example fontColorContrast('darkcyan', 0.3)
 * @returns {( '#ffffff'|'#000000')} hex color
 */
export function fontColorContrastFromCssColor(cssColor, threshold = 0.5) {
  return fontColorContrast(cssColor, threshold);
}

/**
 * Analyses the color (normally used in the background) and retrieves what color (black or white) has a better contrast.
 * @param hex The hex color string must be a valid hexadecimal color number to work correctly. Works with or without '#', with 3 or 6 color chars. Any other length or an invalid hex character will be ignored. A space is allowed between the hash symbol and the number.
 * @param threshold Contrast threshold to control the resulting font color, float values from 0 to 1. Default is 0.5.
 * @example fontColorContrast('00FFDD') === fontColorContrast('0FD') === fontColorContrast('#00FFDD') === fontColorContrast('#0FD') === fontColorContrast('# 00FFDD') === fontColorContrast('# 0FD')
 * @returns {( '#ffffff'|'#000000')} hex color
 */
export function fontColorContrastFromHexString(hex, threshold = 0.5) {
  return fontColorContrast(hex, threshold);
}

/**
 * Analyses the color (normally used in the background) and retrieves what color (black or white) has a better contrast.
 * @param hex The hex color number must be an integer between 0 and 0xffffff (16777215).
 * @param threshold Contrast threshold to control the resulting font color, float values from 0 to 1. Default is 0.5.
 * @example fontColorContrast(0XF3DC56) === fontColorContrast(15981654)
 * @returns {( '#ffffff'|'#000000')} hex color
 */
export function fontColorContrastFromHexNumber(hex, threshold = 0.5) {
  return fontColorContrast(hex, threshold);
}

/**
 * Analyses the color (normally used in the background) and retrieves what color (black or white) has a better contrast.
 * @param red The red portion of the color. Must be an integer between 0 and 255.
 * @param green The green portion of the color. Must be an integer between 0 and 255.
 * @param blue The blue portion of the color. Must be an integer between 0 and 255.
 * @param threshold Contrast threshold to control the resulting font color, float values from 0 to 1. Default is 0.5.
 * @example fontColorContrast(0, 243, 216) === fontColorContrast(0x0, 0xF3, 0xd8).
 * @returns {( '#ffffff'|'#000000')} hex color
 */
export function fontColorContrastFromRGB(red, green, blue, threshold = 0.5) {
  return fontColorContrast(red, green, blue, threshold);
}

/**
 * Analyses the color (normally used in the background) and retrieves what color (black or white) has a better contrast.
 * @param rgbArray Array with red, green and blue. Each value must be an integer between 0 and 255.
 * @param threshold Contrast threshold to control the resulting font color, float values from 0 to 1. Default is 0.5.
 * @example fontColorContrast(fontColorContrast([0, 243, 216]) === fontColorContrast([0x0, 0xF3, 0xd8])
 * @returns {( '#ffffff'|'#000000')} hex color
 */
export function fontColorContrastFromRGBArray(rgbArray, threshold = 0.5) {
  return fontColorContrast(rgbArray, threshold);
}

/**
 * Sets the #params in the instance
 * @param hexColorOrRedOrArray One of the options: hex color number, hex color string, named CSS color, array with red, green and blue or string or the red portion of the color
 * @param greenOrThreshold The green portion of the color or the contrast threshold to control the resulting font color
 * @param blue The blue portion of the color
 * @param threshold Contrast threshold to control the resulting font color
 * @example fontColorContrast(0XF3DC56) === fontColorContrast(15981654)
 * @returns {( '#ffffff'|'#000000')} hex color
 */
export function fontColorContrast(hexColorOrRedOrArray, greenOrThreshold = 0, blue = 0, threshold = 0.5) {
  const fcc = new FontColorContrast(hexColorOrRedOrArray, greenOrThreshold, blue, threshold);
  return fcc.getColor();
}

// export default fontColorContrast;
