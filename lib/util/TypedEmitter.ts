/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
import EventEmitter from "events";

declare interface TypedEmitter<Events extends Record<string | symbol, any>> extends EventEmitter {
	addListener<K extends keyof Events>(event: K, listener: Events[K]): this;
	emit<K extends keyof Events>(eventName: K, ...args: Events[K]): boolean;
	listenerCount(eventName: keyof Events): number;
	listeners(eventName: keyof Events): Array<Function>;
	off<K extends keyof Events>(event: K, listener: Events[K]): this;
	on<K extends keyof Events>(event: K, listener: Events[K]): this;
	once<K extends keyof Events>(event: K, listener: Events[K]): this;
	prependListener<K extends keyof Events>(event: K, listener: Events[K]): this;
	prependOnceListener<K extends keyof Events>(event: K, listener: Events[K]): this;
	rawListeners(eventName: keyof Events): Array<Function>;
	removeAllListeners(event?: keyof Events): this;
	removeListener<K extends keyof Events>(event: K, listener: Events[K]): this;
	/* eventNames is excluded */
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TypedEmitter<Events extends Record<string | symbol, any>> extends EventEmitter {}

export default TypedEmitter;
