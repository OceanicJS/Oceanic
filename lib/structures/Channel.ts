/** @module Channel */
import Base from "./Base";
import type * as Types from "../types/namespaced";
import { ChannelTypes } from "../Constants";
import type Client from "../Client";

let TextChannel: typeof import("./TextChannel").default,
    PrivateChannel: typeof import("./PrivateChannel").default,
    VoiceChannel: typeof import("./VoiceChannel").default,
    GroupChannel: typeof import("./GroupChannel").default,
    CategoryChannel: typeof import("./CategoryChannel").default,
    AnnouncementChannel: typeof import("./AnnouncementChannel").default,
    AnnouncementThreadChannel: typeof import("./AnnouncementThreadChannel").default,
    PublicThreadChannel: typeof import("./PublicThreadChannel").default,
    PrivateThreadChannel: typeof import("./PrivateThreadChannel").default,
    StageChannel: typeof import("./StageChannel").default,
    ForumChannel: typeof import("./ForumChannel").default,
    MediaChannel: typeof import("./MediaChannel").default;

/** Represents a channel. */
export default class Channel extends Base {
    /** The [type](https://discord.com/developers/docs/resources/channel#channel-object-channel-types) of this channel. */
    type: ChannelTypes;
    constructor(data: Types.Channels.RawChannel, client: Client) {
        super(data.id, client);
        this.type = data.type;
    }

    static async from<T extends Types.Channels.AnyChannel = Types.Channels.AnyChannel>(data: Types.Channels.RawChannel, client: Client): Promise<T> {
        switch (data.type) {
            case ChannelTypes.GUILD_TEXT: {
                TextChannel ??= await import("./TextChannel").then(m => m.default);
                return new TextChannel(data as Types.Channels.RawTextChannel, client) as T;
            }

            case ChannelTypes.DM: {
                PrivateChannel ??= await import("./PrivateChannel").then(m => m.default);
                return new PrivateChannel(data as Types.Channels.RawPrivateChannel, client) as T;
            }

            case ChannelTypes.GUILD_VOICE: {
                VoiceChannel ??= await import("./VoiceChannel").then(m => m.default);
                return new VoiceChannel(data as Types.Channels.RawVoiceChannel, client) as T;
            }

            case ChannelTypes.GROUP_DM: {
                GroupChannel ??= await import("./GroupChannel").then(m => m.default);
                return new GroupChannel(data as Types.Channels.RawGroupChannel, client) as T;
            }

            case ChannelTypes.GUILD_CATEGORY: {
                CategoryChannel ??= await import("./CategoryChannel").then(m => m.default);
                return new CategoryChannel(data as Types.Channels.RawCategoryChannel, client) as T;
            }

            case ChannelTypes.GUILD_ANNOUNCEMENT: {
                AnnouncementChannel ??= await import("./AnnouncementChannel").then(m => m.default);
                return new AnnouncementChannel(data as Types.Channels.RawAnnouncementChannel, client) as T;
            }

            case ChannelTypes.ANNOUNCEMENT_THREAD: {
                AnnouncementThreadChannel ??= await import("./AnnouncementThreadChannel").then(m => m.default);
                return new AnnouncementThreadChannel(data as Types.Channels.RawAnnouncementThreadChannel, client) as T;
            }

            case ChannelTypes.PUBLIC_THREAD: {
                PublicThreadChannel ??= await import("./PublicThreadChannel").then(m => m.default);
                return new PublicThreadChannel(data as Types.Channels.RawPublicThreadChannel, client) as T;
            }

            case ChannelTypes.PRIVATE_THREAD: {
                PrivateThreadChannel ??= await import("./PrivateThreadChannel").then(m => m.default);
                return new PrivateThreadChannel(data as Types.Channels.RawPrivateThreadChannel, client) as T;
            }

            case ChannelTypes.GUILD_STAGE_VOICE: {
                StageChannel ??= await import("./StageChannel").then(m => m.default);
                return new StageChannel(data as Types.Channels.RawStageChannel, client) as T;
            }

            case ChannelTypes.GUILD_FORUM: {
                ForumChannel ??= await import("./ForumChannel").then(m => m.default);
                return new ForumChannel(data as Types.Channels.RawForumChannel, client) as T;
            }

            case ChannelTypes.GUILD_MEDIA: {
                MediaChannel ??= await import("./MediaChannel").then(m => m.default);
                return new MediaChannel(data as Types.Channels.RawMediaChannel, client) as T;
            }

            default: return new Channel(data, client) as T;
        }
    }

    /** A string that will mention this channel. */
    get mention(): string {
        return `<#${this.id}>`;
    }

    /**
     * Close a direct message, leave a group channel, or delete a guild channel.
     */
    async delete(): Promise<void> {
        await this.client.rest.channels.delete(this.id);
    }

    override toJSON(): Types.JSON.JSONChannel {
        return {
            ...super.toJSON(),
            type: this.type
        };
    }
}
