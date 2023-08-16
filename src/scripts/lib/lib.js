// =============================
// Logging Utility
// =============================

import CONSTANTS from "../constants.js";

// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3
export function debug(msg, args = "") {
  if (game.settings.get(CONSTANTS.MODULE_NAME, "debug")) {
    console.log(`DEBUG | ${CONSTANTS.MODULE_NAME} | ${msg}`, args);
  }
  return msg;
}
export function log(message) {
  message = `${CONSTANTS.MODULE_NAME} | ${message}`;
  console.log(message.replace("<br>", "\n"));
  return message;
}
export function notify(message) {
  message = `${CONSTANTS.MODULE_NAME} | ${message}`;
  ui.notifications?.notify(message);
  console.log(message.replace("<br>", "\n"));
  return message;
}
export function info(info, notify = false) {
  info = `${CONSTANTS.MODULE_NAME} | ${info}`;
  if (notify) ui.notifications?.info(info);
  console.log(info.replace("<br>", "\n"));
  return info;
}
export function warn(warning, notify = false) {
  warning = `${CONSTANTS.MODULE_NAME} | ${warning}`;
  if (notify) ui.notifications?.warn(warning);
  console.warn(warning.replace("<br>", "\n"));
  return warning;
}
export function error(error, notify = true) {
  error = `${CONSTANTS.MODULE_NAME} | ${error}`;
  if (notify) ui.notifications?.error(error);
  return new Error(error.replace("<br>", "\n"));
}
export function timelog(message) {
  warn(Date.now(), message);
}
export const i18n = (key) => {
  return game.i18n.localize(key)?.trim();
};
export const i18nFormat = (key, data = {}) => {
  return game.i18n.format(key, data)?.trim();
};
// export const setDebugLevel = (debugText: string): void => {
//   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
//   // 0 = none, warnings = 1, debug = 2, all = 3
//   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
// };
export function dialogWarning(message, icon = "fas fa-exclamation-triangle") {
  return `<p class="${CONSTANTS.MODULE_NAME}-dialog">
          <i style="font-size:3rem;" class="${icon}"></i><br><br>
          <strong style="font-size:1.2rem;">${CONSTANTS.MODULE_NAME}</strong>
          <br><br>${message}
      </p>`;
}

// ==================================================================================

export function prepareMapConfigurations() {
  let configurations = game.settings.get(CONSTANTS.MODULE_NAME, "configurations");
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
  let configurations = game.settings.get(CONSTANTS.MODULE_NAME, "configurations");
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
    //await game.settings.set(CONSTANTS.MODULE_NAME, "configurations", configurations);
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

export function isEmptyObject(obj) {
  // because Object.keys(new Date()).length === 0;
  // we have to do some additional check
  if (obj === null || obj === undefined) {
    return true;
  }
  const result =
    obj && // null and undefined check
    Object.keys(obj).length === 0; // || Object.getPrototypeOf(obj) === Object.prototype);
  return result;
}
