/** @module InteractionOptionChannel */
import type AnnouncementChannel from "./AnnouncementChannel";
import type TextChannel from "./TextChannel";
import Permission from "./Permission";
import Channel from "./Channel";
import type ForumChannel from "./ForumChannel";
import { GuildChannelTypes } from "../Constants";
import type Client from "../Client";
import type { PartialInteractionOptionsChannel, ThreadMetadata, PrivateThreadMetadata, AnyGuildTextChannel } from "../types/channels";

/** Represents a channel from an interaction option. */
export default class InteractionOptionChannel extends Channel {
    /** The permissions the bot has in the channel. */
    appPermissions: Permission;
    /** The complete channel this channel option represents, if it's cached. */
    completeChannel?: AnyGuildTextChannel;
    /** The name of this channel. */
    name: string;
    /** The parent of this channel, if this represents a thread. */
    parent?: TextChannel | AnnouncementChannel | ForumChannel | null;
    /** The ID of the parent of this channel, if this represents a thread. */
    parentID: string | null;
    /** The [thread metadata](https://discord.com/developers/docs/resources/channel#thread-metadata-object-thread-metadata-structure) associated with this channel, if this represents a thread. */
    threadMetadata: ThreadMetadata | PrivateThreadMetadata | null;
    declare type: GuildChannelTypes;
    constructor(data: PartialInteractionOptionsChannel, client: Client) {
        super(data, client);
        this.appPermissions = new Permission(data.permissions);
        this.name = data.name;
        this.completeChannel = client.getChannel<AnyGuildTextChannel>(data.id);
        this.parent = data.parent_id ? client.getChannel<TextChannel | AnnouncementChannel>(data.parent_id) : null;
        this.parentID = data.parent_id ?? null;
        this.threadMetadata = data.thread_metadata ? {
            archiveTimestamp:    new Date(data.thread_metadata.archive_timestamp),
            archived:            !!data.thread_metadata.archived,
            autoArchiveDuration: data.thread_metadata.auto_archive_duration,
            createTimestamp:     !data.thread_metadata.create_timestamp ? null : new Date(data.thread_metadata.create_timestamp),
            locked:              !!data.thread_metadata.locked,
            invitable:           data.thread_metadata.invitable
        } :  null;
    }
}
