import { isEmptyObject, isItemUnidentified } from "./lib/lib.js";
import CONSTANTS from "./constants.js";
import API from "./API.js";
import Logger from "./lib/Logger.js";

export let ORIGINAL_CONFIG = {};

let rarityColorBorderEnable = false;
let rarityColorBackgroundEnable = false;
let rarityColorTextEnable = false;
let rarityFlag = false;

export const initHooks = async () => {
    // TODO Make something for multisystem here
    ORIGINAL_CONFIG = foundry.utils.deepClone(game.dnd5e?.config || {});
};

export const setupHooks = async () => {
    game.modules.get(CONSTANTS.MODULE_ID).api = API;
    rarityColorBorderEnable = isBorderEnable();
    rarityColorBackgroundEnable = isBackgroundEnable();
    rarityColorTextEnable = isTextEnable();
    rarityFlag = isDisabled();
};

export const readyHooks = () => {
    // Do nothing
    if (isEmptyObject(API.mapConfigurations)) {
        API.mapConfigurations = API.getColorMap();
    }
};

// Tidy 5e Sheet compatibility
Hooks.on("tidy5e-sheet.renderActorSheet", (app, element) => {
    if (!rarityFlag) {
        return;
    }

    const options = {
        itemSelector: `[data-tidy-sheet-part='item-table-row'] .item-table-row, [data-tidy-sheet-part='item-table-row'].item-table-row`,
        itemNameSelector: `[data-tidy-sheet-part='item-name']`,
        itemImageNameSelector: `.item-image`,
    };
    // Undo any existing color overrides
    const html = $(element);
    if (options.itemSelector) {
        html.find(options.itemSelector).css("background-color", "");
        html.find(options.itemSelector).css("background", "");
        html.find(options.itemSelector).css("color", "");
    }
    if (html.find(options.itemNameSelector)?.length > 0) {
        html.find(options.itemNameSelector).css("color", "");
    }
    if (html.find(options.itemImageNameSelector)?.length > 0) {
        html.find(options.itemImageNameSelector).css("border", "");
    }
    renderActorRarityColors(app, $(element), options);
});

Hooks.on("renderActorSheet", (actorSheet, html) => {
    if (!rarityFlag) {
        return;
    }
    renderActorRarityColors(actorSheet, html, {
        itemSelector: ".items-list .item",
        itemNameSelector: ".item-name h4",
        itemImageNameSelector: ".item-image",
        itemNameSelector2: ".item-name .title", // New 3.0.0 sheet...
    });
});

Hooks.on("renderSidebarTab", (tab) => {
    if (!rarityFlag) {
        return;
    }
    if (tab instanceof CompendiumDirectory) {
        // Nothing here
    }
    if (tab instanceof Compendium) {
        applyChangesCompendiumRarityColor(tab);
    }
});

Hooks.on("renderSidebarTab", (bar, html) => {
    if (!rarityFlag) {
        return;
    }
    if (bar.id !== "items") {
        return;
    }
    if (isEmptyObject(API.mapConfigurations)) {
        API.mapConfigurations = API.getColorMap();
    }

    let items = html.find(".directory-item.document.item");
    for (let itemElement of items) {
        // let id = itemElement.outerHTML.match(/data-document-id="(.*?)"/);
        let item = null;
        if (!itemElement.dataset.uuid) {
            let id = itemElement.dataset.documentId;
            if (!id) {
                continue;
            }
            item = game.items.get(id);
        } else {
            item = fromUuidSync(itemElement.dataset.uuid);
        }

        if (!item) {
            continue;
        }
        // TODO make multisystem only dnd5e supported
        if (isItemUnidentified(item)) {
            Logger.debug(`Item is not identified no color is applied`, item);
            continue;
        }

        let itemNameElement = null;
        if (rarityColorBackgroundEnable) {
            itemNameElement = $(itemElement).find(".document-name");
            const thumbnail = $(itemElement).find(".thumbnail");
            thumbnail.css("z-index", 1); // stupid display flex
        } else if (rarityColorTextEnable) {
            itemNameElement = $(itemElement).find(".document-name");
        }
        let itemImageNameElement = null;
        if ($(itemElement).find("img.thumbnail")?.length > 0) {
            itemImageNameElement = $(itemElement).find("img.thumbnail");
        }

        const color = API.getColorFromItem(item);
        if (!colorIsDefault(color)) {
            if (itemNameElement?.length > 0) {
                if (rarityColorBackgroundEnable) {
                    const backgroundColor = API.getRarityTextBackgroundColor(color);
                    itemNameElement.css("background-color", backgroundColor);
                    if (game.modules.get("colorsettings")?.api) {
                        const textColor = API.getRarityTextColor(color);
                        itemNameElement.css("color", textColor);
                    }
                } else if (rarityColorTextEnable) {
                    itemNameElement.css("color", color);
                }
            }
            if (rarityColorBorderEnable) {
                if (itemImageNameElement?.length > 0) {
                    // itemImageNameElement.css("border-color", color+"!important");
                    itemImageNameElement.css("border", "solid " + color);
                    // itemImageNameElement.css("border-width", "thick");
                }
            }
        }
    }
});

