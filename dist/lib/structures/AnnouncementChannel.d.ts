import TextableChannel from "./TextableChannel";
import type TextChannel from "./TextChannel";
import type CategoryChannel from "./CategoryChannel";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { EditGuildChannelOptions, RawAnnouncementChannel } from "../types/channels";
import type { JSONAnnouncementChannel } from "../types/json";
/** Represents a guild news channel. */
export default class AnnouncementChannel extends TextableChannel<AnnouncementChannel> {
    /** The amount of seconds between non-moderators sending messages. Always zero in news channels. */
    parent: CategoryChannel | null;
    rateLimitPerUser: 0;
    type: ChannelTypes.GUILD_ANNOUNCEMENT;
    constructor(data: RawAnnouncementChannel, client: Client);
    /**
     * Convert this news channel to a text channel.
     */
    convert(): Promise<TextChannel>;
    /**
     * Crosspost a message in this channel.
     * @param messageID The ID of the message to crosspost.
     */
    crosspostMessage(messageID: string): Promise<import("./Message").default<AnnouncementChannel>>;
    /**
     * Edit this channel.
     * @param options The options for editing the channel.
     */
    edit(options: EditGuildChannelOptions): Promise<this>;
    toJSON(): JSONAnnouncementChannel;
}
