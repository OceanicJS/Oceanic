import { cp, readFile, writeFile } from "fs/promises";
import pkg from "../package.json" assert { type: "json" };

await writeFile(new URL("../dist/cjs/package.json", import.meta.url), JSON.stringify({ type: "commonjs" }));
await writeFile(new URL("../dist/esm/package.json", import.meta.url), JSON.stringify({ type: "module" }));

/** @param file {string} */
async function replaceVersion(file) {
    const contents = await readFile(file, "utf8");
    await writeFile(file, contents.replace("{{version}}", pkg.version));
}

await replaceVersion(new URL("../dist/cjs/Constants.js", import.meta.url));
await replaceVersion(new URL("../dist/esm/Constants.js", import.meta.url));

await cp(new URL("../lib/types", import.meta.url), new URL("../dist/cjs/types", import.meta.url), { recursive: true });
await cp(new URL("../lib/types", import.meta.url), new URL("../dist/esm/types", import.meta.url), { recursive: true });
