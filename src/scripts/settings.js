import { i18n } from "./lib/lib.js";
import CONSTANTS from "./constants.js";
export const registerSettings = function () {
	game.settings.registerMenu(CONSTANTS.MODULE_NAME, "resetAllSettings", {
		name: `${CONSTANTS.MODULE_NAME}.setting.reset.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.reset.hint`,
		icon: "fas fa-coins",
		type: ResetSettingsDialog,
		restricted: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "rarityFlag", {
		name: game.i18n.format("rarity-colors.rarityFlag.name"),
		hint: game.i18n.format("rarity-colors.rarityFlag.hint"),
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "spellFlag", {
		name: game.i18n.format("rarity-colors.spellFlag.name"),
		hint: game.i18n.format("rarity-colors.spellFlag.hint"),
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "featFlag", {
		name: game.i18n.format("rarity-colors.featFlag.name"),
		hint: game.i18n.format("rarity-colors.featFlag.hint"),
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "uncommon", {
		name: "Uncommon",
		scope: "client",
		type: String,
		default: "#008000",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "uncommonExternal", {
		name: "Uncommon External",
		scope: "client",
		type: String,
		default: "#006400",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "rare", {
		name: "Rare",
		scope: "client",
		type: String,
		default: "#0000FF",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "rareExternal", {
		name: "Rare External",
		scope: "client",
		type: String,
		default: "#191970",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "veryrare", {
		name: "Very Rare",
		scope: "client",
		type: String,
		default: "#800080",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "veryrareExternal", {
		name: "Very Rare External",
		scope: "client",
		type: String,
		default: "#4B0082",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "legendary", {
		name: "Legendary",
		scope: "client",
		type: String,
		default: "#FFA500",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "legendaryExternal", {
		name: "Legendary External",
		scope: "client",
		type: String,
		default: "#D2691E",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "artifact", {
		name: "Artifact",
		scope: "client",
		type: String,
		default: "#D2691E",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "artifactExternal", {
		name: "Artifact External",
		scope: "client",
		type: String,
		default: "#91450e",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "spell", {
		name: "Spell",
		scope: "client",
		type: String,
		default: "#add8e6",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "spellExternal", {
		name: "Spell External",
		scope: "client",
		type: String,
		default: "#0000ff",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "feat", {
		name: "Feat",
		scope: "client",
		type: String,
		default: "#48d1cc",
		config: true,
		onChange: refresh
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "featExternal", {
		name: "Feat External",
		scope: "client",
		type: String,
		default: "#0e5c59",
		config: true,
		onChange: refresh
	});
};
