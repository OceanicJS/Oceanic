/** @module ForumChannel */
import ThreadOnlyChannel from "./ThreadOnlyChannel.js";
import type Client from "../Client.js";
import type { ChannelTypes } from "../Constants.js";
import type { JSONForumChannel, RawForumChannel } from "../types/index.js";

/** Represents a thread forum channel. */
export default class ForumChannel extends ThreadOnlyChannel {
    declare type: ChannelTypes.GUILD_FORUM;
    constructor(data: RawForumChannel, client: Client) {
        super(data, client);
    }

    override toJSON(): JSONForumChannel {
        return {
            ...super.toJSON(),
            type: this.type
        };
    }
}
