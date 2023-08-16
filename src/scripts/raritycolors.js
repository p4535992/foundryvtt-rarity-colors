import { debug, isEmptyObject, prepareMapConfigurations, warn } from "./lib/lib.js";
import CONSTANTS from "./constants.js";

export let ORIGINAL_CONFIG = {};

let mapConfigurations = {};

export const initHooks = async () => {
  ORIGINAL_CONFIG = deepClone(game.dnd5e.config);

  let rarityFlag = game.settings.get(CONSTANTS.MODULE_NAME, "rarityFlag");
  if (!rarityFlag) {
    return;
  }
};

export const setupHooks = async () => {
  // setApi(API);
};

export const readyHooks = () => {
  // Do nothing
  if (isEmptyObject(mapConfigurations)) {
    mapConfigurations = prepareMapConfigurations();
  }
};

Hooks.on("renderActorSheet", (actorSheet, html) => {
  let rarityFlag = game.settings.get(CONSTANTS.MODULE_NAME, "rarityFlag");
  if (!rarityFlag) {
    return;
  }
  if (isEmptyObject(mapConfigurations)) {
    mapConfigurations = prepareMapConfigurations();
  }
  const spellFlag = game.settings.get(CONSTANTS.MODULE_NAME, "spellFlag");
  const featFlag = game.settings.get(CONSTANTS.MODULE_NAME, "featFlag");
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
    let rarity = item.getRollData()?.item.rarity || item?.system?.rarity || undefined;
    rarity = rarity ? rarity.replaceAll(/\s/g, "").toLowerCase().trim() : undefined;
    if (rarity && rarity === "common") {
      continue;
    }
    let type = item?.type;
    let rarityOrType = rarity || (type === "spell" || type === "feat" ? type : undefined);
    const itemNameElement = $(itemElement).find(".item-name h4");
    let doColor = false;
    if (rarity !== "" && rarity !== undefined) {
      //itemElement.classList.add("rarity-colors-" + rarity.slugify().toLowerCase());
      doColor = true;
    }
    if (type === "spell" && spellFlag) {
      //itemElement.classList.add("rarity-colors-spell");
      rarityOrType = item?.system.school ?? "spell";
      if (!mapConfigurations[rarityOrType]) {
        rarityOrType = "spell";
      }
      doColor = true;
    }
    if (type === "feat" && featFlag) {
      //itemElement.classList.add("rarity-colors-feat");
      rarityOrType = item?.system.type ?? "feat";
      if (!mapConfigurations[rarityOrType]) {
        rarityOrType = "feat";
      }
      doColor = true;
    }
    if (rarityOrType && itemNameElement.length > 0 && doColor) {
      debug(`Try to get setting : ${rarityOrType}`);
      const color = mapConfigurations[rarityOrType].color;
      if (color && color !== "#000000") {
        itemNameElement.css("color", color);
      }
    }
  }
});

Hooks.on("renderSidebarTab", (bar, html) => {
  if (bar.id !== "items") {
    return;
  }
  let rarityFlag = game.settings.get(CONSTANTS.MODULE_NAME, "rarityFlag");
  if (!rarityFlag) {
    return;
  }
  if (isEmptyObject(mapConfigurations)) {
    mapConfigurations = prepareMapConfigurations();
  }
  const spellFlag = game.settings.get(CONSTANTS.MODULE_NAME, "spellFlag");
  const featFlag = game.settings.get(CONSTANTS.MODULE_NAME, "featFlag");
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
    let rarity = item.getRollData()?.item.rarity || item?.system?.rarity || undefined;
    rarity = rarity ? rarity.replaceAll(/\s/g, "").toLowerCase().trim() : undefined;
    if (rarity && rarity === "common") {
      continue;
    }
    let type = item?.type;
    let rarityOrType = rarity || (type === "spell" || type === "feat" ? type : undefined);
    const itemNameElement = $(itemElement).find(".document-name");
    let doColor = false;
    if (rarityOrType !== "" && rarityOrType !== undefined) {
      //itemElement.classList.add("rarity-colors-" + rarityOrType.slugify().toLowerCase().trim());
      doColor = true;
    }
    if (type === "spell" && spellFlag) {
      //itemElement.classList.add("rarity-colors-spell");
      rarityOrType = item?.system.school ?? "spell";
      if (!mapConfigurations[rarityOrType]) {
        rarityOrType = "spell";
      }
      doColor = true;
    }
    if (type === "feat" && featFlag) {
      //itemElement.classList.add("rarity-colors-feat");
      rarityOrType = item?.system.type ?? "feat";
      if (!mapConfigurations[rarityOrType]) {
        rarityOrType = "feat";
      }
      doColor = true;
    }
    if (rarityOrType && itemNameElement.length > 0 && doColor) {
      const color = mapConfigurations[rarityOrType].color;
      if (color && color !== "#000000") {
        itemNameElement.css("color", color);
      }
    }
  }
});

Hooks.on("updateItem", (item, diff, options, userID) => {
  let rarityFlag = game.settings.get(CONSTANTS.MODULE_NAME, "rarityFlag");
  if (!rarityFlag) {
    return;
  }
  if (item.actor) {
    return;
  }
  ui.sidebar.render();
});

Hooks.on("renderItemSheet", (app, html, appData) => {
  let rarityFlag = game.settings.get(CONSTANTS.MODULE_NAME, "rarityFlag");
  if (!rarityFlag) {
    return;
  }
  if (isEmptyObject(mapConfigurations)) {
    mapConfigurations = prepareMapConfigurations();
  }
  // Color item name
  const itemNameElement = html.find(`input[name="name"]`);
  const itemRarityElement = html.find(`select[name="system.rarity"]`);
  const itemType = appData.document.type;
  let rarityOrType = appData.system.rarity
    ? appData.system.rarity.replaceAll(/\s/g, "").toLowerCase().trim()
    : itemType;

  let spellFlag = game.settings.get(CONSTANTS.MODULE_NAME, "spellFlag");
  let featFlag = game.settings.get(CONSTANTS.MODULE_NAME, "featFlag");
  const isSpell = itemType === "spell";
  const isFeat = itemType === "feat";
  let doColor = false;
  if (appData.system.rarity && appData.system.rarity !== "common") {
    doColor = true;
  } else if (isSpell && spellFlag) {
    rarityOrType = item?.system.school ?? "spell";
    if (!mapConfigurations[rarityOrType]) {
      rarityOrType = "spell";
    }
    doColor = true;
  } else if (isFeat && featFlag) {
    rarityOrType = item?.system.type ?? "feat";
    if (!mapConfigurations[rarityOrType]) {
      rarityOrType = "feat";
    }
    doColor = true;
  }

  if (doColor) {
    const color = mapConfigurations[rarityOrType].color;
    if (color && color !== "#000000") {
      itemNameElement.css("color", color);
    }
  }
  // Change rarity select element
  const raritySelectElement = html.find(`select[name="system.rarity"]`);
  if (!raritySelectElement.length) {
    return;
  }
  // const customRarities = game.settings.get(CONSTANTS.MODULE_NAME, "rarityNames");
  $(raritySelectElement)
    .find(`option`)
    .each(function () {
      let rarityOrType = $(this).prop("value")?.replaceAll(/\s/g, "").toLowerCase().trim() ?? undefined;
      if (!rarityOrType) {
        return;
      }
      if (rarityOrType === "common") {
        return;
      }
      const color = mapConfigurations[rarityOrType].color;
      $(this).css("color", color);
      // Color selected option
      if ($(this).prop("selected")) {
        $(this).css("background-color", color);
        $(this).css("color", "white");
      }
    });
});
