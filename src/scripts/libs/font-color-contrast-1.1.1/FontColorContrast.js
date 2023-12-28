"use strict";
var __classPrivateFieldSet =
  (this && this.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? (f.value = value) : state.set(receiver, value), value;
  };
var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
var _FontColorContrast_hexColorOrRedOrArray,
  _FontColorContrast_greenOrThreshold,
  _FontColorContrast_blue,
  _FontColorContrast_threshold;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontColorContrast = exports.NumberType = void 0;
const cssNamedColors_1 = require("./cssNamedColors");
var NumberType;
(function (NumberType) {
  NumberType[(NumberType["COLOR"] = 255)] = "COLOR";
  NumberType[(NumberType["RGB"] = 16777215)] = "RGB";
  NumberType[(NumberType["THRESHOLD"] = 1)] = "THRESHOLD";
})((NumberType = exports.NumberType || (exports.NumberType = {})));
class FontColorContrast {
  /**
   * Sets the #params in the instance
   * @param hexColorOrRedOrArray One of the options: hex color number, hex color string, named CSS color, array with red, green and blue or string or the red portion of the color
   * @param greenOrThreshold The green portion of the color or the contrast threshold to control the resulting font color
   * @param blue The blue portion of the color
   * @param threshold Contrast threshold to control the resulting font color
   */
  constructor(hexColorOrRedOrArray, greenOrThreshold, blue, threshold) {
    this.red = 0;
    this.green = 0;
    this.blue = 0;
    _FontColorContrast_hexColorOrRedOrArray.set(this, void 0);
    _FontColorContrast_greenOrThreshold.set(this, void 0);
    _FontColorContrast_blue.set(this, void 0);
    _FontColorContrast_threshold.set(this, void 0);
    /**
     * Contrast threshold to control the resulting font color, float values from 0 to 1. Default is 0.5
     */
    this.threshold = 0.5;
    __classPrivateFieldSet(this, _FontColorContrast_hexColorOrRedOrArray, hexColorOrRedOrArray, "f");
    __classPrivateFieldSet(this, _FontColorContrast_greenOrThreshold, greenOrThreshold, "f");
    __classPrivateFieldSet(this, _FontColorContrast_blue, blue, "f");
    __classPrivateFieldSet(this, _FontColorContrast_threshold, threshold, "f");
  }
  /**
   * Analyses the color (normally used in the background) and retrieves what color (black or white) has a better contrast.
   * @returns The best contrast between black and white
   */
  getColor() {
    if (this.isRgb()) {
      this.setColorsFromRgbNumbers();
    } else if (this.isHexString()) {
      this.setColorsFromHexString();
    } else if (this.isNumber()) {
      this.setColorsFromNumber();
    } else if (this.isArray()) {
      this.setColorsFromArray();
    } else {
      return "#ffffff";
    }
    return this.contrastFromHSP();
  }
  /**
   * Checks if the color is set as RGB on each param
   * @returns True if color is set as RGB on each param
   */
  isRgb() {
    return (
      FontColorContrast.isValidNumber(
        __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f"),
        NumberType.COLOR
      ) &&
      FontColorContrast.isValidNumber(
        __classPrivateFieldGet(this, _FontColorContrast_greenOrThreshold, "f"),
        NumberType.COLOR
      ) &&
      FontColorContrast.isValidNumber(__classPrivateFieldGet(this, _FontColorContrast_blue, "f"), NumberType.COLOR) &&
      FontColorContrast.isValidNumber(
        __classPrivateFieldGet(this, _FontColorContrast_threshold, "f"),
        NumberType.THRESHOLD
      )
    );
  }
  /**
   * Checks if color is set on the first param as a hex string and removes the hash of it
   * @returns True if color is a hex string
   */
  isHexString() {
    const [cleanString, hexNum] = this.getCleanStringAndHexNum();
    if (
      FontColorContrast.isValidNumber(hexNum, NumberType.RGB) &&
      FontColorContrast.isValidNumber(
        __classPrivateFieldGet(this, _FontColorContrast_greenOrThreshold, "f"),
        NumberType.THRESHOLD
      ) &&
      FontColorContrast.isNotSet(__classPrivateFieldGet(this, _FontColorContrast_blue, "f")) &&
      FontColorContrast.isNotSet(__classPrivateFieldGet(this, _FontColorContrast_threshold, "f"))
    ) {
      __classPrivateFieldSet(this, _FontColorContrast_hexColorOrRedOrArray, cleanString, "f");
      return true;
    }
    return false;
  }
  /**
   * Checks if color is set on the first param as a number
   * @returns True if color is a valid RGB nunbernumber
   */
  isNumber() {
    return (
      FontColorContrast.isValidNumber(
        __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f"),
        NumberType.RGB
      ) &&
      FontColorContrast.isValidNumber(
        __classPrivateFieldGet(this, _FontColorContrast_greenOrThreshold, "f"),
        NumberType.THRESHOLD
      ) &&
      FontColorContrast.isNotSet(__classPrivateFieldGet(this, _FontColorContrast_blue, "f")) &&
      FontColorContrast.isNotSet(__classPrivateFieldGet(this, _FontColorContrast_threshold, "f"))
    );
  }
  /**
   * Checks if color is set as an RGB array
   * @returns True if color is set as an RGB array
   */
  isArray() {
    return (
      Array.isArray(__classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f")) &&
      __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f").length === 3 &&
      FontColorContrast.isValidNumber(
        __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f")[0],
        NumberType.COLOR
      ) &&
      FontColorContrast.isValidNumber(
        __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f")[1],
        NumberType.COLOR
      ) &&
      FontColorContrast.isValidNumber(
        __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f")[2],
        NumberType.COLOR
      ) &&
      FontColorContrast.isValidNumber(
        __classPrivateFieldGet(this, _FontColorContrast_greenOrThreshold, "f"),
        NumberType.THRESHOLD
      ) &&
      FontColorContrast.isNotSet(__classPrivateFieldGet(this, _FontColorContrast_blue, "f")) &&
      FontColorContrast.isNotSet(__classPrivateFieldGet(this, _FontColorContrast_threshold, "f"))
    );
  }
  /**
   * Converts a color array or separated in RGB to the respective RGB values
   * @example All these examples produces the same value
   * arrayOrRgbToRGB(0, 0xcc, 153)
   * arrayOrRgbToRGB(0x0, 0xcc, 153)
   * arrayOrRgbToRGB(0, 204, 0x99)
   */
  setColorsFromRgbNumbers() {
    this.red = __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f");
    this.green = __classPrivateFieldGet(this, _FontColorContrast_greenOrThreshold, "f");
    this.blue = __classPrivateFieldGet(this, _FontColorContrast_blue, "f");
    this.setThreshold(__classPrivateFieldGet(this, _FontColorContrast_threshold, "f"));
  }
  /**
   * Converts a color array or separated in RGB to the respective RGB values
   * @param this.#hexColorOrRedOrArray The RGB array
   * @param threshold The threshold
   * @example All these examples produces the same value
   * arrayOrRgbToRGB([0, 0xcc, 153])
   * arrayOrRgbToRGB([0x0, 0xcc, 153])
   * arrayOrRgbToRGB([0, 204, 0x99])
   */
  setColorsFromArray() {
    this.red = __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f")[0];
    this.green = __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f")[1];
    this.blue = __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f")[2];
    this.setThreshold(__classPrivateFieldGet(this, _FontColorContrast_greenOrThreshold, "f"));
  }
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
  setColorsFromHexString() {
    switch (__classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f").length) {
      // Color has one char for each color, so they must be repeated
      case 3:
        this.red = parseInt(
          __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f")[0].repeat(2),
          16
        );
        this.green = parseInt(
          __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f")[1].repeat(2),
          16
        );
        this.blue = parseInt(
          __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f")[2].repeat(2),
          16
        );
        break;
      // All chars are filled, so no transformation is needed
      default:
        this.red = parseInt(
          __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f").substring(0, 2),
          16
        );
        this.green = parseInt(
          __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f").substring(2, 4),
          16
        );
        this.blue = parseInt(
          __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f").substring(4, 6),
          16
        );
        break;
    }
    this.setThreshold(__classPrivateFieldGet(this, _FontColorContrast_greenOrThreshold, "f"));
  }
  /**
   * Converts the RGB number and sets the respective RGB values.
   */
  setColorsFromNumber() {
    /*
     * The RGB color has 24 bits (8 bits per color).
     * This function uses binary operations for better performance, but can be tricky to understand. A 24 bits color could be represented as RRRRRRRR GGGGGGGG BBBBBBBB (the first 8 bits are red, the middle 8 bits are green and the last 8 bits are blue).
     * To get each color we perform some RIGHT SHIFT and AND operations.
     * Gets the first 8 bits of the color by shifting it 16 bits
     * RIGHT SHIFT operation (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Right_shift)
     * AND operation (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND)
     */
    // To get red, we shift the 24 bits number 16 bits to the right, leaving the number only with the leftmost 8 bits (RRRRRRRR)
    this.red = __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f") >> 16;
    // To get green, the middle 8 bits, we shift it by 8 bits (removing all blue bits - RRRRRRRR GGGGGGGG) and use an AND operation with "0b0000000011111111 = 0xff" to get only the rightmost bits (GGGGGGGG)
    this.green = (__classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f") >> 8) & 0xff;
    // To get blue we use an AND operation with "0b000000000000000011111111 = 0xff" to get only the rightmost bits (BBBBBBBB)
    this.blue = __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f") & 0xff;
    this.setThreshold(__classPrivateFieldGet(this, _FontColorContrast_greenOrThreshold, "f"));
  }
  /**
   * Sets the threshold to the passed value (if valid - less than or equal 1) or the dafault (0.5)
   * @param threshold The passed threshold or undefined if not passed
   */
  setThreshold(threshold) {
    this.threshold = threshold || this.threshold;
  }
  /**
   * Verifies if a number is a valid color number (numberType = NumberType.COLOR = 0xff) or a valid RGB (numberType = NumberType.RGB = 0xffffff) or a valid threshold (numberType = NumberType.THRESHOLD = 1)
   * @param num The number to be checked
   * @param numberType The type of number to be chacked that defines maximum value of the number (default = NumberType.COLOR = 0xff)
   * @returns True if the number is valid
   */
  static isValidNumber(num, numberType) {
    if (numberType === NumberType.THRESHOLD && (num === undefined || num === null)) return true;
    return (
      typeof num === "number" &&
      ((numberType !== NumberType.THRESHOLD && Number.isInteger(num)) || numberType === NumberType.THRESHOLD) &&
      num !== undefined &&
      num !== null &&
      num >= 0 &&
      num <= numberType
    );
  }
  /**
   * Verifies if a string is a valig string to be used as a color and if true, returns the correspondent hex number
   * @returns Array with an empty string and false if the string is invalid or an array with the clean string and the converted string number]
   */
  getCleanStringAndHexNum() {
    if (typeof __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f") !== "string")
      return ["", false];
    const cleanRegEx = /(#|\s)/gi;
    const namedColor = cssNamedColors_1.cssNamedColors.find(
      (color) => color.name === __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f")
    );
    if (namedColor) {
      __classPrivateFieldSet(
        this,
        _FontColorContrast_hexColorOrRedOrArray,
        namedColor.hex.replace(cleanRegEx, ""),
        "f"
      );
    }
    const cleanString = __classPrivateFieldGet(this, _FontColorContrast_hexColorOrRedOrArray, "f").replace(
      cleanRegEx,
      ""
    );
    if (cleanString.length !== 3 && cleanString.length !== 6) return ["", false];
    const hexNum = Number("0x" + cleanString);
    return [cleanString, hexNum];
  }
  /**
   * Verifies if a value is not set
   * @param value The value that should be undefined or null
   * @returns True if the value is not set
   */
  static isNotSet(value) {
    return value === undefined || value === null;
  }
  /**
   * Calculates the best color (black or white) to contrast with the passed RGB color using the algorithm from https://alienryderflex.com/hsp.html
   * @returns Black or White depending on the best possible contrast
   */
  contrastFromHSP() {
    const pRed = 0.299;
    const pGreen = 0.587;
    const pBlue = 0.114;
    const contrast = Math.sqrt(
      pRed * Math.pow(this.red / 255, 2) + pGreen * Math.pow(this.green / 255, 2) + pBlue * Math.pow(this.blue / 255, 2)
    );
    return contrast > this.threshold ? "#000000" : "#ffffff";
  }
}
exports.FontColorContrast = FontColorContrast;
(_FontColorContrast_hexColorOrRedOrArray = new WeakMap()),
  (_FontColorContrast_greenOrThreshold = new WeakMap()),
  (_FontColorContrast_blue = new WeakMap()),
  (_FontColorContrast_threshold = new WeakMap());
//# sourceMappingURL=FontColorContrast.js.map
