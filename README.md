<p align="center">
  <img width=60% src="https://user-images.githubusercontent.com/68125679/193473284-e14ea33d-b086-4c28-870d-4221e766d775.png">
  <br>
  <a href="https://npmjs.com/package/oceanic.js"><img src="https://img.shields.io/npm/v/oceanic.js.svg?style=flat-square&color=informational"></a>
  <img src="https://img.shields.io/github/stars/OceanicJS/Oceanic?color=yellow&style=flat-square">
  <img src="https://img.shields.io/npm/dw/oceanic.js?color=red&style=flat-square">
</p>

```js
const { Client } = require("oceanic.js");
const client = new Client({ auth: "Bot [TOKEN]" });

client.on("ready", async() => {
    console.log("Ready as", client.user.tag);
});

// if you do not add a listener for the error event, any errors will cause an UncaughtError to be thrown,
// and your process may be killed as a result.
client.on("error", (err) => {
    console.error("Something Broke!", err);
});

client.connect();
```
For more examples, see the [examples](https://github.com/OceanicJS/Oceanic/tree/dev/examples) folder on GitHub.
<hr>

## Installation
[NodeJS](https://nodejs.org/en/download) **22.12.0** or higher is required.

**See [Development Builds](#development-builds) if you wish to install in-dev versions.**

```sh
npm i oceanic.js --omit=optional
```

If you need voice support, add `--include=optional`. Voice support is provided by [@discordjs/voice](https://discord.js.org/docs/packages/voice/0.19.0). **Requires NodeJS 22.12.0 or higher**.

See the [examples](https://github.com/OceanicJS/Oceanic/tree/dev/examples) folder on GitHub for some examples, and visit [this site](https://docs.oceanic.ws) for documentation.

### Development Builds
```sh
npm i oceanic.js@dev
```

The documentation under `dev` is always for the latest commit. If something isn't working that's in the documentation, you're likely looking at the wrong documentation.

<hr>

### Optional Dependencies
All compression options are mutually exclusive.
* `pako` - zlib Compression (gateway)
* `zlib-sync` - zlib Compression (gateway, faster than pako)
* `erlpack` - Encoding (gateway, alternative to JSON)
* `zstd-napi` - zstd compression (gateway)
* `node:zlib` (node >=22.15.0, >=23.8.0) - zstd compression (gateway, faster than zstd-napi)
* `@discordjs/voice` - voice, requires node >=22.12.0

## Links
* [Examples](https://github.com/OceanicJS/Oceanic/tree/dev/examples)
* [Latest Release Documentation](https://docs.oceanic.ws/latest)
* [Development Documentation](https://docs.oceanic.ws/dev)
* [Discord Server](https://discord.gg/xZ4AhdYrf9)
* [Source](https://github.com/OceanicJS/Oceanic)
