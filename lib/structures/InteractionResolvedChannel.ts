/** @module InteractionResolvedChannel */
import type AnnouncementChannel from "./AnnouncementChannel";
import type TextChannel from "./TextChannel";
import Permission from "./Permission";
import Channel from "./Channel";
import type ForumChannel from "./ForumChannel";
import type * as Types from "../types/namespaced";
import type Client from "../Client";

/** Represents a channel from an interaction option. This can be any guild channel, or a direct message. */
export default class InteractionResolvedChannel extends Channel {
    private _cachedCompleteChannel?: Types.Channels.AnyImplementedChannel;
    private _cachedParent?: TextChannel | AnnouncementChannel | ForumChannel | null;
    /** The permissions the bot has in the channel. */
    appPermissions: Permission;
    /** The name of this channel. */
    name: string | null;
    /** The ID of the parent of this channel, if this represents a thread. */
    parentID: string | null;
    /** The permissions the user has in the channel. */
    permissions: Permission;
    /** The [thread metadata](https://discord.com/developers/docs/resources/channel#thread-metadata-object-thread-metadata-structure) associated with this channel, if this represents a thread. */
    threadMetadata: Types.Channels.ThreadMetadata | Types.Channels.PrivateThreadMetadata | null;
    declare type: Types.Channels.ImplementedChannels;
    constructor(data: Types.Channels.RawInteractionResolvedChannel, client: Client) {
        super(data, client);
        this.appPermissions = new Permission(data.app_permissions ?? "0");
        this.name = data.name;
        this.parentID = data.parent_id ?? null;
        this.permissions = new Permission(data.permissions ?? "0");
        this.threadMetadata = data.thread_metadata ? {
            archiveTimestamp:    new Date(data.thread_metadata.archive_timestamp),
            archived:            !!data.thread_metadata.archived,
            autoArchiveDuration: data.thread_metadata.auto_archive_duration,
            createTimestamp:     data.thread_metadata.create_timestamp ? new Date(data.thread_metadata.create_timestamp) : null,
            locked:              !!data.thread_metadata.locked,
            invitable:           data.thread_metadata.invitable
        } :  null;
    }

    /** The complete channel this channel option represents, if it's cached. */
    get completeChannel(): Types.Channels.AnyImplementedChannel | undefined {
        return this._cachedCompleteChannel ??= this.client.getChannel(this.id);
    }

    /** The parent of this channel, if this represents a thread. */
    get parent(): TextChannel | AnnouncementChannel | ForumChannel | null | undefined {
        if (this.parentID !== null && this._cachedParent !== null) {
            return this._cachedParent ?? (this._cachedParent = this.client.getChannel<TextChannel | AnnouncementChannel | ForumChannel>(this.parentID));
        }

        return this._cachedParent === null ? this._cachedParent : (this._cachedParent = null);
    }

    override toJSON(): Types.JSON.JSONInteractionResolvedChannel {
        return {
            ...super.toJSON(),
            appPermissions: this.appPermissions.toJSON(),
            name: this.name,
            parentID: this.parentID,
            permissions: this.permissions.toJSON(),
            threadMetadata: this.threadMetadata,
            type: this.type,
        }
    }
}
