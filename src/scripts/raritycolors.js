import { isEmptyObject } from "./lib/lib.js";
import CONSTANTS from "./constants.js";
import API from "./API.js";
import Logger from "./lib/Logger.js";

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
    game.modules.get(CONSTANTS.MODULE_ID).api = API;
};

export const readyHooks = () => {
    // Do nothing
    if (isEmptyObject(API.mapConfigurations)) {
        API.mapConfigurations = API.getColorMap();
    }
};

// Tidy 5e Sheet compatibility
Hooks.on("tidy5e-sheet.renderActorSheet", (app, element) => {
    const options = {
        itemSelector: "[data-tidy-item-table-row]",
        itemNameSelector: "[data-tidy-item-name]",
    };
    // Undo any existing color overrides
    const html = $(element);
    html.find(options.itemSelector).css("background-color", "");
    html.find(options.itemSelector).css("color", "");
    if (html.find(options.itemNameSelector)?.length > 0) {
        html.find(options.itemNameSelector).css("color", "");
    }
    if (html.find(options.itemNameSelector2)?.length > 0) {
        html.find(options.itemNameSelector2).css("color", "");
    }
    renderActorRarityColors(app, $(element), options);
});

Hooks.on("renderActorSheet", (actorSheet, html) => {
    renderActorRarityColors(actorSheet, html, {
        itemSelector: ".items-list .item",
        itemNameSelector: ".item-name h4",
        itemNameSelector2: ".item-name .title", // New 3.0.0 sheet...
    });
});

Hooks.on("renderSidebarTab", (tab) => {
    if (tab instanceof CompendiumDirectory) {
        // Nothing here
    }
    if (tab instanceof Compendium) {
        applyChangesCompendiumRarityColor(tab);
    }
});

export async function applyChangesCompendiumRarityColor(tab) {
    const headerBanners = document.querySelectorAll(`.directory.compendium`).forEach(async (h) => {
        const dataPack = h.dataset.pack;
        const items = document.querySelectorAll(`.directory.compendium[data-pack='${dataPack}'] .directory-item`);
        for (let itemElement of items) {
            // let id = itemElement.outerHTML.match(/data-document-id="(.*?)"/);
            let id = itemElement.dataset.documentId;
            if (!id) {
                continue;
            }
            let item = await fromUuid(`Compendium.${dataPack}.${id}`);
            if (!item) {
                continue;
            }

            let itemNameElement = null;
            if (game.settings.get(CONSTANTS.MODULE_ID, "enableBackgroundColorInsteadText")) {
                itemNameElement = $(itemElement).find(".document-name");
                // const thumbnail = $(itemElement).find(".thumbnail");
                // thumbnail.css("z-index", 1); // stupid display flex
            } else {
                itemNameElement = $(itemElement).find(".document-name");
            }

            const color = API.getColorFromItem(item);
            if (itemNameElement.length > 0 && color) {
                if (color && !colorIsDefault(color)) {
                    if (game.settings.get(CONSTANTS.MODULE_ID, "enableBackgroundColorInsteadText")) {
                        const backgroundColor = API.getRarityTextBackgroundColor(color);
                        itemNameElement.css("background-color", backgroundColor);
                        if (game.modules.get("colorsettings")?.api) {
                            const textColor = API.getRarityTextColor(color);
                            itemNameElement.css("color", textColor);
                        }
                    } else {
                        itemNameElement.css("color", color);
                    }
                }
            }
        }
    });
}

