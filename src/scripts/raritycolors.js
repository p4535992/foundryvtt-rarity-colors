import { debug, error, isEmptyObject, warn } from "./lib/lib.js";
import CONSTANTS from "./constants.js";
import API from "./API.js";

export let ORIGINAL_CONFIG = {};

// let mapConfigurations = {};

export const initHooks = async () => {
  ORIGINAL_CONFIG = deepClone(game.dnd5e.config);

  let rarityFlag = game.settings.get(CONSTANTS.MODULE_ID, "rarityFlag");
  if (!rarityFlag) {
    return;
  }
};

export const setupHooks = async () => {
  // setApi(API);
  const data = game.modules.get(CONSTANTS.MODULE_ID);
  data.api = API;
};

export const readyHooks = () => {
  // Do nothing
  if (isEmptyObject(API.mapConfigurations)) {
    API.mapConfigurations = API.getColorMap();
  }
};

Hooks.on("renderActorSheet", (actorSheet, html) => {
  let rarityFlag = game.settings.get(CONSTANTS.MODULE_ID, "rarityFlag");
  if (!rarityFlag) {
    return;
  }
  if (isEmptyObject(API.mapConfigurations)) {
    API.mapConfigurations = API.getColorMap();
  }

  let items = html.find($(".items-list .item"));
  for (let itemElement of items) {
    let id = itemElement.outerHTML.match(/data-item-id="(.*?)"/);
    if (!id) {
      continue;
    }
    let actor = actorSheet.object;
    let item = actor.items.get(id[1]);
    if (!item) {
      continue;
    }
    let itemNameElement = null;
    if (game.settings.get(CONSTANTS.MODULE_ID, "enableBackgroundColorInsteadText")) {
      itemNameElement = $(itemElement);
    } else {
      itemNameElement = $(itemElement).find(".item-name h4");
    }

    const color = API.getColorFromItem(item);
    if (itemNameElement.length > 0 && color) {
      if (color && !colorIsDefault(color)) {
        if (game.settings.get(CONSTANTS.MODULE_ID, "enableBackgroundColorInsteadText")) {
          itemNameElement.css("background-color", hexToRGBAString(color));
          if (game.modules.get("colorsettings")?.api) {
            const textColor = game.modules.get("colorsettings").api.getTextColor(color);
            itemNameElement.css("color", textColor);
          }
        } else {
          itemNameElement.css("color", color);
        }
      }
    }
  }
});

Hooks.on("renderSidebarTab", (bar, html) => {
  if (bar.id !== "items") {
    return;
  }
  let rarityFlag = game.settings.get(CONSTANTS.MODULE_ID, "rarityFlag");
  if (!rarityFlag) {
    return;
  }
  if (isEmptyObject(API.mapConfigurations)) {
    API.mapConfigurations = API.getColorMap();
  }

  let items = html.find(".directory-item.document.item");
  for (let itemElement of items) {
    let id = itemElement.outerHTML.match(/data-document-id="(.*?)"/);
    if (!id) {
      continue;
    }
    let item = game.items.get(id[1]);
    if (!item) {
      continue;
    }

    let itemNameElement = null;
    if (game.settings.get(CONSTANTS.MODULE_ID, "enableBackgroundColorInsteadText")) {
      itemNameElement = $(itemElement).find(".document-name");
      const thumbnail = $(itemElement).find(".thumbnail");
      thumbnail.css("z-index", 1); // stupid display flex
    } else {
      itemNameElement = $(itemElement).find(".document-name");
    }

    const color = API.getColorFromItem(item);
    if (itemNameElement.length > 0 && color) {
      if (color && !colorIsDefault(color)) {
        if (game.settings.get(CONSTANTS.MODULE_ID, "enableBackgroundColorInsteadText")) {
          itemNameElement.css("background-color", hexToRGBAString(color));
          if (game.modules.get("colorsettings")?.api) {
            const textColor = game.modules.get("colorsettings").api.getTextColor(color);
            itemNameElement.css("color", textColor);
          }
        } else {
          itemNameElement.css("color", color);
        }
      }
    }
  }
});

Hooks.on("updateItem", (item, diff, options, userID) => {
  let rarityFlag = game.settings.get(CONSTANTS.MODULE_ID, "rarityFlag");
  if (!rarityFlag) {
    return;
  }
  if (item.actor) {
    return;
  }
  ui.sidebar.render();
});

