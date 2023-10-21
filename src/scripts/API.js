import CONSTANTS from "./constants";
import { debug, isEmptyObject, warn } from "./lib/lib";
import { colorIsDefault, prepareMapConfigurations } from "./raritycolors";

/**
 * Create a new API class and export it as default
 */
const API = {
  mapConfigurations: null,

  getColorFromItem(item, applyModuleSettings = true) {
    if (!item) {
      warn(`getColorFromItem | No item reference is been passed`, true);
      return;
    }

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
    if (isSpell && spellFlag) {
      rarityOrType = item?.system.school ?? "spell";
      if (!this.mapConfigurations[rarityOrType]) {
        rarityOrType = "spell";
      }
      doColor = true;
    }
    if (isFeat && featFlag) {
      rarityOrType = item?.system.type ?? "feat";
      if (!this.mapConfigurations[rarityOrType]) {
        rarityOrType = "feat";
      }
      doColor = true;
    }

    if (applyModuleSettings) {
      if (rarityOrType !== "" && rarityOrType !== undefined && doColor) {
        debug(`Try to get setting : ${rarityOrType}`);
        const color = this.mapConfigurations[rarityOrType].color;
        if (color && !colorIsDefault(color)) {
          return color;
        }
      }
      return null;
    } else {
      if (rarityOrType !== "" && rarityOrType !== undefined) {
        debug(`Try to get setting : ${rarityOrType}`);
        const color = this.mapConfigurations[rarityOrType].color;
        if (color && !colorIsDefault(color)) {
          return color;
        }
      }
      return null;
    }
  },

  getColorMap() {
    if (isEmptyObject(this.mapConfigurations)) {
      this.mapConfigurations = prepareMapConfigurations();
    }
    return this.mapConfigurations;
  },
};

export default API;
