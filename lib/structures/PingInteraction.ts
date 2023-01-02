/** @module PingInteraction */
import Interaction from "./Interaction";
import { InteractionResponseTypes, type InteractionTypes } from "../Constants";
import type { RawPingInteraction } from "../types/interactions";
import type Client from "../Client";
import type { JSONPingInteraction } from "../types/json";

/** Represents a PING interaction. This will not be received over a gateway connection. */
export default class PingInteraction extends Interaction {
    declare type: InteractionTypes.PING;
    constructor(data: RawPingInteraction, client: Client) {
        super(data, client);
    }

    /**
     * Responds to the interaction with a `PONG`.
     */
    async pong(): Promise<void> {
        return this.client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.PONG });
    }

    override toJSON(): JSONPingInteraction {
        return {
            ...super.toJSON(),
            type: this.type
        };
    }
}
