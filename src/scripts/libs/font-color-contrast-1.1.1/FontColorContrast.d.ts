import { CssColor } from './CssNamedColorsType';
export declare enum NumberType {
    COLOR = 255,
    RGB = 16777215,
    THRESHOLD = 1
}
export declare class FontColorContrast {
    #private;
    red: number;
    green: number;
    blue: number;
    /**
     * Contrast threshold to control the resulting font color, float values from 0 to 1. Default is 0.5
     */
    threshold: number;
    /**
     * Sets the #params in the instance
     * @param hexColorOrRedOrArray One of the options: hex color number, hex color string, named CSS color, array with red, green and blue or string or the red portion of the color
     * @param greenOrThreshold The green portion of the color or the contrast threshold to control the resulting font color
     * @param blue The blue portion of the color
     * @param threshold Contrast threshold to control the resulting font color
     */
    constructor(hexColorOrRedOrArray: string | number | number[] | CssColor, greenOrThreshold?: number, blue?: number, threshold?: number);
    /**
     * Analyses the color (normally used in the background) and retrieves what color (black or white) has a better contrast.
     * @returns The best contrast between black and white
     */
    getColor(): "#000000" | "#ffffff";
    /**
     * Checks if the color is set as RGB on each param
     * @returns True if color is set as RGB on each param
     */
    isRgb(): boolean;
    /**
     * Checks if color is set on the first param as a hex string and removes the hash of it
     * @returns True if color is a hex string
     */
    isHexString(): boolean;
    /**
     * Checks if color is set on the first param as a number
     * @returns True if color is a valid RGB nunbernumber
     */
    isNumber(): boolean;
    /**
     * Checks if color is set as an RGB array
     * @returns True if color is set as an RGB array
     */
    isArray(): boolean;
    /**
     * Converts a color array or separated in RGB to the respective RGB values
     * @example All these examples produces the same value
     * arrayOrRgbToRGB(0, 0xcc, 153)
     * arrayOrRgbToRGB(0x0, 0xcc, 153)
     * arrayOrRgbToRGB(0, 204, 0x99)
     */
    setColorsFromRgbNumbers(): void;
    /**
     * Converts a color array or separated in RGB to the respective RGB values
     * @param this.#hexColorOrRedOrArray The RGB array
     * @param threshold The threshold
     * @example All these examples produces the same value
     * arrayOrRgbToRGB([0, 0xcc, 153])
     * arrayOrRgbToRGB([0x0, 0xcc, 153])
     * arrayOrRgbToRGB([0, 204, 0x99])
     */
    setColorsFromArray(): void;
    /**
     * Converts a ColorIntensity string or number, with all possibilities (e.g. '#009', '009', '#000099', '000099', 153, 0x00099) to the respective RGB values
     * @param hexColor The color string or number
     * @param threshold The threshold
     * @example All these examples produces the same value
     * hexColorToRGB('#0C9')
     * hexColorToRGB('0C9')
     * hexColorToRGB('#00CC99')
     * hexColorToRGB('00cc99')
     * hexColorToRGB(52377)
     * hexColorToRGB(0x00Cc99)
     */
    setColorsFromHexString(): void;
    /**
     * Converts the RGB number and sets the respective RGB values.
     */
    setColorsFromNumber(): void;
    /**
     * Sets the threshold to the passed value (if valid - less than or equal 1) or the dafault (0.5)
     * @param threshold The passed threshold or undefined if not passed
     */
    setThreshold(threshold: any): void;
    /**
     * Verifies if a number is a valid color number (numberType = NumberType.COLOR = 0xff) or a valid RGB (numberType = NumberType.RGB = 0xffffff) or a valid threshold (numberType = NumberType.THRESHOLD = 1)
     * @param num The number to be checked
     * @param numberType The type of number to be chacked that defines maximum value of the number (default = NumberType.COLOR = 0xff)
     * @returns True if the number is valid
     */
    static isValidNumber(num: any, numberType: NumberType): boolean;
    /**
     * Verifies if a string is a valig string to be used as a color and if true, returns the correspondent hex number
     * @returns Array with an empty string and false if the string is invalid or an array with the clean string and the converted string number]
     */
    getCleanStringAndHexNum(): ['', false] | [string, number];
    /**
     * Verifies if a value is not set
     * @param value The value that should be undefined or null
     * @returns True if the value is not set
     */
    static isNotSet(value: any): boolean;
    /**
     * Calculates the best color (black or white) to contrast with the passed RGB color using the algorithm from https://alienryderflex.com/hsp.html
     * @returns Black or White depending on the best possible contrast
     */
    contrastFromHSP(): '#000000' | '#ffffff';
}
//# sourceMappingURL=FontColorContrast.d.ts.map