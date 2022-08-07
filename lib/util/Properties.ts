export default class Properties {
	private obj: unknown;
	constructor(obj: unknown) {
		this.obj = obj;
	}

	static define(obj: unknown, property: string, value: unknown, writable = false, configurable = false, enumerable = false) {
		return new Properties(obj).define(property, value, writable, configurable, enumerable);
	}

	static new(obj: unknown) {
		return new Properties(obj);
	}

	define(property: string, value: unknown, writable = false, configurable = false, enumerable = false) {
		Object.defineProperty(this.obj, property, { value, writable, configurable, enumerable });
		return this;
	}
}
