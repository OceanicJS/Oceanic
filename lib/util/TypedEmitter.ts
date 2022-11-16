/** @module TypedEmitter */
/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */
import UncaughtError from "./UncaughtError";
import EventEmitter from "node:events";

declare interface TypedEmitter<Events extends Record<string | symbol, any>> extends EventEmitter {
    addListener<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
    emit<K extends keyof Events>(eventName: K, ...args: Events[K]): boolean;
    listenerCount(eventName: keyof Events): number;
    listeners(eventName: keyof Events): Array<Function>;
    off<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
    on<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
    once<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
    prependListener<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
    prependOnceListener<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
    rawListeners(eventName: keyof Events): Array<Function>;
    removeAllListeners(event?: keyof Events): this;
    removeListener<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
    /* eventNames is excluded */
}

class TypedEmitter<Events extends Record<string | symbol, any>> extends EventEmitter {
    override emit<K extends keyof Events>(eventName: K, ...args: Events[K]): boolean {
        if (this.listenerCount(eventName) === 0) {
            if (eventName === "error") {
                throw new UncaughtError(args[0]);
            }
            return false;
        }
        return super.emit(eventName as string, ...args as Array<any>);
    }
}

export default TypedEmitter;
