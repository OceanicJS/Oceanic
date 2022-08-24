import type { RESTMethod } from "../Constants";
import Base from "../structures/Base";
import type { Response } from "undici";

export default class DiscordHTTPError extends Error {
	method: RESTMethod;
	name = "DiscordHTTPError";
	resBody: unknown | null;
	response: Response;
	constructor(res: Response, resBody: unknown | null, method: string, stack?: string) {
		super();

		Object.defineProperties(this, {
			response: { value: res, enumerable: false },
			resBody:  { value: resBody, enumerable: false },
			method:   { value: method, enumerable: false }
		});

		let message = `${res.status} ${res.statusText} on ${this.method} ${this.path}`;
		const errors = DiscordHTTPError.flattenErrors(resBody as Record<string, unknown>);
		if (errors.length > 0) message += `\n  ${errors.join("\n  ")}`;
		Object.defineProperty(this, "message", {
			enumerable: false,
			value:      message
		});
		if (stack) this.stack = this.name + ": " + this.message + "\n" + stack;
		else Error.captureStackTrace(this, DiscordHTTPError);
	}

	static flattenErrors(errors: Record<string, unknown>, keyPrefix = "") {
		let messages: Array<string> = [];
		for (const fieldName in errors) {
			if (!Object.hasOwn(errors, fieldName) || fieldName === "message" || fieldName === "code") continue;
			if (Array.isArray(errors[fieldName])) messages = messages.concat((errors[fieldName] as Array<string>).map((str) => `${`${keyPrefix}${fieldName}`}: ${str}`));
		}
		return messages;
	}

	get headers() { return this.response.headers; }
	get path() { return new URL(this.response.url).pathname; }
	get status() { return this.response.status; }
	get statusText() { return this.response.statusText; }

	toJSON(props: Array<string> = []) {
		return Base.prototype.toJSON.call(this, [
			"message",
			"method",
			"name",
			"stack",
			"resBody",
			...props
		]);
	}
}
