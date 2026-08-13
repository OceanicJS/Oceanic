/** @module InteractionResolvedChannel */
import type AnnouncementChannel from "./AnnouncementChannel";
import type TextChannel from "./TextChannel";
import Permission from "./Permission";
import Channel from "./Channel";
import type ForumChannel from "./ForumChannel";
import type Guild from "./Guild";
import type * as Types from "../types/namespaced";
import type Client from "../Client";
import { UncachedError } from "../util/Errors";

/** Represents a channel from an interaction option. This can be any guild channel, or a direct message. */
export default class InteractionResolvedChannel extends Channel {
    private _cachedCompleteChannel?: Types.Channels.AnyImplementedChannel;
    private _cachedGuild?: Guild;
    private _cachedParent?: TextChannel | AnnouncementChannel | ForumChannel | null;
    /** The permissions the bot has in the channel. */
    appPermissions: Permission;
    /** The id of the guild this channel is in. */
    guildID?: string;
    /** The ID of last message sent in this channel. */
    lastMessageID?: string | null;
    /** The timestamp of the last pinned message in this channel. */
    lastPinTimestamp?: string | null;
    /** The name of this channel. */
    name: string | null;
    /** If this channel is age gated. */
    nsfw?: boolean;
    /** The ID of the parent of this channel, if this represents a thread. */
    parentID: string | null;
    /** The permissions the user has in the channel. */
    permissions: Permission;
    /** The position of this channel on the sidebar. */
    position?: number;
    /** The amount of seconds between non-moderators sending messages. */
    rateLimitPerUser?: number;
    /** The [thread metadata](https://discord.com/developers/docs/resources/channel#thread-metadata-object-thread-metadata-structure) associated with this channel, if this represents a thread. */
    threadMetadata: Types.Channels.ThreadMetadata | Types.Channels.PrivateThreadMetadata | null;
    /** The topic of the channel. */
    topic?: string | null;
    declare type: Types.Channels.ImplementedChannels;
    constructor(data: Types.Channels.RawInteractionResolvedChannel, client: Client) {
        super(data, client);
        this.appPermissions = new Permission(data.app_permissions ?? "0");
        this.guildID = data.guild_id;
        this.lastMessageID = data.last_message_id;
        this.lastPinTimestamp = data.last_pin_timestamp;
        this.name = data.name;
        this.nsfw = data.nsfw;
        this.parentID = data.parent_id ?? null;
        this.permissions = new Permission(data.permissions ?? "0");
        this.position = data.position;
        this.rateLimitPerUser = data.rate_limit_per_user;
        this.threadMetadata = data.thread_metadata ? {
            archiveTimestamp:    new Date(data.thread_metadata.archive_timestamp),
            archived:            !!data.thread_metadata.archived,
            autoArchiveDuration: data.thread_metadata.auto_archive_duration,
            createTimestamp:     data.thread_metadata.create_timestamp ? new Date(data.thread_metadata.create_timestamp) : null,
            locked:              !!data.thread_metadata.locked,
            invitable:           data.thread_metadata.invitable
        } :  null;
        this.topic = data.topic;
    }

    /** The complete channel this channel option represents, if it's cached. */
    get completeChannel(): Types.Channels.AnyImplementedChannel | undefined {
        return this._cachedCompleteChannel ??= this.client.getChannel(this.id);
    }

    /** The guild associated with this channel. This will throw an error if the guild is not cached. */
    get guild(): Guild | null {
        if (!this.guildID) return null;
        this._cachedGuild ??= this.client.guilds.get(this.guildID);
        if (!this._cachedGuild) {
            if (this.client.options.restMode) {
                throw new UncachedError(`${this.constructor.name}#guild is not present when rest mode is enabled.`);
            }

            if (!this.client.shards.connected) {
                throw new UncachedError(`${this.constructor.name}#guild is not present without a gateway connection.`);
            }

            throw new UncachedError(`${this.constructor.name}#guild is not present.`);
        }

        return this._cachedGuild;
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
            name:           this.name,
            parentID:       this.parentID,
            permissions:    this.permissions.toJSON(),
            threadMetadata: this.threadMetadata,
            type:           this.type
        };
    }
}
