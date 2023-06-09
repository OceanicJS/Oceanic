/** @module TextableChannel */
import TextableChannel from "./TextableChannel";
import type PrivateThreadChannel from "./PrivateThreadChannel";
import type AnnouncementThreadChannel from "./AnnouncementThreadChannel";
import type PublicThreadChannel from "./PublicThreadChannel";
import type ThreadChannel from "./ThreadChannel";
import type { ChannelTypes, RawChannelTypeMap, ThreadAutoArchiveDuration } from "../Constants";
import type Client from "../Client";
import TypedCollection from "../util/TypedCollection";
import type { RawAnnouncementChannel, RawTextChannel } from "../types/channels";
import type {
    AnyTextableGuildChannel,
    AnyThreadChannel,
    ArchivedThreads,
    GetArchivedThreadsOptions,
    JSONThreadableChannel,
    StartThreadFromMessageOptions,
    StartThreadWithoutMessageOptions
} from "../types";

/** Represents a guild textable channel. */
export default class ThreadableChannel<TC extends AnyTextableGuildChannel = AnyTextableGuildChannel, TH extends AnyThreadChannel = AnyThreadChannel> extends TextableChannel<TC> {
    /** The default auto archive duration for threads created in this channel. */
    defaultAutoArchiveDuration: ThreadAutoArchiveDuration;
    /** The threads in this channel. */
    threads: TypedCollection<string, RawChannelTypeMap[TH["type"]], TH>;
    declare type: ChannelTypes.GUILD_TEXT | ChannelTypes.GUILD_ANNOUNCEMENT;
    constructor(data: RawTextChannel | RawAnnouncementChannel, client: Client, threadChannel: typeof AnnouncementThreadChannel | typeof PublicThreadChannel | typeof PrivateThreadChannel | typeof ThreadChannel) {
        super(data, client);
        this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
        this.threads = new TypedCollection(threadChannel as never, client, this.client.util._getLimit("channelThreads", this.id)) as ThreadableChannel<TC, TH>["threads"];
        this.update(data);
    }

    protected override update(data: Partial<RawTextChannel | RawAnnouncementChannel>): void {
        super.update(data);
        if (data.default_auto_archive_duration !== undefined) {
            this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
        }
    }

    /**
     * Get the public archived threads in this channel.
     * @param options The options for getting the public archived threads.
     */
    async getPublicArchivedThreads(options?: GetArchivedThreadsOptions): Promise<ArchivedThreads<Exclude<TH, PrivateThreadChannel>>> {
        return this.client.rest.channels.getPublicArchivedThreads<Exclude<TH, PrivateThreadChannel>>(this.id, options);
    }

    /**
     * Create a thread from an existing message in this channel.
     * @param messageID The ID of the message to create a thread from.
     * @param options The options for creating the thread.
     */
    async startThreadFromMessage(messageID: string, options: StartThreadFromMessageOptions): Promise<TH> {
        return this.client.rest.channels.startThreadFromMessage<Exclude<TH, PrivateThreadChannel>>(this.id, messageID, options);
    }

    /**
     * Create a thread without an existing message in this channel.
     * @param options The options for creating the thread.
     */
    async startThreadWithoutMessage(options: StartThreadWithoutMessageOptions): Promise<TH> {
        return this.client.rest.channels.startThreadWithoutMessage<TH>(this.id, options);
    }


    override toJSON(): JSONThreadableChannel {
        return {
            ...super.toJSON(),
            defaultAutoArchiveDuration: this.defaultAutoArchiveDuration,
            threads:                    this.threads.map(thread => thread.id),
            type:                       this.type
        };
    }
}
