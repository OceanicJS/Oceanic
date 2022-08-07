import Properties from "../../util/Properties";
import type RESTClient from "../../RESTClient";
import { inspect } from "util";

export default abstract class RESTBase {
	protected _client: RESTClient;
	id: string;
	constructor(id: string, client: RESTClient) {
		this.id = id;
		Properties.define(this, "_client", client);
	}

	static getCreatedAt(id: string) {
		return RESTBase.getDiscordEpoch(id) + 1420070400000;
	}

	static getDiscordEpoch(id: string) {
		return Number(BigInt(id) / 4194304n);
	}

	get createdAt() {
		return RESTBase.getCreatedAt(this.id);
	}

	[inspect.custom]() {
		// http://stackoverflow.com/questions/5905492/dynamic-function-name-in-javascript
		const copy = new { [this.constructor.name]: class {} }[this.constructor.name]() as this;
		for (const key in this) {
			if (Object.hasOwn(this, key) && !key.startsWith("_") && this[key] !== undefined) {
				copy[key] = this[key];
			}
		}
		return copy;
	}

	toJSON<T extends Record<string, unknown> = Record<string, unknown>>(props: Array<string> = []) {
		const json: Record<string, unknown> = {};
		if (this.id) {
			json.id = this.id;
			json.createdAt = this.createdAt;
		}
		for (const prop of props) {
			const value = this[prop as never];
			const type = typeof value;
			if (value === undefined) continue;
			else if (type !== "object" && type !== "function" && type !== "bigint" || value === null) json[prop] = value;
			else if ((value as { toJSON(): unknown; }).toJSON !== undefined) json[prop] = (value as { toJSON(): unknown; }).toJSON();
			else if ((value as Array<unknown>).values !== undefined) json[prop] = [...(value as Array<unknown>).values()];
			else if (type === "bigint") json[prop] = (value as bigint).toString();
			else if (type === "object") json[prop] = value;

		}
		return json as T;
	}

	toString() {
		return `[${this.constructor.name} ${this.id}]`;
	}
}
