export default class Properties<C = unknown> {
	private obj: unknown;
	constructor(obj: unknown) {
		this.obj = obj;
	}

	static define<T, K extends keyof T>(obj: T, property: K, value: T[K], writable = false, configurable = false, enumerable = false) {
		return new Properties<T>(obj).define(property, value, writable, configurable, enumerable);
	}

	static looseDefine<T>(obj: T, property: string, value: unknown, writable = false, configurable = false, enumerable = false) {
		return new Properties<T>(obj).looseDefine(property, value, writable, configurable, enumerable);
	}

	static new<T>(obj: T) {
		return new Properties<T>(obj);
	}

	define<K extends keyof C>(property: K, value: C[K], writable = false, configurable = false, enumerable = false) {
		Object.defineProperty(this.obj, property, { value, writable, configurable, enumerable });
		return this;
	}

	looseDefine(property: string, value: unknown, writable = false, configurable = false, enumerable = false) {
		Object.defineProperty(this.obj, property, { value, writable, configurable, enumerable });
		return this;
	}
}
