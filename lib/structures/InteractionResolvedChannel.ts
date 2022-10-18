/** @module InteractionResolvedChannel */
import type AnnouncementChannel from "./AnnouncementChannel";
import type TextChannel from "./TextChannel";
import Permission from "./Permission";
import Channel from "./Channel";
import type PrivateChannel from "./PrivateChannel";
import type ForumChannel from "./ForumChannel";
import type { ChannelTypes, GuildChannelTypes } from "../Constants";
import type Client from "../Client";
import type { RawInteractionResolvedChannel, ThreadMetadata, PrivateThreadMetadata, AnyGuildChannel } from "../types/channels";

/** Represents a channel from an interaction option. This can be any guild channel, or a direct message. */
export default class InteractionResolvedChannel extends Channel {
    private _cachedCompleteChannel?: AnyGuildChannel | PrivateChannel;
    private _cachedParent?: TextChannel | AnnouncementChannel | ForumChannel | null;
    /** The permissions the bot has in the channel. */
    appPermissions: Permission;
    /** The name of this channel. */
    name: string | null;
    /** The ID of the parent of this channel, if this represents a thread. */
    parentID: string | null;
    /** The [thread metadata](https://discord.com/developers/docs/resources/channel#thread-metadata-object-thread-metadata-structure) associated with this channel, if this represents a thread. */
    threadMetadata: ThreadMetadata | PrivateThreadMetadata | null;
    declare type: GuildChannelTypes | ChannelTypes.DM;
    constructor(data: RawInteractionResolvedChannel, client: Client) {
        super(data, client);
        this.appPermissions = new Permission(data.permissions);
        this.name = data.name;
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

    /** The complete channel this channel option represents, if it's cached. */
    get completeChannel(): AnyGuildChannel | PrivateChannel | undefined {
        if (!this._cachedCompleteChannel) {
            return (this._cachedCompleteChannel = this.client.getChannel(this.id));
        }

        return this._cachedCompleteChannel;
    }

    /** The parent of this channel, if this represents a thread. */
    get parent(): TextChannel | AnnouncementChannel | ForumChannel | null | undefined {
        if (this.parentID !== null && this._cachedParent !== null) {
            return this._cachedParent ?? (this._cachedParent = this.client.getChannel<TextChannel | AnnouncementChannel | ForumChannel>(this.parentID));
        }

        return this._cachedParent === null ? this._cachedParent : (this._cachedParent = null);
    }
}
