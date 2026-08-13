/** @module TextableChannel */
import TextableChannel from "./TextableChannel";
import type PrivateThreadChannel from "./PrivateThreadChannel";
import type * as Types from "../types/namespaced";
import type { ChannelTypes, ThreadAutoArchiveDuration } from "../Constants";
import type Client from "../Client";
import Collection from "../util/Collection";

/** Represents a guild textable channel. */
export default class ThreadableChannel<TC extends Types.Channels.AnyTextableGuildChannel = Types.Channels.AnyTextableGuildChannel, TH extends Types.Channels.AnyThreadChannel = Types.Channels.AnyThreadChannel> extends TextableChannel<TC> {
    /** The default auto archive duration for threads created in this channel. */
    defaultAutoArchiveDuration: ThreadAutoArchiveDuration;
    /** The threads in this channel. */
    declare type: ChannelTypes.GUILD_TEXT | ChannelTypes.GUILD_ANNOUNCEMENT;
    constructor(data: Types.Channels.RawTextChannel | Types.Channels.RawAnnouncementChannel, client: Client) {
        super(data, client);
        this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
        this.update(data);
    }

    protected override update(data: Partial<Types.Channels.RawTextChannel | Types.Channels.RawAnnouncementChannel>): void {
        super.update(data);
        if (data.default_auto_archive_duration !== undefined) {
            this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
        }
    }

    /** The threads in this channel. The returned collection is disposable. */
    get threads(): Collection<string, TH> {
        return new Collection(this.guild.threads.filter(thread => thread.parentID === this.id).map(thread => [thread.id, thread as TH]));
    }

    /**
     * Get the public archived threads in this channel.
     * @param options The options for getting the public archived threads.
     */
    async getPublicArchivedThreads(options?: Types.Channels.GetArchivedThreadsOptions): Promise<Types.Channels.ArchivedThreads<Exclude<TH, PrivateThreadChannel>>> {
        return this.client.rest.channels.getPublicArchivedThreads<Exclude<TH, PrivateThreadChannel>>(this.id, options);
    }

    /**
     * Search threads in this channel.
     * @param options The options to search with.
     * @param retryOnIndexNotAvailable If the search should be retried if Discord replies with an index unavailable response. This will retry at most one time, waiting for `retry_after` or 15-45 seconds.
     */
    async searchThreads(options?: Types.Channels.SearchThreadsOptions, retryOnIndexNotAvailable = true): Promise<Types.Channels.ThreadSearchResults<TH>> {
        return this.client.rest.channels.searchThreads<TH>(this.id, options, retryOnIndexNotAvailable);
    }

    /**
     * Create a thread from an existing message in this channel.
     * @param messageID The ID of the message to create a thread from.
     * @param options The options for creating the thread.
     */
    async startThreadFromMessage(messageID: string, options: Types.Channels.StartThreadFromMessageOptions): Promise<TH> {
        return this.client.rest.channels.startThreadFromMessage<Exclude<TH, PrivateThreadChannel>>(this.id, messageID, options);
    }

    /**
     * Create a thread without an existing message in this channel.
     * @param options The options for creating the thread.
     */
    async startThreadWithoutMessage(options: Types.Channels.StartThreadWithoutMessageOptions): Promise<TH> {
        return this.client.rest.channels.startThreadWithoutMessage<TH>(this.id, options);
    }


    override toJSON(): Types.JSON.JSONThreadableChannel {
        return {
            ...super.toJSON(),
            defaultAutoArchiveDuration: this.defaultAutoArchiveDuration,
            threads:                    this.threads.map(thread => thread.id),
            type:                       this.type
        };
    }
}
