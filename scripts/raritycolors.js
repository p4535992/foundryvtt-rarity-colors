CONFIG.debug.hooks = true
Hooks.on('renderActorSheet', (actor, html) => {
    let items = html.find($(".items-list .item"))
    for(let i of items) {
        let id = i.outerHTML.match(/data-item-id="(.*?)"/)
        let rarity = actor.object.items.get(id[1]).data.data.rarity
        if(rarity !== "" && rarity !== undefined) i.classList.add(rarity.slugify().toLowerCase())
    }
});

Hooks.on("renderSidebarTab", (bar, html) => {
    let items = html.find(".directory-item.entity.item")
    for(let i of items) {
        let id = i.outerHTML.match(/data-entity-id="(.*?)"/)
        let item = game.items.get(id[1])
        let rarity = item.data.data.rarity
        let type = item.data.type
        if(rarity !== "" && rarity !== undefined) i.classList.add(rarity.slugify().toLowerCase())
        if(type === "spell") i.classList.add("spell")
        if(type === "feat") i.classList.add("feat")
    }
})