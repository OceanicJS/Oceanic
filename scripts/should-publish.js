const { execSync } = require("child_process");
const d = Date.now();
const date = new Date(execSync("npm view oceanic.js time.modified --json").toString().slice(1,-2));
const latestDev = execSync("npm view oceanic.js dist-tags.dev --json").toString().slice(1,-2).split(".").slice(-1)[0];
const latestLocal = execSync("git rev-parse --short HEAD").toString().slice(0, -1);
console.log("Latest Published:", latestDev);
console.log("Latest Local:", latestLocal);
if(latestDev === latestLocal) {
	console.log("Latest published matches local, a publish should not happen.")
	process.exit(1);
}
if((d - date.getTime()) > 3600000) {
	// more than an hour, publish
	console.log("A publish has not happened within the last hour, a publish can happen.");
	process.exit(0);
} else {
	// less than an hour, no publish
	console.log("A publish has happened within the last hour, a publish should not happen.");
	process.exit(1);
}