// Hooks.on("updateItem", (item, diff, options, userID) => {
//     if (!rarityFlag) {
//         return;
//     }
//     if (item.actor) {
//         return;
//     }
//     ui.sidebar.render();
// });

Hooks.on("tidy5e-sheet.renderItemSheet", (app, element, data) => {
    if (!rarityFlag) {
        return;
    }
    const options = {
        itemNameSelector: `[data-tidy-field="name"]`,
        itemImageNameSelector: `[data-tidy-sheet-part='item-image']`,
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
    if (html.find(options.itemImageNameSelector)?.length > 0) {
        html.find(options.itemImageNameSelector).css("border", "");
    }
    html.find(`${options.raritySelectSelector} option`).css("background-color", "");
    html.find(`${options.raritySelectSelector} option`).css("color", "");

    renderItemSheetRarityColors(app, html, data, options);
});

Hooks.on("renderItemSheet", (app, html, appData) => {
    if (!rarityFlag) {
        return;
    }
    const options = {
        itemNameSelector: 'input[name="name"]',
        itemImageNameSelector: "img.profile",
        raritySelectSelector: 'select[name="system.rarity"]',
    };
    renderItemSheetRarityColors(app, html, appData, options);
});

// =================================================
// UTILITY
// ===================================================

async function applyChangesCompendiumRarityColor(tab) {
    if (game.settings.get(CONSTANTS.MODULE_ID, "disableRarityColorOnCompendium")) {
        return;
    }
    const headerBanners = document.querySelectorAll(`.directory.compendium`).forEach(async (h) => {
        const dataPack = h.dataset.pack;
        const items = document.querySelectorAll(`.directory.compendium[data-pack='${dataPack}'] .directory-item`);
        for (let itemElement of items) {
            // let id = itemElement.outerHTML.match(/data-document-id="(.*?)"/);
            let item = null;
            if (!itemElement.dataset.uuid) {
                let id = itemElement.dataset.documentId;
                if (!id) {
                    continue;
                }
                item = await fromUuid(`Compendium.${dataPack}.${id}`);
            } else {
                item = await fromUuid(itemElement.dataset.uuid);
            }

            if (!item) {
                continue;
            }
            // TODO make multisystem only dnd5e supported
            if (isItemUnidentified(item)) {
                Logger.debug(`Item is not identified no color is applied`, item);
                continue;
            }

            let itemNameElement = null;
            let itemImageNameElement = null;
            if (rarityColorBackgroundEnable) {
                itemNameElement = $(itemElement).find(".document-name");
                itemImageNameElement = $(itemElement).find("img.thumbnail");
                // const thumbnail = $(itemElement).find(".thumbnail");
                // thumbnail.css("z-index", 1); // stupid display flex
            } else if (rarityColorTextEnable) {
                itemNameElement = $(itemElement).find(".document-name");
                itemImageNameElement = $(itemElement).find("img.thumbnail");
            }

            const color = API.getColorFromItem(item);
            if (!colorIsDefault(color)) {
                if (itemNameElement?.length > 0) {
                    if (rarityColorBackgroundEnable) {
                        const backgroundColor = API.getRarityTextBackgroundColor(color);
                        itemNameElement.css("background-color", backgroundColor);
                        if (game.modules.get("colorsettings")?.api) {
                            const textColor = API.getRarityTextColor(color);
                            itemNameElement.css("color", textColor);
                        }
                    } else if (rarityColorTextEnable) {
                        itemNameElement.css("color", color);
                    }
                }
                if (rarityColorBorderEnable) {
                    if (itemImageNameElement?.length > 0) {
                        // itemImageNameElement.css("border-color", color+"!important");
                        itemImageNameElement.css("border", "solid " + color);
                        // itemImageNameElement.css("border-width", "thick");
                    }
                }
            }
        }
    });
}

function renderActorRarityColors(actorSheet, html, options) {
    if (isEmptyObject(API.mapConfigurations)) {
        API.mapConfigurations = API.getColorMap();
    }

    let items = [];
    if (html.find($(options.itemSelector))?.length > 0) {
        items = html.find($(options.itemSelector));
    }
    if (html.find($(options.itemSelector2))?.length > 0) {
        items = html.find($(options.itemSelector2));
    }
    // let items = html.find($(options.itemSelector));
    for (let itemElement of items) {
        // let id = itemElement.outerHTML.match(/data-item-id="(.*?)"/);
        // Get closest available Item dataset.
        let id = itemElement.closest("[data-item-id]")?.dataset.itemId;
        if (!id) {
            continue;
        }
        let actor = actorSheet.object;
        // let item = actor.items.get(id[1]);
        let item = actor.items.get(id);
        if (!item) {
            continue;
        }
        // TODO make multisystem only dnd5e supported
        if (isItemUnidentified(item)) {
            Logger.debug(`Item is not identified no color is applied`, item);
            continue;
        }

        let itemNameElement = null;
        if (rarityColorBackgroundEnable) {
            itemNameElement = $(itemElement);
        } else if (rarityColorTextEnable) {
            if ($(itemElement).find(options.itemNameSelector)?.length > 0) {
                itemNameElement = $(itemElement).find(options.itemNameSelector);
            }
            if ($(itemElement).find(options.itemNameSelector2)?.length > 0) {
                itemNameElement = $(itemElement).find(options.itemNameSelector2);
            }
        }
        // if (!itemNameElement) {
        //     continue;
        // }
        let itemImageNameElement = null;
        if ($(itemElement).find(options.itemImageNameSelector)?.length > 0) {
            itemImageNameElement = $(itemElement).find(options.itemImageNameSelector);
        }

        const color = API.getColorFromItem(item);
        if (!colorIsDefault(color)) {
            if (itemNameElement?.length > 0) {
                if (rarityColorBackgroundEnable) {
                    const backgroundColor = API.getRarityTextBackgroundColor(color);
                    // Target background-color and background to ensure there are no overlapping backgrounds.
                    itemNameElement.css("background-color", backgroundColor);
                    itemNameElement.css("background", backgroundColor);
                    if (game.modules.get("colorsettings")?.api) {
                        const textColor = API.getRarityTextColor(color);
                        itemNameElement.css("color", textColor);
                    }
                } else if (rarityColorTextEnable) {
                    itemNameElement.css("color", color);
                }
            }
            if (rarityColorBorderEnable) {
                if (itemImageNameElement?.length > 0) {
                    //itemImageNameElement.css("border-color", color+"!important");
                    itemImageNameElement.css("border", "solid " + color);
                    // itemImageNameElement.css("border-width", "thick");
                }
            }
        }
    }
}

function renderItemSheetRarityColors(app, html, appData, options) {
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
    // if (!itemNameElement) {
    //     return;
    // }
    let itemImageNameElement = null;
    if (html.find(options.itemImageNameSelector)?.length > 0) {
        itemImageNameElement = html.find(options.itemImageNameSelector);
    }

    const color = API.getColorFromItem(item);
    if (!colorIsDefault(color)) {
        if (itemNameElement?.length > 0) {
            if (rarityColorBackgroundEnable) {
                const backgroundColor = API.getRarityTextBackgroundColor(color);
                itemNameElement.css("background-color", backgroundColor);
                if (game.modules.get("colorsettings")?.api) {
                    const textColor = API.getRarityTextColor(color);
                    itemNameElement.css("color", textColor);
                }
            } else if (rarityColorTextEnable) {
                itemNameElement.css("color", color);
            }
        }
        if (rarityColorBorderEnable) {
            if (itemImageNameElement?.length > 0 && color) {
                // itemImageNameElement.css("border-color", color+"!important");
                itemImageNameElement.css("border", "solid " + color);
                // itemImageNameElement.css("border-width", "thick");
            }
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

function _retrieveMapItemRarityDefaults() {
    let mapItemRarityDefaults = {};
    mapItemRarityDefaults["common"] = { color: "#000000" };
    mapItemRarityDefaults["uncommon"] = { color: "#4bff4aff" };
    mapItemRarityDefaults["rare"] = { color: "#0000ffff" };
    mapItemRarityDefaults["veryrare"] = { color: "#800080ff" };
    mapItemRarityDefaults["legendary"] = { color: "#ffa500ff" };
    mapItemRarityDefaults["artifact"] = { color: "#d2691eff" };
    mapItemRarityDefaults["spell"] = { color: "#4a8396ff" };
    mapItemRarityDefaults["feat"] = { color: "#48d1ccff" };
    return mapItemRarityDefaults;
}

function _retrieveMapSpellSchoolsRarityDefaults() {
    let mapSpellSchool = {};
    mapSpellSchool["abj"] = { color: "#4bff4aff" };
    mapSpellSchool["con"] = { color: "#d14848ff" };
    mapSpellSchool["div"] = { color: "#4a8396ff" };
    mapSpellSchool["enc"] = { color: "#d557ffff" };
    mapSpellSchool["evo"] = { color: "#48d1ccff" };
    mapSpellSchool["ill"] = { color: "#fffc66ff" };
    mapSpellSchool["nec"] = { color: "#800080ff" };
    mapSpellSchool["trs"] = { color: "#d2691eff" };
    return mapSpellSchool;
}

function _retrieveMapClassFeatureTypesRarityDefaults() {
    let mapClassFeatureTypes = {};
    mapClassFeatureTypes["background"] = { color: "#d557ffff" };
    mapClassFeatureTypes["class"] = { color: "#5e9effff" };
    mapClassFeatureTypes["feat"] = { color: "#d14848ff" };
    mapClassFeatureTypes["monster"] = { color: "#4bff4aff" };
    mapClassFeatureTypes["race"] = { color: "#fffc66ff" };
    mapClassFeatureTypes["supernaturalGift"] = { color: "#ffbc44ff" };
    return mapClassFeatureTypes;
}

export function prepareMapConfigurations() {
    let configurations = game.settings.get(CONSTANTS.MODULE_ID, "configurations");
    let mapAll = {};
    if (
        isEmptyObject(configurations) ||
        isEmptyObject(configurations.itemRarity) ||
        isEmptyObject(configurations.itemRarity.defaults)
    ) {
        Logger.warn(`No configurations is been setted yet`);
        let mapItemRarityDefaults = _retrieveMapItemRarityDefaults();
        foundry.utils.mergeObject(mapAll, mapItemRarityDefaults);
    } else {
        prepareMapItemRarity(mapAll, configurations.itemRarity);
    }

    if (
        isEmptyObject(configurations) ||
        isEmptyObject(configurations.spellSchools) ||
        isEmptyObject(configurations.spellSchools.defaults)
    ) {
        let mapSpellSchoolsRarityDefaults = _retrieveMapSpellSchoolsRarityDefaults();
        foundry.utils.mergeObject(mapAll, mapSpellSchoolsRarityDefaults);
    } else {
        prepareMapSpellSchools(mapAll, configurations.spellSchools);
    }

    if (
        isEmptyObject(configurations) ||
        isEmptyObject(configurations.classFeatureTypes) ||
        isEmptyObject(configurations.classFeatureTypes.defaults)
    ) {
        let mapClassFeatureTypesRarityDefaults = _retrieveMapClassFeatureTypesRarityDefaults();
        foundry.utils.mergeObject(mapAll, mapClassFeatureTypesRarityDefaults);
    } else {
        prepareMapClassFeatureTypes(mapAll, configurations.classFeatureTypes);
    }

    // just for retro compatibility
    if (!mapAll["spell"]?.color) {
        mapAll["spell"] = {
            color: "#4a8396ff",
            name: "Spell",
        };
    }
    if (!mapAll["feat"]?.color) {
        mapAll["feat"] = {
            color: "#48d1ccff",
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
                custom: configurations?.spellSchools?.custom || {},
                defaults: {},
            },
            itemRarity: {
                custom: configurations?.itemRarity?.custom || {},
                defaults: {},
            },
            classFeatureTypes: {
                custom: configurations?.classFeatureTypes?.custom || {},
                defaults: {},
            },
        };
        //await game.settings.set(CONSTANTS.MODULE_ID, "configurations", configurations);
    }
    configurations ??= {
        spellSchools: {
            custom: configurations?.spellSchools?.custom || {},
            defaults: {},
        },
        itemRarity: {
            custom: configurations?.itemRarity?.custom || {},
            defaults: {},
        },
        classFeatureTypes: {
            custom: configurations?.classFeatureTypes?.custom || {},
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
    // TODO Make something for multisystem here
    const itemRarity = foundry.utils.deepClone(game.dnd5e?.config?.itemRarity || {});
    const custom = customItemRarity.custom ?? {};
    if (isEmptyObject(customItemRarity.defaults)) {
        customItemRarity.defaults = itemRarity;
    }
    const defaultItemRarity = customItemRarity.defaults;
    for (const [key, value] of Object.entries(defaultItemRarity)) {
        if (key === "undefined" || key === "null") {
            delete itemRarity[key];
        } else if (typeof value === "string" || value instanceof String) {
            itemRarity[key] = {
                color: "#000000",
                name: value,
            };
        }
    }
    for (const [key, value] of Object.entries(custom)) {
        if (key === "undefined" || key === "null") {
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
    // TODO Make something for multisystem here
    const spellSchools = foundry.utils.deepClone(game.dnd5e?.config?.spellSchools || {});
    const custom = customSpellSchools.custom ?? {};
    if (isEmptyObject(customSpellSchools.defaults)) {
        customSpellSchools.defaults = spellSchools;
    }
    const defaultSpellSchools = customSpellSchools.defaults;
    for (const [key, value] of Object.entries(defaultSpellSchools)) {
        if (key === "undefined" || key === "null") {
            delete spellSchools[key];
        } else if (typeof value === "string" || value instanceof String) {
            spellSchools[key] = {
                color: "#4a8396ff",
                name: value,
            };
        }
    }
    for (const [key, value] of Object.entries(custom)) {
        if (key === "undefined" || key === "null") {
            continue;
        } else {
            spellSchools[value.key] = {
                color: value.color ?? "#4a8396ff",
                name: value.name ? value.name : value.label,
            };
        }
    }
}

function prepareClassFeatureTypes(customClassFeatureTypes) {
    // TODO Make something for multisystem here
    // const classFeatureTypes = foundry.utils.deepClone(game.dnd5e?.config?.featureTypes?.class?.subtypes || {});
    const classFeatureTypes = foundry.utils.deepClone(game.dnd5e?.config?.featureTypes || {});
    const custom = customClassFeatureTypes.custom ?? {};
    if (isEmptyObject(customClassFeatureTypes.defaults)) {
        customClassFeatureTypes.defaults = classFeatureTypes;
    }
    const defaultClassFeatureTypes = customClassFeatureTypes.defaults;
    for (const [key, value] of Object.entries(defaultClassFeatureTypes)) {
        if (key === "undefined" || key === "null") {
            delete classFeatureTypes[key];
        } else if (typeof value === "string" || value instanceof String) {
            classFeatureTypes[key] = {
                color: "#48d1ccff",
                name: value,
            };
        }
    }
    for (const [key, value] of Object.entries(custom)) {
        if (key === "undefined" || key === "null") {
            continue;
        } else {
            classFeatureTypes[value.key] = {
                color: value.color ?? "#48d1ccff",
                name: value.name ? value.name : value.label,
            };
        }
    }
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

function isDisabled() {
    return (
        game.settings.get(CONSTANTS.MODULE_ID, "rarityFlag") ||
        game.settings.get(CONSTANTS.MODULE_ID, "rarityColorMode") === CONSTANTS.SETTINGS.MODE.NONE
    );
}

function isBackgroundEnable() {
    return (
        game.settings.get(CONSTANTS.MODULE_ID, "rarityColorMode") === CONSTANTS.SETTINGS.MODE.BACKGROUND_AND_BORDER ||
        game.settings.get(CONSTANTS.MODULE_ID, "rarityColorMode") === CONSTANTS.SETTINGS.MODE.ONLY_BACKGROUND
    );
}

function isBorderEnable() {
    return (
        game.settings.get(CONSTANTS.MODULE_ID, "rarityColorMode") === CONSTANTS.SETTINGS.MODE.BACKGROUND_AND_BORDER ||
        game.settings.get(CONSTANTS.MODULE_ID, "rarityColorMode") === CONSTANTS.SETTINGS.MODE.TEXT_AND_BORDER ||
        game.settings.get(CONSTANTS.MODULE_ID, "rarityColorMode") === CONSTANTS.SETTINGS.MODE.ONLY_BORDER
    );
}

function isTextEnable() {
    return (
        game.settings.get(CONSTANTS.MODULE_ID, "rarityColorMode") === CONSTANTS.SETTINGS.MODE.TEXT_AND_BORDER ||
        game.settings.get(CONSTANTS.MODULE_ID, "rarityColorMode") === CONSTANTS.SETTINGS.MODE.ONLY_TEXT
    );
}
