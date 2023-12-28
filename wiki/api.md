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
game.modules.get('rarity-colors').api.getRarityTextBackgroundColor(rgbaHex, alpha = 0.25);
```

### Retrieve the background color with a specific opacity

`game.modules.get('rarity-colors').api.getRarityTextBackgroundColor(rgbaHex, alpha = 0.25)` ⇒ `string`

Retrieve the full color map of 'rarity-color' for you own use ?

**Returns**: `string` - The hex string of the color or the null value if not founded

| Param                    | Type                    | Default | Description                                            |
|--------------------------|-------------------------|---------|--------------------------------------------------------|
| rgbaHex      | `string`               |         | The rgbaHex 8 long hex value in string form, eg: "#123456ff" |
| alpha      | `number`               |    0.25     | OPTIONAL: The explicit alpha/opacity factro to apply to the background color |

**Example**:

```js
const hexBackgroundColor = game.modules.get('rarity-colors').api.getRarityTextBackgroundColor("#ffffffff",0.25);
```

### Retrieve the text color based on the background color text

`game.modules.get('rarity-colors').api.getRarityTextColor(rgbaHex, alpha = 0.25)` ⇒ `string`

Retrieve the full color map of 'rarity-color' for you own use ?

**Returns**: `('#ffffff'|'#000000')` - The hex string of the color black or white

| Param                    | Type                    | Default | Description                                            |
|--------------------------|-------------------------|---------|--------------------------------------------------------|
| rgbaHex      | `string`               |         | The rgbaHex 8 long hex value in string form, eg: "#123456ff" |
| threshold      | `number`               |    0.25     | OPTIONAL: threshold Contrast threshold to control the resulting font color, float values from 0 to 1.  |

**Example**:

```js
const hexTextColor = game.modules.get('rarity-colors').api.getRarityTextColor("#ffffffff",0.5);
```