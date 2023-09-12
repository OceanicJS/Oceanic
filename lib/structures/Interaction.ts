/** @module Interaction */
import Base from "./Base.js";
import type ClientApplication from "./ClientApplication.js";
import type Client from "../Client.js";
import type { AnyRawInteraction } from "../types/interactions.js";
import type { InteractionTypes } from "../Constants.js";
import type { JSONInteraction } from "../types/json.js";

/** Represents an interaction. */
export default class Interaction extends Base {
    /** If this interaction has been acknowledged. */
    acknowledged: boolean;
    /** The application this interaction is for. */
    application?: ClientApplication;
    /** The ID of the application this interaction is for. */
    applicationID: string;
    /** The token of this interaction. */
    token: string;
    /** The [type](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type) of this interaction. */
    type: InteractionTypes;
    /** Read-only property, always `1` */
    version: 1;
    constructor(data: AnyRawInteraction, client: Client) {
        super(data.id, client);
        this.acknowledged = false;
        this.application = client["_application"] && client.application.id === data.application_id ? client.application : undefined;
        this.applicationID = data.application_id;
        this.token = data.token;
        this.type = data.type;
        this.version = data.version;
    }

    override toJSON(): JSONInteraction {
        return {
            ...super.toJSON(),
            applicationID: this.applicationID,
            token:         this.token,
            type:          this.type,
            version:       this.version
        };
    }
}
