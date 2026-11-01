/** @module PingInteraction */
import { InteractionResponseTypes, type InteractionTypes } from "../Constants";

import Interaction from "./Interaction";

import type Client from "../Client";
import type * as Types from "../types/namespaced";

/** Represents a PING interaction. This will not be received over a gateway connection. */
export default class PingInteraction extends Interaction {
    declare type: InteractionTypes.PING;
    constructor(data: Types.Interactions.RawPingInteraction, client: Client) {
        super(data, client);
    }

    /**
     * Responds to the interaction with a `PONG`.
     */
    async pong(): Promise<Types.Interactions.InteractionCallbackResponse> {
        return this.client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.PONG }, true);
    }

    override toJSON(): Types.JSON.JSONPingInteraction {
        return {
            ...super.toJSON(),
            type: this.type,
        };
    }
}
