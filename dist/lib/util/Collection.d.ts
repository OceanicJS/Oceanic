import type Client from "../Client";
import Base from "../structures/Base";
import { Collection as PolarCollection } from "@augu/collections";
export declare type AnyClass<T, I, E extends Array<unknown>> = new (data: T, client: Client, ...extra: E) => I;
export default class Collection<K extends string | number, M extends Record<string, any>, C extends Base, E extends Array<unknown> = []> extends PolarCollection<K, C> {
    #private;
    constructor(baseObject: AnyClass<M, C, E>, client: Client);
    add<T extends C>(value: T): T;
    update(value: C | Partial<M> & {
        id?: K;
    }, ...extra: E): C;
}
