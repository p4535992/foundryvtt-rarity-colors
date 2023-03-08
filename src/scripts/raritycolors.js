Hooks.on('renderActorSheet', (actor, html) => {
    if(!game.settings.get("rarity-colors", "rarityFlag")) {
      return
    }
    let items = html.find($(".items-list .item"))
    for(let i of items) {
        let id = i.outerHTML.match(/data-item-id="(.*?)"/)
        if(!id) {
          return
        }
        let rarity = actor.object.items.get(id[1]).getRollData()?.item.rarity
        if(rarity !== "" && rarity !== undefined) {
          i.classList.add(rarity.slugify().toLowerCase())
        }
    }
});

Hooks.on("renderSidebarTab", (bar, html) => {
    let rarityFlag = game.settings.get("rarity-colors", "rarityFlag")
    let spellFlag = game.settings.get("rarity-colors", "spellFlag")
    let featFlag = game.settings.get("rarity-colors", "featFlag")
    let items = html.find(".directory-item.document.item")
    for(let i of items) {
        let id = i.outerHTML.match(/data-document-id="(.*?)"/)
        if(!id) {
          continue;
        }
        let item = game.items.get(id[1])
        let rarity = item?.system?.rarity
        let type = item?.type
        if(rarity !== "" && rarity !== undefined && rarityFlag) {
          i.classList.add(rarity.slugify().toLowerCase().trim())
        }
        if(type === "spell" && spellFlag) {
          i.classList.add("spell")
        }
        if(type === "feat" && featFlag) {
          i.classList.add("feat")
        }
    }
});

Hooks.on('updateItem', (item, diff, options, userID) => {
    if (item.actor) {
      return;
    }
    ui.sidebar.render();
});

Hooks.on("renderItemSheet", (app, html, appData) => {
  // Color item name
  const itemNameElement = html.find(`input[name="name"]`);
  const itemType = appData.document.type;
  let rarity = appData.system.rarity || itemType;
  // if (rarity === "veryRare") {
  //   rarity = "veryrare";
  // }
  const isSpellFeat = itemType === "spell" || itemType === "feat";
  const spellFeatSetting = game.settings.get(moduleID, "spellFeats");

  let doColor = false;
  if (
      (isSpellFeat && spellFeatSetting)
      || (appData.system.rarity && appData.system.rarity !== "common")
  ) {
    doColor = true;
  }
  if (doColor) {
      const color = game.settings.get("rarity-colors", rarity.replaceAll(/\s/g,'').toLowerCase().trim());
      itemNameElement.css("color", color);
  }

  // Change rarity select element
  const raritySelectElement = html.find(`select[name="system.rarity"]`);
  if (!raritySelectElement.length) {
    return;
  }
  // const customRarities = game.settings.get(moduleID, "rarityNames");

  $(raritySelectElement).find(`option`).each(function() {
      let rarity = $(this).prop("value");
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
      const color = game.settings.get("rarity-colors", rarity.replaceAll(/\s/g,'').toLowerCase().trim());
      $(this).css("color", color);

      // Color selected option
      if ($(this).prop("selected")) {
          $(this).css("background-color", color);
          $(this).css("color", "white");
      }

  });
});
