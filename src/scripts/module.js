import { warn } from "./lib/lib.js";
import CONSTANTS from "./constants.js";

export const initHooks = async () => {
	// Hooks.once("socketlib.ready", registerSocket);
	// registerSocket();
	Hooks.on("renderSettingsConfig", (app, el, data) => {
		const U = game.settings.get(CONSTANTS.MODULE_NAME, "uncommon");
		const UE = game.settings.get(CONSTANTS.MODULE_NAME, "uncommonExternal");
		const R = game.settings.get(CONSTANTS.MODULE_NAME, "rare");
		const RE = game.settings.get(CONSTANTS.MODULE_NAME, "rareExternal");
		const V = game.settings.get(CONSTANTS.MODULE_NAME, "veryrare");
		const VE = game.settings.get(CONSTANTS.MODULE_NAME, "veryrareExternal");
		const L = game.settings.get(CONSTANTS.MODULE_NAME, "legendary");
		const LE = game.settings.get(CONSTANTS.MODULE_NAME, "legendaryExternal");
		const A = game.settings.get(CONSTANTS.MODULE_NAME, "artifact");
		const AE = game.settings.get(CONSTANTS.MODULE_NAME, "artifactExternal");
		const S = game.settings.get(CONSTANTS.MODULE_NAME, "spell");
		const SE = game.settings.get(CONSTANTS.MODULE_NAME, "spellExternal");
		const F = game.settings.get(CONSTANTS.MODULE_NAME, "feat");
		const FE = game.settings.get(CONSTANTS.MODULE_NAME, "featExternal");
		el.find('[name="rarity-colors.uncommon"]')
			.parent()
			.append(`<input type="color" value="${U}" data-edit="rarity-colors.uncommon">`);
		el.find('[name="rarity-colors.uncommonExternal"]')
			.parent()
			.append(`<input type="color" value="${UE}" data-edit="rarity-colors.uncommonExternal">`);
		el.find('[name="rarity-colors.rare"]')
			.parent()
			.append(`<input type="color"value="${R}" data-edit="rarity-colors.rare">`);
		el.find('[name="rarity-colors.rareExternal"]')
			.parent()
			.append(`<input type="color" value="${RE}" data-edit="rarity-colors.rareExternal">`);
		el.find('[name="rarity-colors.veryrare"]')
			.parent()
			.append(`<input type="color"value="${V}" data-edit="rarity-colors.veryrare">`);
		el.find('[name="rarity-colors.veryrareExternal"]')
			.parent()
			.append(`<input type="color" value="${VE}" data-edit="rarity-colors.veryrareExternal">`);
		el.find('[name="rarity-colors.legendary"]')
			.parent()
			.append(`<input type="color" value="${L}" data-edit="rarity-colors.legendary">`);
		el.find('[name="rarity-colors.legendaryExternal"]')
			.parent()
			.append(`<input type="color"value="${LE}" data-edit="rarity-colors.legendaryExternal">`);
		el.find('[name="rarity-colors.artifact"]')
			.parent()
			.append(`<input type="color" value="${A}" data-edit="rarity-colors.artifact">`);
		el.find('[name="rarity-colors.artifactExternal"]')
			.parent()
			.append(`<input type="color"value="${AE}" data-edit="rarity-colors.artifactExternal">`);
		el.find('[name="rarity-colors.spell"]')
			.parent()
			.append(`<input type="color" value="${S}" data-edit="rarity-colors.spell">`);
		el.find('[name="rarity-colors.spellExternal"]')
			.parent()
			.append(`<input type="color"value="${SE}" data-edit="rarity-colors.spellExternal">`);
		el.find('[name="rarity-colors.feat"]')
			.parent()
			.append(`<input type="color" value="${F}" data-edit="rarity-colors.feat">`);
		el.find('[name="rarity-colors.featExternal"]')
			.parent()
			.append(`<input type="color"value="${FE}" data-edit="rarity-colors.featExternal">`);
	});
};

export const setupHooks = async () => {
	// setApi(API);
};

export const readyHooks = () => {};

Hooks.on("renderActorSheet", (actor, html) => {
	let rarityFlag = game.settings.get(CONSTANTS.MODULE_NAME, "rarityFlag");
	if (!rarityFlag) {
		return;
	}
	let spellFlag = game.settings.get(CONSTANTS.MODULE_NAME, "spellFlag");
	let featFlag = game.settings.get(CONSTANTS.MODULE_NAME, "featFlag");
	let items = html.find($(".items-list .item"));
	for (let i of items) {
		let id = i.outerHTML.match(/data-item-id="(.*?)"/);
		if (!id) {
			return;
		}
		let rarity = actor.object.items.get(id[1]).getRollData()?.item.rarity || undefined;
		let type = item?.type;
		if (rarity !== "" && rarity !== undefined) {
			i.classList.add("rarity-colors-" + rarity.slugify().toLowerCase());
		}
		if (type === "spell" && spellFlag) {
			i.classList.add("rarity-colors-spell");
		}
		if (type === "feat" && featFlag) {
			i.classList.add("rarity-colors-feat");
		}
	}
});

