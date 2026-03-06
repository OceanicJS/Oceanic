/** @module PrivateThreadChannel */
import ThreadChannel from "./ThreadChannel";
import type * as Types from "../types/namespaced";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";

/** Represents a private thread channel.. */
export default class PrivateThreadChannel extends ThreadChannel<PrivateThreadChannel> {
    declare threadMetadata: Types.Channels.PrivateThreadMetadata;
    declare type: ChannelTypes.PRIVATE_THREAD;
    constructor(data: Types.Channels.RawPrivateThreadChannel, client: Client) {
        super(data, client);
    }

    /**
     * Get the members of this thread.
     * @param options The options for getting the thread members.
     */
    async getThreadMembers(options?: Types.Channels.GetThreadMembersOptions): Promise<Array<Types.Channels.ThreadMember>> {
        return this.client.rest.channels.getThreadMembers(this.id, options);
    }

    override toJSON(): Types.JSON.JSONPrivateThreadChannel {
        return {
            ...super.toJSON(),
            threadMetadata: this.threadMetadata,
            type:           this.type
        };
    }
}
