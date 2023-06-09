/** @module PrivateThreadChannel */
import ThreadChannel from "./ThreadChannel";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { GetThreadMembersOptions, PrivateThreadMetadata, RawPrivateThreadChannel, ThreadMember } from "../types/channels";
import type { JSONPrivateThreadChannel } from "../types/json";

/** Represents a private thread channel.. */
export default class PrivateThreadChannel extends ThreadChannel<PrivateThreadChannel> {
    declare threadMetadata: PrivateThreadMetadata;
    declare type: ChannelTypes.PRIVATE_THREAD;
    constructor(data: RawPrivateThreadChannel, client: Client) {
        super(data, client);
    }

    /**
     * Get the members of this thread.
     * @param options The options for getting the thread members.
     */
    async getThreadMembers(options?: GetThreadMembersOptions): Promise<Array<ThreadMember>> {
        return this.client.rest.channels.getThreadMembers(this.id, options);
    }

    override toJSON(): JSONPrivateThreadChannel {
        return {
            ...super.toJSON(),
            threadMetadata: this.threadMetadata,
            type:           this.type
        };
    }
}
