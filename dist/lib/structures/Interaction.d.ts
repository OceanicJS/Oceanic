import Base from "./Base";
import type ClientApplication from "./ClientApplication";
import type Client from "../Client";
import type { AnyInteraction, AnyRawInteraction, RawInteraction } from "../types/interactions";
import { InteractionTypes } from "../Constants";
import type { Uncached } from "../types/shared";
import type { JSONInteraction } from "../types/json";
export default class Interaction extends Base {
    protected acknowledged: boolean;
    /** The application this interaction is for. This can be a partial object with only an `id` property. */
    application: ClientApplication | Uncached;
    /** The token of this interaction. */
    token: string;
    /** The [type](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type) of this interaction. */
    type: InteractionTypes;
    /** Read-only property, always `1` */
    version: 1;
    constructor(data: AnyRawInteraction, client: Client);
    static from<T extends AnyInteraction = AnyInteraction>(data: RawInteraction, client: Client): T;
    toJSON(): JSONInteraction;
}
