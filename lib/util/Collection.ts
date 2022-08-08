import Properties from "./Properties";
import type Client from "../Client";
import Base from "../structures/Base";
import { Collection as PolarCollection } from "@augu/collections";

export type AnyClass<T, I, E extends Array<unknown>> = new(data: T, client: Client, ...extra: E) => I;
export default class Collection<K extends string | number, M extends { id: K; }, C extends Base, E extends Array<unknown> = []> extends PolarCollection<K, C> {
	protected _baseObject: AnyClass<M, C, E>;
	protected _client: Client;
	constructor(baseObject: AnyClass<M, C, E>, client: Client) {
		super();
		if (!(baseObject.prototype instanceof Base)) throw new Error("baseObject must be a class that extends Base");
		Properties.new(this)
			.define("_baseObject", baseObject)
			.define("_client", client);
	}

	add(value: C) {
		if ("id" in value) {
			this.set(value.id as K, value);
			return value;
		} else {
			const err = new Error("Collection.add: value must have an id property");
			Object.defineProperty(err, "_object", { value });
			throw err;
		}
	}

	update(value: M, ...extra: E) {
		const item = this.get(value.id);
		if (!item) this.add(new this._baseObject(this._client, value, ...extra));
		else item["update"](value);
		return this.get(value.id)!;
	}
}
