/** @module ForumChannel */
import ThreadOnlyChannel from "./ThreadOnlyChannel";

import type Client from "../Client";
import type { ChannelTypes } from "../Constants";
import type * as Types from "../types/namespaced";

/** Represents a thread forum channel. */
export default class ForumChannel extends ThreadOnlyChannel {
    declare type: ChannelTypes.GUILD_FORUM;
    constructor(data: Types.Channels.RawForumChannel, client: Client) {
        super(data, client);
    }

    override toJSON(): Types.JSON.JSONForumChannel {
        return {
            ...super.toJSON(),
            type: this.type,
        };
    }
}
