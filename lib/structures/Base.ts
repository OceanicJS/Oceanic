import type Client from "../Client";
import Properties from "../util/Properties";
import { inspect } from "util";

/** A base class which most other classes extend. */
export default abstract class Base {
	protected _client: Client;
	id: string;
	/** @hideconstructor */
	constructor(id: string, client: Client) {
		this.id = id;
		Properties.looseDefine(this, "_client", client);
	}

	static getCreatedAt(id: string) {
		return new Date(Base.getDiscordEpoch(id) + 1420070400000);
	}

	static getDiscordEpoch(id: string) {
		return Number(BigInt(id) / 4194304n);
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
	protected update(data: unknown) {}

	get createdAt() {
		return Base.getCreatedAt(this.id);
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

	toJSON(props: Array<string> = []) {
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
		return json;
	}

	toString() {
		return `[${this.constructor.name} ${this.id}]`;
	}
}
