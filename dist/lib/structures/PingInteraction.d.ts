import Interaction from "./Interaction";
import type { InteractionTypes } from "../Constants";
import type { RawPingInteraction } from "../types/interactions";
import type Client from "../Client";
import type { JSONPingInteraction } from "../types/json";
/** Represents a PING interaction. This will not be recieved over a gateway connection. */
export default class PingInteraction extends Interaction {
    type: InteractionTypes.PING;
    constructor(data: RawPingInteraction, client: Client);
    /**
     * Responds to the interaction with a `PONG`.
     */
    pong(): Promise<void>;
    toJSON(): JSONPingInteraction;
}
