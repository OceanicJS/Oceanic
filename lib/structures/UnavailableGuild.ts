/** @module UnavailableGuild */
import Base from "./Base";

import type Client from "../Client";
import type * as Types from "../types/namespaced";

/** Represents a guild that is unavailable. */
export default class UnavailableGuild extends Base {
    unavailable: true;
    constructor(data: Types.Guilds.RawUnavailableGuild, client: Client) {
        super(data.id, client);
        this.unavailable = data.unavailable;
    }

    override toJSON(): Types.JSON.JSONUnavailableGuild {
        return {
            ...super.toJSON(),
            unavailable: this.unavailable,
        };
    }
}