Hooks.on("renderItemSheet", (app, html, appData) => {
  let rarityFlag = game.settings.get(CONSTANTS.MODULE_ID, "rarityFlag");
  if (!rarityFlag) {
    return;
  }
  let item = appData;
  if (!item) {
    return;
  }
  if (isEmptyObject(API.mapConfigurations)) {
    API.mapConfigurations = API.getColorMap();
  }
  // Color item name
  const itemNameElement = html.find(`input[name="name"]`);
  // const itemRarityElement = html.find(`select[name="system.rarity"]`);

  const color = API.getColorFromItem(item);
  if (color && !colorIsDefault(color)) {
    if (game.settings.get(CONSTANTS.MODULE_ID, "enableBackgroundColorInsteadText")) {
      itemNameElement.css("background-color", hexToRGBAString(color));
      if (game.modules.get("colorsettings")?.api) {
        const textColor = game.modules.get("colorsettings").api.getTextColor(color);
        itemNameElement.css("color", textColor);
      }
    } else {
      itemNameElement.css("color", color);
    }
  }

  // Change rarity select element
  const raritySelectElement = html.find(`select[name="system.rarity"]`);
  if (!raritySelectElement.length) {
    return;
  }
  // const customRarities = game.settings.get(CONSTANTS.MODULE_ID, "rarityNames");
  $(raritySelectElement)
    .find(`option`)
    .each(function () {
      let rarityOrType = $(this).prop("value")?.replaceAll(/\s/g, "").toLowerCase().trim() ?? undefined;
      if (!rarityOrType) {
        return;
      }
      // if (rarityOrType === "common") {
      //   return;
      // }
      const color = API.mapConfigurations[rarityOrType].color;

      $(this).css("color", color);
      // Color selected option
      if ($(this).prop("selected")) {
        $(this).css("background-color", color);
        if (game.modules.get("colorsettings")?.api) {
          const textColor = game.modules.get("colorsettings").api.getTextColor(color);
          $(this).css("color", textColor);
        } else {
          $(this).css("color", "white");
        }
      }
    });
});

// =================================================
// UTILITY
// ===================================================

export function prepareMapConfigurations() {
  let configurations = game.settings.get(CONSTANTS.MODULE_ID, "configurations");
  let mapAll = {};
  if (
    isEmptyObject(configurations) ||
    isEmptyObject(configurations.itemRarity) ||
    isEmptyObject(configurations.itemRarity.defaults)
  ) {
    warn(`No configurations is been setted yet`);
    mapAll["common"] = { color: "#000000" };
    mapAll["uncommon"] = { color: "#008000" };
    mapAll["rare"] = { color: "#0000ff" };
    mapAll["veryrare"] = { color: "#800080" };
    mapAll["legendary"] = { color: "#ffa500" };
    mapAll["artifact"] = { color: "#d2691e" };
    mapAll["spell"] = { color: "#4a8396" };
    mapAll["feat"] = { color: "#48d1cc" };
    return mapAll;
  }

  prepareMapItemRarity(mapAll, configurations.itemRarity);
  prepareMapSpellSchools(mapAll, configurations.spellSchools);
  prepareMapClassFeatureTypes(mapAll, configurations.classFeatureTypes);
  // just for retro compatibility
  mapAll["spell"] = {
    color: "#4a8396",
    name: "Spell",
  };
  mapAll["feat"] = {
    color: "#48d1cc",
    name: "Feature",
  };
  return mapAll;
}

function prepareMapItemRarity(mapAll, customItemRarity) {
  const custom = customItemRarity.custom ?? {};
  const defaultItemRarity = customItemRarity.defaults;
  for (const [key, value] of Object.entries(defaultItemRarity)) {
    if (key !== "undefined") {
      mapAll[key.toLowerCase().trim()] = value;
    }
  }
  for (const [key, value] of Object.entries(custom)) {
    if (key !== "undefined") {
      mapAll[key.toLowerCase().trim()] = value;
    }
  }
}

function prepareMapSpellSchools(mapAll, customSpellSchools) {
  const custom = customSpellSchools.custom ?? {};
  const defaultSpellSchools = customSpellSchools.defaults;
  for (const [key, value] of Object.entries(defaultSpellSchools)) {
    if (key !== "undefined") {
      mapAll[key.toLowerCase().trim()] = value;
    }
  }
  for (const [key, value] of Object.entries(custom)) {
    if (key !== "undefined") {
      mapAll[key.toLowerCase().trim()] = value;
    }
  }
}

function prepareMapClassFeatureTypes(mapAll, customClassFeatureTypes) {
  const custom = customClassFeatureTypes.custom ?? {};
  const defaultClassFeatureTypes = customClassFeatureTypes.defaults;
  for (const [key, value] of Object.entries(defaultClassFeatureTypes)) {
    if (key !== "undefined") {
      mapAll[key.toLowerCase().trim()] = value;
    }
  }
  for (const [key, value] of Object.entries(custom)) {
    if (key !== "undefined") {
      mapAll[key.toLowerCase().trim()] = value;
    }
  }
}

export function prepareConfigurations() {
  let configurations = game.settings.get(CONSTANTS.MODULE_ID, "configurations");
  if (
    isEmptyObject(configurations) ||
    isEmptyObject(configurations.itemRarity) ||
    isEmptyObject(configurations.itemRarity.defaults)
  ) {
    configurations = {
      spellSchools: {
        custom: {},
        defaults: {},
      },
      itemRarity: {
        custom: {},
        defaults: {},
      },
      classFeatureTypes: {
        custom: {},
        defaults: {},
      },
    };
    //await game.settings.set(CONSTANTS.MODULE_ID, "configurations", configurations);
  }

  configurations.itemRarity ??= {};
  configurations.spellSchools ??= {};
  configurations.classFeatureTypes ??= {};

  prepareItemRarity(configurations.itemRarity);
  prepareSpellSchools(configurations.spellSchools);
  prepareClassFeatureTypes(configurations.classFeatureTypes);
  return configurations;
}