export function renderActorRarityColors(actorSheet, html, options) {
    let rarityFlag = game.settings.get(CONSTANTS.MODULE_ID, "rarityFlag");
    if (!rarityFlag) {
        return;
    }
    if (isEmptyObject(API.mapConfigurations)) {
        API.mapConfigurations = API.getColorMap();
    }

    let items = html.find($(options.itemSelector));
    for (let itemElement of items) {
        // let id = itemElement.outerHTML.match(/data-item-id="(.*?)"/);
        let id = itemElement.dataset.itemId;
        if (!id) {
            continue;
        }
        let actor = actorSheet.object;
        // let item = actor.items.get(id[1]);
        let item = actor.items.get(id);
        if (!item) {
            continue;
        }
        let itemNameElement = null;
        if (game.settings.get(CONSTANTS.MODULE_ID, "enableBackgroundColorInsteadText")) {
            itemNameElement = $(itemElement);
        } else {
            if ($(itemElement).find(options.itemNameSelector)?.length > 0) {
                itemNameElement = $(itemElement).find(options.itemNameSelector);
            }
            if ($(itemElement).find(options.itemNameSelector2)?.length > 0) {
                itemNameElement = $(itemElement).find(options.itemNameSelector2);
            }
        }
        if (!itemNameElement) {
            continue;
        }

        const color = API.getColorFromItem(item);
        if (itemNameElement.length > 0 && color) {
            if (color && !colorIsDefault(color)) {
                if (game.settings.get(CONSTANTS.MODULE_ID, "enableBackgroundColorInsteadText")) {
                    const backgroundColor = API.getRarityTextBackgroundColor(color);
                    itemNameElement.css("background-color", backgroundColor);
                    if (game.modules.get("colorsettings")?.api) {
                        const textColor = API.getRarityTextColor(color);
                        itemNameElement.css("color", textColor);
                    }
                } else {
                    itemNameElement.css("color", color);
                }
            }
        }
    }
}

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
        // let id = itemElement.outerHTML.match(/data-document-id="(.*?)"/);
        let id = itemElement.dataset.documentId;
        if (!id) {
            continue;
        }
        // let item = game.items.get(id[1]);
        let item = game.items.get(id);
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
                    const backgroundColor = API.getRarityTextBackgroundColor(color);
                    itemNameElement.css("background-color", backgroundColor);
                    if (game.modules.get("colorsettings")?.api) {
                        const textColor = API.getRarityTextColor(color);
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

Hooks.on("tidy5e-sheet.renderItemSheet", (app, element, data) => {
    const options = {
        itemNameSelector: `[data-tidy-field="name"]`,
        raritySelectSelector: `select[data-tidy-field="system.rarity"]`,
    };

    // Undo any existing color overrides
    const html = $(element);
    if (html.find(options.itemNameSelector)?.length > 0) {
        html.find(options.itemNameSelector).css("background-color", "");
        html.find(options.itemNameSelector).css("color", "");
    }
    if (html.find(options.itemNameSelector2)?.length > 0) {
        html.find(options.itemNameSelector2).css("background-color", "");
        html.find(options.itemNameSelector2).css("color", "");
    }
    html.find(`${options.raritySelectSelector} option`).css("background-color", "");
    html.find(`${options.raritySelectSelector} option`).css("color", "");

    renderItemSheetRarityColors(app, html, data, options);
});

Hooks.on("renderItemSheet", (app, html, appData) => {
    const options = {
        itemNameSelector: 'input[name="name"]',
        raritySelectSelector: 'select[name="system.rarity"]',
    };
    renderItemSheetRarityColors(app, html, appData, options);
});

export function renderItemSheetRarityColors(app, html, appData, options) {
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
    let itemNameElement = null;
    if (html.find(options.itemNameSelector)?.length > 0) {
        itemNameElement = html.find(options.itemNameSelector);
    }
    if (html.find(options.itemNameSelector2)?.length > 0) {
        itemNameElement = html.find(options.itemNameSelector2);
    }
    if (!itemNameElement) {
        return;
    }
    // const itemRarityElement = html.find(`select[name="system.rarity"]`);

    const color = API.getColorFromItem(item);
    if (color && !colorIsDefault(color)) {
        if (game.settings.get(CONSTANTS.MODULE_ID, "enableBackgroundColorInsteadText")) {
            const backgroundColor = API.getRarityTextBackgroundColor(color);
            itemNameElement.css("background-color", backgroundColor);
            if (game.modules.get("colorsettings")?.api) {
                const textColor = API.getRarityTextColor(color);
                itemNameElement.css("color", textColor);
            }
        } else {
            itemNameElement.css("color", color);
        }
    }

    // Change rarity select element
    const raritySelectElement = html.find(options.raritySelectSelector);
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
            if (!API.mapConfigurations[rarityOrType]) {
                Logger.warn(`Cannot find color for rarity '${rarityOrType}'`, false, API.mapConfigurations);
                return;
            }
            const color = API.mapConfigurations[rarityOrType].color;

            $(this).css("color", color);
            // Color selected option
            if ($(this).prop("selected")) {
                const backgroundColor = API.getRarityTextBackgroundColor(color);
                $(this).css("background-color", backgroundColor);
                if (game.modules.get("colorsettings")?.api) {
                    const textColor = API.getRarityTextColor(color);
                    $(this).css("color", textColor);
                } else {
                    $(this).css("color", "white");
                }
            }
        });
}

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
        Logger.warn(`No configurations is been setted yet`);
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
    if (!mapAll["spell"]?.color) {
        mapAll["spell"] = {
            color: "#4a8396",
            name: "Spell",
        };
    }
    if (!mapAll["feat"]?.color) {
        mapAll["feat"] = {
            color: "#48d1cc",
            name: "Feature",
        };
    }
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
    configurations ??= {
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
    configurations.itemRarity ??= {
        custom: {},
        defaults: {},
    };
    configurations.spellSchools ??= {
        custom: {},
        defaults: {},
    };
    configurations.classFeatureTypes ??= {
        custom: {},
        defaults: {},
    };

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
            if (!value) {
                Logger.warn(`Cannot find color for rarity '${value.key}'`, false, value);
                continue;
            }
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
export function hexToRGBAString(colorHex, alpha = 1) {
    return API.hexToRGBAString(colorHex, alpha);
}

/**
 * turn hex rgba into rgba string
 * @param {String} hex 8 long hex value in string form, eg: "#123456ff"
 * @returns Array of rgba[r, g, b, a]
 */
export function hexToRGBA(hex) {
    return API.hexToRGBA(hex);
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
