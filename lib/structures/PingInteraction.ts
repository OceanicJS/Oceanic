/** @module PingInteraction */
import Interaction from "./Interaction.js";
import { InteractionResponseTypes, type InteractionTypes } from "../Constants.js";
import type { RawPingInteraction } from "../types/interactions.js";
import type Client from "../Client.js";
import type { JSONPingInteraction } from "../types/json.js";

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
