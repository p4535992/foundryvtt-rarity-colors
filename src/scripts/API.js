import CONSTANTS from "./constants";
import { debug, getItemSync, isEmptyObject, warn } from "./lib/lib";
import { colorIsDefault, prepareMapConfigurations } from "./raritycolors";

/**
 * Create a new API class and export it as default
 */
const API = {
  mapConfigurations: null,

  /**
   * Method to recover the color from a item object
   * @param {string|Item} item
   * @param {boolean} applyModuleSettings if true it will apply the 'rarity-colors' module settings
   * @returns {string|null} the hex string of the color or the null value if not founded
   */
  getColorFromItem(item, applyModuleSettings = true) {
    if (!item) {
      warn(`getColorFromItem | No item reference is been passed`, true);
      return;
    }

    item = getItemSync(item, false);

    const spellFlag = game.settings.get(CONSTANTS.MODULE_ID, "spellFlag");
    const featFlag = game.settings.get(CONSTANTS.MODULE_ID, "featFlag");
    let type = item?.type;
    const isSpell = type === "spell";
    const isFeat = type === "feat";

    // let rarity = item.getRollData()?.item.rarity || item?.system?.rarity || undefined;
    let rarity = item?.system?.rarity || undefined;
    rarity = rarity ? rarity.replaceAll(/\s/g, "").toLowerCase().trim() : undefined;
    // if (rarity && rarity === "common") {
    //   continue;
    // }

    let rarityOrType = rarity || (isSpell || isFeat ? type : undefined);
    let doColor = false;
    if (rarityOrType !== "" && rarityOrType !== undefined) {
      doColor = true;
    }
    if (isSpell) {
      rarityOrType = item?.system.school ?? "spell";
      if (!this.mapConfigurations[rarityOrType]) {
        rarityOrType = "spell";
      }
      if (spellFlag) {
        doColor = true;
      } else {
        doColor = false;
      }
    }
    if (isFeat) {
      rarityOrType = item?.system.type ?? "feat";
      if (!this.mapConfigurations[rarityOrType]) {
        rarityOrType = "feat";
      }
      if (featFlag) {
        doColor = true;
      } else {
        doColor = false;
      }
    }

    if (applyModuleSettings) {
      if (rarityOrType !== "" && rarityOrType !== undefined && doColor) {
        debug(`Try to get color with settings : ${rarityOrType}`);
        const color = this.mapConfigurations[rarityOrType].color;
        if (color && !colorIsDefault(color)) {
          return color;
        }
      }
      return null;
    } else {
      if (rarityOrType !== "" && rarityOrType !== undefined) {
        debug(`Try to get color without settings : ${rarityOrType}`);
        const color = this.mapConfigurations[rarityOrType].color;
        if (color && !colorIsDefault(color)) {
          return color;
        }
      }
      return null;
    }
  },

  /**
   * Retrieve the full color map of 'rarity-color' for you own use ?
   * @returns {Object.<string, {color: string}>}
   */
  getColorMap() {
    if (isEmptyObject(this.mapConfigurations)) {
      this.mapConfigurations = prepareMapConfigurations();
    }
    return this.mapConfigurations;
  },

  // ============================
  // COLOR SETTINGS MIRROR API
  // ============================

  /**
   * Turn hex rgba into rgba object
   * @param {String} hex 8 long hex value in string form, eg: "#123456ff"
   * @returns object of {r, g, b, a}
   */
  hexToRGBA(hex) {
    // return game.modules.get("colorsettings").api.hexToRGBA(hex);

    const hexArr = hex.slice(1).match(new RegExp(".{2}", "g"));
    const [r, g, b, a] = hexArr.map((hexStr) => {
      return parseInt(hexStr.repeat(2 / hexStr.length), 16);
    });
    const realAlpha = this._isRealNumber(a) ? a : 1;
    const rgba = [r, g, b, Math.round((realAlpha / 256 + Number.EPSILON) * 100) / 100];
    return {
      r: rgba[0] ?? 255,
      g: rgba[1] ?? 255,
      b: rgba[2] ?? 255,
      a: rgba[3] ?? 255,
    };
  },

  /**
   * Makes text white or black according to background color
   * @param {String} rgbaHex 8 long hex value in string form, eg: "#123456ff"
   * @returns {String} "black" or "white"
   */
  getTextColor(rgbaHex) {
    // return game.modules.get("colorsettings").api.getTextColor(rgbaHex);

    const rgba = this.hexToRGBA(rgbaHex);
    const brightness = Math.round((rgba.r * 299 + rgba.g * 587 + rgba.b * 114) / 1000);
    // const realAlpha = this._isRealNumber(rgba.a) ? rgba.a : 1;
    if (this._isRealNumber(rgba.a) && rgba.a > 0.5) {
      return brightness > 125 ? "black" : "white";
    } else {
      //return 'black';
      return brightness > 125 ? "black" : "white";
    }
  },

  /**
   * Convert a Array of rgba[r, g, b, a] in string format to a hex string
   * @param {String} rgba as string e.g. rgba('xxx','xxx','xxx','xxx')
   * @param {boolean} forceRemoveAlpha
   * @returns turns the hex string
   */
  RGBAToHexFromString(rgba, forceRemoveAlpha = false) {
    // return game.modules.get("colorsettings").api.RGBAToHexFromString(rgba, forceRemoveAlpha);

    return (
      "#" +
      rgba
        .replace(/^rgba?\(|\s+|\)$/g, "") // Get's rgba / rgb string values
        .split(",") // splits them at ","
        .filter((string, index) => !forceRemoveAlpha || index !== 3)
        .map((string) => parseFloat(string)) // Converts them to numbers
        .map((number, index) => (index === 3 ? Math.round(number * 255) : number)) // Converts alpha to 255 number
        .map((number) => number.toString(16)) // Converts numbers to hex
        .map((string) => (string.length === 1 ? "0" + string : string)) // Adds 0 when length of one number is 1
        .join("")
    ); // Puts the array to together to a string
  },

  /**
   * Convert a Array of rgba[r, g, b, a] in to a hex string
   * @param {*} r
   * @param {*} g
   * @param {*} b
   * @param {*} a
   * @returns the hex string
   */
  RGBAToHex(r, g, b, a) {
    // return game.modules.get("colorsettings").api.RGBAToHex(r, g, b, a);

    let r2 = r.toString(16);
    let g2 = g.toString(16);
    let b2 = b.toString(16);
    let a2 = Math.round(a * 255).toString(16);

    if (r2.length == 1) {
      r2 = "0" + r2;
    }
    if (g2.length == 1) {
      g2 = "0" + g2;
    }
    if (b2.length == 1) {
      b2 = "0" + b2;
    }
    if (a2.length == 1) {
      a2 = "0" + a2;
    }
    return "#" + r2 + g2 + b2 + a2;
  },

  /**
   * Turn hex rgba into rgba string
   * @href https://stackoverflow.com/questions/19799777/how-to-add-transparency-information-to-a-hex-color-code
   * @href https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
   * @param colorHex
   * @param alpha
   * @return rgba as string e.g. rgba('xxx','xxx','xxx','xxx')
   */
  hexToRGBAString(colorHex, alpha = 1) {
    // return game.modules.get("colorsettings").api.hexToRGBAString(colorHex, alpha);

    let rgba = Color.from(colorHex);
    // return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + alpha + ")";
    if (colorHex.length > 7) {
      rgba = this.hexToRGBA(colorHex);
    } else {
      const colorHex2 = `${colorHex}${Math.floor(alpha * 255)
        .toString(16)
        .padStart(2, "0")}`;
      rgba = this.hexToRGBA(colorHex2);
      // const c = Color.from(colorHex);
      // rgba = c.toRGBA();
    }
    const realAlpha = this._isRealNumber(rgba.a) ? rgba.a : alpha;
    return "rgba(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ", " + realAlpha + ")";
  },

  _isRealNumber(inNumber) {
    return !isNaN(inNumber) && typeof inNumber === "number" && isFinite(inNumber);
  },
};

export default API;
