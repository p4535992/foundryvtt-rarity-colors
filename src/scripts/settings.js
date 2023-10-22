import { i18n } from "./lib/lib.js";
import CONSTANTS from "./constants.js";
import { RarityColorsApp } from "./apps/rarity-colors-app.js";
export const registerSettings = function () {
  game.settings.registerMenu(CONSTANTS.MODULE_ID, "resetAllSettings", {
    name: `${CONSTANTS.MODULE_ID}.setting.reset.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.reset.hint`,
    icon: "fas fa-coins",
    type: ResetSettingsDialog,
    restricted: true,
  });
  game.settings.register(CONSTANTS.MODULE_ID, "rarityFlag", {
    name: `${CONSTANTS.MODULE_ID}.setting.rarityFlag.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.rarityFlag.hint`,
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
    requiresReload: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "spellFlag", {
    name: `${CONSTANTS.MODULE_ID}.setting.spellFlag.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.spellFlag.hint`,
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
    requiresReload: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "featFlag", {
    name: `${CONSTANTS.MODULE_ID}.setting.featFlag.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.featFlag.hint`,
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
    requiresReload: true,
  });

  /*
	game.settings.register(CONSTANTS.MODULE_ID, "uncommon", {
		name: `${CONSTANTS.MODULE_ID}.setting.uncommon.name`,
		hint: `${CONSTANTS.MODULE_ID}.setting.uncommon.hint`,
		scope: "client",
		type: String,
		default: "#008000",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_ID, "uncommonExternal", {
		name: `${CONSTANTS.MODULE_ID}.setting.uncommonExternal.name`,
		hint: `${CONSTANTS.MODULE_ID}.setting.uncommonExternal.hint`,
		scope: "client",
		type: String,
		default: "#006400",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_ID, "rare", {
		name: `${CONSTANTS.MODULE_ID}.setting.rare.name`,
		hint: `${CONSTANTS.MODULE_ID}.setting.rare.hint`,
		scope: "client",
		type: String,
		default: "#0000FF",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_ID, "rareExternal", {
		name: `${CONSTANTS.MODULE_ID}.setting.rareExternal.name`,
		hint: `${CONSTANTS.MODULE_ID}.setting.rareExternal.hint`,
		scope: "client",
		type: String,
		default: "#191970",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_ID, "veryrare", {
		name: `${CONSTANTS.MODULE_ID}.setting.veryrare.name`,
		hint: `${CONSTANTS.MODULE_ID}.setting.veryrare.hint`,
		scope: "client",
		type: String,
		default: "#800080",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_ID, "veryrareExternal", {
		name: `${CONSTANTS.MODULE_ID}.setting.veryrareExternal.name`,
		hint: `${CONSTANTS.MODULE_ID}.setting.veryrareExternal.hint`,
		scope: "client",
		type: String,
		default: "#4B0082",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_ID, "legendary", {
		name: `${CONSTANTS.MODULE_ID}.setting.legendary.name`,
		hint: `${CONSTANTS.MODULE_ID}.setting.legendary.hint`,
		scope: "client",
		type: String,
		default: "#FFA500",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_ID, "legendaryExternal", {
		name: `${CONSTANTS.MODULE_ID}.setting.legendaryExternal.name`,
		hint: `${CONSTANTS.MODULE_ID}.setting.legendaryExternal.hint`,
		scope: "client",
		type: String,
		default: "#D2691E",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_ID, "artifact", {
		name: `${CONSTANTS.MODULE_ID}.setting.artifact.name`,
		hint: `${CONSTANTS.MODULE_ID}.setting.artifact.hint`,
		scope: "client",
		type: String,
		default: "#D2691E",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_ID, "artifactExternal", {
		name: `${CONSTANTS.MODULE_ID}.setting.artifactExternal.name`,
		hint: `${CONSTANTS.MODULE_ID}.setting.artifactExternal.hint`,
		scope: "client",
		type: String,
		default: "#91450e",
		config: true,
		onChange: refresh
	});
	*/
  /*
	game.settings.register(CONSTANTS.MODULE_ID, "spell", {
		name: `${CONSTANTS.MODULE_ID}.setting.spell.name`,
		hint: `${CONSTANTS.MODULE_ID}.setting.spell.hint`,
		scope: "client",
		type: String,
		default: "#4a8396",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_ID, "spellExternal", {
		name: `${CONSTANTS.MODULE_ID}.setting.spellExternal.name`,
		hint: `${CONSTANTS.MODULE_ID}.setting.spellExternal.hint`,
		scope: "client",
		type: String,
		default: "#0000ff",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_ID, "feat", {
		name: `${CONSTANTS.MODULE_ID}.setting.feat.name`,
		hint: `${CONSTANTS.MODULE_ID}.setting.feat.hint`,
		scope: "client",
		type: String,
		default: "#48d1cc",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_ID, "featExternal", {
		name: `${CONSTANTS.MODULE_ID}.setting.featExternal.name`,
		hint: `${CONSTANTS.MODULE_ID}.setting.featExternal.hint`,
		scope: "client",
		type: String,
		default: "#0e5c59",
		config: true,
		onChange: refresh
	});
	*/
  game.settings.register(CONSTANTS.MODULE_ID, "configurations", {
    scope: "world",
    config: false,
    type: Object,
    default: {
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
    },
  });

  game.settings.registerMenu(CONSTANTS.MODULE_ID, "rarityColorsAppMenu", {
    name: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.menu.name`),
    label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.menu.label`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.menu.hint`),
    icon: "fas fa-cogs",
    scope: "world",
    restricted: true,
    type: RarityColorsApp,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "enableBackgroundColorInsteadText", {
    name: `${CONSTANTS.MODULE_ID}.setting.enableBackgroundColorInsteadText.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.enableBackgroundColorInsteadText.hint`,
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
    requiresReload: true,
  });

  // ========================================================================
  game.settings.register(CONSTANTS.MODULE_ID, "debug", {
    name: `${CONSTANTS.MODULE_ID}.setting.debug.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.debug.hint`,
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
  });
};
class ResetSettingsDialog extends FormApplication {
  constructor(...args) {
    //@ts-ignore
    super(...args);
    //@ts-ignore
    return new Dialog({
      title: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.title`),
      content:
        '<p style="margin-bottom:1rem;">' +
        game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.content`) +
        "</p>",
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.confirm`),
          callback: async () => {
            const worldSettings = game.settings.storage
              ?.get("world")
              ?.filter((setting) => setting.key.startsWith(`${CONSTANTS.MODULE_ID}.`));
            for (let setting of worldSettings) {
              console.log(`Reset setting '${setting.key}'`);
              await setting.delete();
            }
            //window.location.reload();
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.cancel`),
        },
      },
      default: "cancel",
    });
  }
  async _updateObject(event, formData) {
    // do nothing
  }
}
