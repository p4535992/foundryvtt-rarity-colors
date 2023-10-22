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
};

export default API;