function prepareItemRarity(customItemRarity) {
  const itemRarity = deepClone(game.dnd5e.config.itemRarity);
  const custom = customItemRarity.custom ?? {};
  if (isEmptyObject(customItemRarity.defaults)) {
    customItemRarity.defaults = itemRarity;
  }
  const defaultItemRarity = customItemRarity.defaults;
  for (const [key, value] of Object.entries(defaultItemRarity)) {
    if (key === "undefined") {
      delete itemRarity[key];
    } else if (typeof value === "string" || value instanceof String) {
      itemRarity[key] = {
        color: "#000000",
        name: value,
      };
    }
  }
  for (const [key, value] of Object.entries(custom)) {
    if (key === "undefined") {
      continue;
    } else {
      itemRarity[value.key] = {
        color: value.color ?? "#000000",
        name: value.name ? value.name : value.label,
      };
    }
  }
}

function prepareSpellSchools(customSpellSchools) {
  const spellSchools = deepClone(game.dnd5e.config.spellSchools);
  const custom = customSpellSchools.custom ?? {};
  if (isEmptyObject(customSpellSchools.defaults)) {
    customSpellSchools.defaults = spellSchools;
  }
  const defaultSpellSchools = customSpellSchools.defaults;
  for (const [key, value] of Object.entries(defaultSpellSchools)) {
    if (key === "undefined") {
      delete spellSchools[key];
    } else if (typeof value === "string" || value instanceof String) {
      spellSchools[key] = {
        color: "#4a8396",
        name: value,
      };
    }
  }
  for (const [key, value] of Object.entries(custom)) {
    if (key === "undefined") {
      continue;
    } else {
      spellSchools[value.key] = {
        color: value.color ?? "#4a8396",
        name: value.name ? value.name : value.label,
      };
    }
  }
}

function prepareClassFeatureTypes(customClassFeatureTypes) {
  // const classFeatureTypes = deepClone(game.dnd5e.config.featureTypes.class.subtypes);
  const classFeatureTypes = deepClone(game.dnd5e.config.featureTypes);
  const custom = customClassFeatureTypes.custom ?? {};
  if (isEmptyObject(customClassFeatureTypes.defaults)) {
    customClassFeatureTypes.defaults = classFeatureTypes;
  }
  const defaultClassFeatureTypes = customClassFeatureTypes.defaults;
  for (const [key, value] of Object.entries(defaultClassFeatureTypes)) {
    if (key === "undefined") {
      delete classFeatureTypes[key];
    } else if (typeof value === "string" || value instanceof String) {
      classFeatureTypes[key] = {
        color: "#48d1cc",
        name: value,
      };
    }
  }
  for (const [key, value] of Object.entries(custom)) {
    if (key === "undefined") {
      continue;
    } else {
      classFeatureTypes[value.key] = {
        color: value.color ?? "#48d1cc",
        name: value.name ? value.name : value.label,
      };
    }
  }
}

/**
 * @href https://stackoverflow.com/questions/19799777/how-to-add-transparency-information-to-a-hex-color-code
 * @href https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
 */
export function hexToRGBAString(colorHex, alpha = 0.25) {
  let rgba = Color.from(colorHex);
  // return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + alpha + ")";
  if (colorHex.length > 7) {
    rgba = hexToRGBA(colorHex);
  } else {
    const colorHex2 = `${colorHex}${Math.floor(alpha * 255)
      .toString(16)
      .padStart(2, "0")}`;
    rgba = hexToRGBA(colorHex2);
    // const c = Color.from(colorHex);
    // rgba = c.toRGBA();
  }
  return "rgba(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ", " + rgba.a ?? alpha + ")";
}

/**
 * turn hex rgba into rgba string
 * @param {String} hex 8 long hex value in string form, eg: "#123456ff"
 * @returns Array of rgba[r, g, b, a]
 */
export function hexToRGBA(hex) {
  const hexArr = hex.slice(1).match(new RegExp(".{2}", "g"));
  const [r, g, b, a] = hexArr.map((hexStr) => {
    // Hex to rgba
    return parseInt(hexStr.repeat(2 / hexStr.length), 16);
  });
  const rgba = [r, g, b, Math.round((a / 256 + Number.EPSILON) * 100) / 100];
  return {
    r: rgba[0] ?? 255,
    g: rgba[1] ?? 255,
    b: rgba[2] ?? 255,
    a: rgba[3] ?? 255,
  };
}

export function colorIsDefault(color) {
  if (!color) {
    return true;
  }
  if (color !== "#000000" && color !== "#000000ff") {
    return false;
  }
  return true;
}