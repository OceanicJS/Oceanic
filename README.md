# Oceanic [![NPM version](https://img.shields.io/npm/v/oceanic.js.svg?style=flat-square&color=informational)](https://npmjs.com/package/oceanic.js)
A NodeJS Library for Discord.

<hr>

## Installation
NodeJS **16.16.0** or higher is required.

**See [Development Builds](#development-builds) if you wish to install in-dev versions.**

```sh
npm i oceanic.js --no-optional
```

If you need voice support, remove `--no-optional`. Voice support is currently provided by [@discordjs/voice](https://discord.js.org/#/docs/voice/main/general/welcome).

See the [examples](https://github.com/OceanicJS/Oceanic/tree/dev/examples) folder on GitHub for some examples, and visit [this site](https://oceanic.owo-whats-this.dev) for documentation.

### Development Builds
```sh
npm i oceanic.js@dev
```

The documentation under `dev` is always for the latest commit. If something isn't working that's in the documentation, you're likely looking at the wrong documentation.

<hr>

### Optional Dependencies
* `pako` - Compression (gateway)
* `zlib-sync` - Compression (gateway, faster than pako)
* `erlpack` - Encoding (gateway, alternative to JSON)

## Links
* [Examples](https://github.com/OceanicJS/Oceanic/tree/dev/examples)
* [Release Documentation](https://oceanic.owo-whats-this.dev/latest)
* [Development Documentation](https://oceanic.owo-whats-this.dev/dev)
* [Discord Server](https://discord.gg/xZ4AhdYrf9)
* [Source](https://github.com/OceanicJS/Oceanic)
