const { execSync } = require("child_process");
const { rmSync, readFileSync, writeFileSync, existsSync, cpSync } = require("fs");
if(existsSync(`${__dirname}/dist`)) rmSync(`${__dirname}/dist`, { recursive: true });
execSync("tsc", { stdio: "inherit" });
writeFileSync(`${__dirname}/dist/lib/index.js`, readFileSync(`${__dirname}/dist/lib/index.js`).toString().replace(/__exportStar\(require\("\.\/types\/index"\), exports\);\r?\n/, ""))
cpSync(`${__dirname}/lib/types`, `${__dirname}/dist/lib/types`, { recursive: true });
