import Interaction from "./Interaction";
import type { InteractionTypes } from "../Constants";
import { InteractionResponseTypes } from "../Constants";
import type { RawPingInteraction } from "../types/interactions";
import type Client from "../Client";

/** Represents a PING interaction. This will not be recieved over a gateway connection. */
export default class PingInteraction extends Interaction {
	declare type: InteractionTypes.PING;
	/** @hideconstructor */
	constructor(data: RawPingInteraction, client: Client) {
		super(data, client);
	}

	/**
	 * Responds to the interaction with a `PONG`.
	 *
	 * @returns {Promise<void>}
	 */
	async pong() {
		return this._client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.PONG });
	}
}
