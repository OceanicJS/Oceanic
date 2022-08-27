import type Client from "../Client";
import Properties from "../util/Properties";
import type { JSONBase } from "../types/json";
import { inspect } from "util";

/** A base class which most other classes extend. */
export default abstract class Base {
	protected _client: Client;
	id: string;
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

	toJSON(): JSONBase{
		return {
			createdAt: this.createdAt.getTime(),
			id:        this.id
		};
	}

	toString() {
		return `[${this.constructor.name} ${this.id}]`;
	}
}
