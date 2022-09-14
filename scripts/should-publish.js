const { execSync } = require("child_process");
const d = Date.now();
const date = new Date(execSync("npm view oceanic.js time.modified --json").toString().slice(1,-2));
if((d - date.getTime()) > 3.6e+6) {
	// more than an hour, publish
	console.log("A publish has not happened within the last hour, a publish can happen.");
	process.exit(0);
} else {
	// less than an hour, no publish
	console.log("A publish has happened within the last hour, a publish should not happen.");
	process.exit(1);
}
