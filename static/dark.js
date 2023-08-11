// typedoc default to dark mode
const { JSX } = require("typedoc");

// https://github.com/TypeStrong/typedoc/issues/1840#issuecomment-1012736455
exports.load = function load(app) {
	app.renderer.hooks.on("head.begin", () => {
		return JSX.createElement("script", null,
		JSX.createElement(JSX.Raw, { html: "localStorage.setItem('tsd-theme', localStorage.getItem('tsd-theme') || 'dark')" }));
	});
}
