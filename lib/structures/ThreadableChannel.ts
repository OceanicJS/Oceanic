/** @module TextableChannel */
import TextableChannel from "./TextableChannel.js";
import type PrivateThreadChannel from "./PrivateThreadChannel.js";
import type { ChannelTypes, ThreadAutoArchiveDuration } from "../Constants.js";
import type Client from "../Client.js";
import type { RawAnnouncementChannel, RawTextChannel } from "../types/channels.js";
import type {
    AnyTextableGuildChannel,
    AnyThreadChannel,
    ArchivedThreads,
    GetArchivedThreadsOptions,
    JSONThreadableChannel,
    StartThreadFromMessageOptions,
    StartThreadWithoutMessageOptions
} from "../types/index.js";
import Collection from "../util/Collection.js";

/** Represents a guild textable channel. */
export default class ThreadableChannel<TC extends AnyTextableGuildChannel = AnyTextableGuildChannel, TH extends AnyThreadChannel = AnyThreadChannel> extends TextableChannel<TC> {
    /** The default auto archive duration for threads created in this channel. */
    defaultAutoArchiveDuration: ThreadAutoArchiveDuration;
    /** The threads in this channel. */
    declare type: ChannelTypes.GUILD_TEXT | ChannelTypes.GUILD_ANNOUNCEMENT;
    constructor(data: RawTextChannel | RawAnnouncementChannel, client: Client) {
        super(data, client);
        this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
        this.update(data);
    }

    protected override update(data: Partial<RawTextChannel | RawAnnouncementChannel>): void {
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
