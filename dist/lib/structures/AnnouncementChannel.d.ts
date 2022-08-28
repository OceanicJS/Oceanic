import TextableChannel from "./TextableChannel";
import type TextChannel from "./TextChannel";
import Message from "./Message";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { EditGuildChannelOptions, RawAnnouncementChannel } from "../types/channels";
import type { JSONAnnouncementChannel } from "../types/json";
/** Represents a guild news channel. */
export default class AnnouncementChannel extends TextableChannel<AnnouncementChannel> {
    /** The amount of seconds between non-moderators sending messages. Always zero in news channels. */
    rateLimitPerUser: 0;
    type: ChannelTypes.GUILD_ANNOUNCEMENT;
    constructor(data: RawAnnouncementChannel, client: Client);
    /**
     * Convert this news channel to a text channel.
     *
     * @returns {Promise<TextChannel>}
     */
    convert(): Promise<TextChannel>;
    /**
     * Crosspost a message in this channel.
     *
     * @param {String} messageID - The id of the message to crosspost.
     * @returns {Promise<Message<AnnouncementChannel>>}
     */
    crosspostMessage(messageID: string): Promise<Message<AnnouncementChannel>>;
    /**
     * Edit this channel.
     *
     * @param {Object} options
     * @param {?ThreadAutoArchiveDuration} [options.defaultAutoArchiveDuration] - The default auto archive duration for threads made in this channel.
     * @param {String} [options.name] - The name of the channel.
     * @param {?Boolean} [options.nsfw] - If the channel is age gated.
     * @param {?String} [options.parentID] - The id of the parent category channel.
     * @param {?RawOverwrite[]} [options.permissionOverwrites] - Channel or category specific permissions
     * @param {?Number} [options.position] - The position of the channel in the channel list.
     * @param {String} [options.reason] - The reason to be displayed in the audit log.
     * @param {?String} [options.topic] - The topic of the channel.
     * @param {ChannelTypes.GUILD_ANNOUNCEMENT} [options.type] - Provide the opposite type to convert the channel.
     * @returns {Promise<AnnouncementChannel>}
     */
    edit(options: EditGuildChannelOptions): Promise<this>;
    toJSON(): JSONAnnouncementChannel;
}