Hooks.on("renderSidebarTab", (bar, html) => {
	let rarityFlag = game.settings.get(CONSTANTS.MODULE_NAME, "rarityFlag");
	if (!game.settings.get(CONSTANTS.MODULE_NAME, "rarityFlag")) {
		return;
	}
	let spellFlag = game.settings.get(CONSTANTS.MODULE_NAME, "spellFlag");
	let featFlag = game.settings.get(CONSTANTS.MODULE_NAME, "featFlag");
	let items = html.find(".directory-item.document.item");
	for (let i of items) {
		let id = i.outerHTML.match(/data-document-id="(.*?)"/);
		if (!id) {
			continue;
		}
		let item = game.items.get(id[1]);
		let rarity = item?.system?.rarity ? item.system.rarity.replaceAll(/\s/g, "").toLowerCase().trim() : undefined;

		let type = item?.type;
		if (rarity !== "" && rarity !== undefined) {
			i.classList.add("rarity-colors-" + rarity.slugify().toLowerCase().trim());
		}
		if (type === "spell" && spellFlag) {
			i.classList.add("rarity-colors-spell");
		}
		if (type === "feat" && featFlag) {
			i.classList.add("rarity-colors-feat");
		}
	}
});

Hooks.on("updateItem", (item, diff, options, userID) => {
	if (item.actor) {
		return;
	}
	ui.sidebar.render();
});

Hooks.on("renderItemSheet", (app, html, appData) => {
	// Color item name
	const itemNameElement = html.find(`input[name="name"]`);
	const itemRarityElement = html.find(`select[name="system.rarity"]`);
	const itemType = appData.document.type;
	let rarity = appData.system.rarity ? appData.system.rarity.replaceAll(/\s/g, "").toLowerCase().trim() : itemType;

	// const isSpellFeat = itemType === "spell" || itemType === "feat";
	// const spellFeatSetting = game.settings.get(CONSTANTS.MODULE_NAME, "spellFeats");

	let spellFlag = game.settings.get(CONSTANTS.MODULE_NAME, "spellFlag");
	let featFlag = game.settings.get(CONSTANTS.MODULE_NAME, "featFlag");

	const isSpell = itemType === "spell";
	const isFeat = itemType === "feat";

	let doColor = false;
	if (appData.system.rarity && appData.system.rarity !== "common") {
		doColor = true;
	} else if (isSpell && spellFlag) {
		doColor = true;
	} else if (isFeat && featFlag) {
		doColor = true;
	}
	// else if ((isSpellFeat && spellFeatSetting) || ()) {
	// 	doColor = true;
	// }

	if (doColor) {
		const color = game.settings.get(CONSTANTS.MODULE_NAME, rarity);
		itemNameElement.css("color", color);
		// itemRarityElement.css("color", color);
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
			let rarity = $(this).prop("value")?.replaceAll(/\s/g, "").toLowerCase().trim() ?? undefined;
			if (!rarity) {
				return;
			}
			// Customize rarity names
			// if (rarity === "veryRare") {
			//   rarity = "very rare";
			// }
			// if (customRarities[rarity]) {
			// $(this).text(customRarities[rarity]);
			// }

			if (rarity === "common") {
				return;
			}
			// Color rarity select options
			// if (rarity === "very rare") {
			//   rarity = "veryrare";
			// }
			const color = game.settings.get(CONSTANTS.MODULE_NAME, rarity);
			$(this).css("color", color);

			// Color selected option
			if ($(this).prop("selected")) {
				$(this).css("background-color", color);
				$(this).css("color", "white");
			}
		});
});

Hooks.once("canvasReady", () => {
	refresh();
});

export function refresh() {
	const U = game.settings.get(CONSTANTS.MODULE_NAME, "uncommon");
	const UE = game.settings.get(CONSTANTS.MODULE_NAME, "uncommonExternal");
	const R = game.settings.get(CONSTANTS.MODULE_NAME, "rare");
	const RE = game.settings.get(CONSTANTS.MODULE_NAME, "rareExternal");
	const V = game.settings.get(CONSTANTS.MODULE_NAME, "veryrare");
	const VE = game.settings.get(CONSTANTS.MODULE_NAME, "veryrareExternal");
	const L = game.settings.get(CONSTANTS.MODULE_NAME, "legendary");
	const LE = game.settings.get(CONSTANTS.MODULE_NAME, "legendaryExternal");
	const A = game.settings.get(CONSTANTS.MODULE_NAME, "artifact");
	const AE = game.settings.get(CONSTANTS.MODULE_NAME, "artifactExternal");
	const S = game.settings.get(CONSTANTS.MODULE_NAME, "spell");
	const SE = game.settings.get(CONSTANTS.MODULE_NAME, "spellExternal");
	const F = game.settings.get(CONSTANTS.MODULE_NAME, "feat");
	const FE = game.settings.get(CONSTANTS.MODULE_NAME, "featExternal");

	document.documentElement.style.setProperty("--rarity-colors-uncommon", U);
	document.documentElement.style.setProperty("--rarity-colors-uncommonExternal", UE);
	document.documentElement.style.setProperty("--rarity-colors-rare", R);
	document.documentElement.style.setProperty("--rarity-colors-rareExternal", RE);
	document.documentElement.style.setProperty("--rarity-colors-veryrare", V);
	document.documentElement.style.setProperty("--rarity-colors-veryrareExternal", VE);
	document.documentElement.style.setProperty("--rarity-colors-legendary", L);
	document.documentElement.style.setProperty("--rarity-colors-legendaryExternal", LE);
	document.documentElement.style.setProperty("--rarity-colors-artifact", A);
	document.documentElement.style.setProperty("--rarity-colors-artifactExternal", AE);
	document.documentElement.style.setProperty("--rarity-colors-spell", S);
	document.documentElement.style.setProperty("--rarity-colors-spellExternal", SE);
	document.documentElement.style.setProperty("--rarity-colors-feat", F);
	document.documentElement.style.setProperty("--rarity-colors-featExternal", FE);
}
