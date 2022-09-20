const { execSync } = require("child_process");
const { rmSync, readFileSync, writeFileSync, existsSync, cpSync } = require("fs");
const { resolve } = require("path");
const dir = resolve(`${__dirname}/../`);
if(existsSync(`${dir}/dist`)) rmSync(`${dir}/dist`, { recursive: true });
execSync("tsc -p tsconfig.json", { stdio: "inherit", cwd: dir });
writeFileSync(`${dir}/dist/lib/exports.js`, readFileSync(`${dir}/dist/lib/exports.js`).toString().replace(/__exportStar\(require\("\.\/types\/index"\), exports\);\r?\n/, ""))
cpSync(`${dir}/lib/types`, `${dir}/dist/lib/types`, { recursive: true });
