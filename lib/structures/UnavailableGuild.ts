/** @module UnavailableGuild */
import Base from "./Base";
import type Client from "../Client";
import type { RawUnavailableGuild } from "../types/guilds";
import type { JSONUnavailableGuild } from "../types/json";

/** Represents a guild that is unavailable. */
export default class UnavailableGuild extends Base {
    unavailable: true;
    constructor(data: RawUnavailableGuild, client: Client) {
        super(data.id, client);
        this.unavailable = data.unavailable;
    }

    override toJSON(): JSONUnavailableGuild {
        return {
            ...super.toJSON(),
            unavailable: this.unavailable
        };
    }
}
