# Rarity Colors

![Latest Release Download Count](https://img.shields.io/github/downloads/p4535992/foundryvtt-rarity-colors/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge)

[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Frarity-colors&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=rarity-colors)

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-rarity-colors%2Fmaster%2Fmodule.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=orange&style=for-the-badge)

![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-rarity-colors%2Fmaster%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Frarity-colors%2Fshield%2Fendorsements&style=for-the-badge)](https://www.foundryvtt-hub.com/package/rarity-colors/)

![GitHub all releases](https://img.shields.io/github/downloads/p4535992/foundryvtt-rarity-colors/total?style=for-the-badge)

[![Translation status](https://weblate.foundryvtt-hub.com/widgets/rarity-colors/-/287x66-black.png)](https://weblate.foundryvtt-hub.com/engage/rarity-colors/)

### If you want to buy me a coffee [![alt-text](https://img.shields.io/badge/-Patreon-%23ff424d?style=for-the-badge)](https://www.patreon.com/p4535992)

**Note: This is module is inspired from the  wonderful work done by [kandashi](https://github.com/kandashi) with the module [Rarity Color](https://github.com/kandashi/rarity-colors)

Give your Inventory and Sidebar a splash of color. Re-colors Actor Inventory Items and the Items Sidebar names with colors based on item rarity and type.

### NOTE: Is been tested only on Dnd5e, but it should work with all the system with the property `system.rarity` as string, a API support is been recently added for help the integration with other system

![image](https://user-images.githubusercontent.com/1347785/140974008-cc790018-4fb3-410b-a856-9993cfba498b.png)

### Color Settings

This module uses the [colorsettings](https://github.com/ardittristan/VTTColorSettings). It is a mandatory dependency but it is recommended for the best experience and compatibility with other modules.


## Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/p4535992/foundryvtt-rarity-colors/master/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/p4535992/foundryvtt-rarity-colors/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## Api

All the api information are here [API](./wiki/api.md)

# Build

## Install all packages

```bash
npm install
```

### dev

`dev` will let you develop you own code with hot reloading on the browser

```bash
npm run dev
```

## npm build scripts

### build

`build` will build and set up a symlink between `dist` and your `dataPath`.

```bash
npm run build
```

### build-watch

`build-watch` will build and watch for changes, rebuilding automatically.

```bash
npm run build-watch
```

### prettier-format

`prettier-format` launch the prettier plugin based on the configuration [here](./.prettierrc)

```bash
npm run-script prettier-format
```

### lint and lint:fix

`lint` launch the eslint process based on the configuration [here](./.eslintrc.json)

```bash
npm run-script lint
```

`lint:fix` launch the eslint process with the fix argument

```bash
npm run-script lint:fix
```

## [Changelog](./CHANGELOG.md)

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/p4535992/foundryvtt-rarity-colors/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## License

This package is under an [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).

- [Rarity Color](https://github.com/kandashi/rarity-colors) with license [MIT](https://github.com/kandashi/rarity-colors/blob/master/LICENSE)
- [font-color-contrast](https://github.com/russoedu/font-color-contrast) with license [MIT](https://github.com/russoedu/font-color-contrast/blob/master/LICENSE)

## Credit

Thanks to anyone who helps me with this code! I appreciate the user community's feedback on this project!

- Ty to  [Kandashi](https://github.com/kandashi) and the module [Rarity Color](https://github.com/kandashi/rarity-colors)
- Ty to  [russoedu](https://github.com/russoedu) and the module [font-color-contrast](https://github.com/russoedu/font-color-contrast)
