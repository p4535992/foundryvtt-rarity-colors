# API DOCUMENTATION

### The documentation can be out of sync with the API code checkout the code if you want to dig up [API](../src/scripts/API.js)

The api is reachable from the variable `game.modules.get('rarity-colors').api`

### Get color from item

`game.modules.get('rarity-colors').api.getColorFromItem(item:string|Item, applyModuleSettings:boolean)` ⇒ `string`

Method to recover the color from a item reference

**Returns**: `string|null` - The hex string of the color or the null value if not founded

| Param                    | Type                    | Default | Description                                            |
|--------------------------|-------------------------|---------|--------------------------------------------------------|
| item                     | `string (Item id or Item uuid) or Item`        |         | The item reference can be the item himself or a item id or a item uuid        |
| applyModuleSettings      | `boolean`               |   true      | OPTIONAL: if true it will apply the 'rarity-colors' module settings |

**Example**:

```js
const item  = <item or item id or item uuid>;
game.modules.get('rarity-colors').api.getColorFromItem(item, true);
```


### Get color map

`game.modules.get('rarity-colors').api.getColorMap()` ⇒ `Object.<string, {color: string}>`

Retrieve the full color map of 'rarity-color' for you own use ?

**Returns**: `Object.<string, {color: string}>` - The hex string of the color or the null value if not founded

| Param                    | Type                    | Default | Description                                            |
|--------------------------|-------------------------|---------|--------------------------------------------------------|


**Example**:

```js
game.modules.get('rarity-colors').api.getColorMap();
```
