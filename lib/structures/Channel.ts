/** @module Channel */
import Base from "./Base.js";
import { ChannelTypes } from "../Constants.js";
import type Client from "../Client.js";
import type {
    AnyChannel,
    RawAnnouncementChannel,
    RawAnnouncementThreadChannel,
    RawCategoryChannel,
    RawChannel,
    RawForumChannel,
    RawGroupChannel,
    RawMediaChannel,
    RawPrivateChannel,
    RawPrivateThreadChannel,
    RawPublicThreadChannel,
    RawStageChannel,
    RawTextChannel,
    RawVoiceChannel
} from "../types/channels.js";
import type { JSONChannel } from "../types/json.js";

/** Represents a channel. */
export default class Channel extends Base {
    /** The [type](https://discord.com/developers/docs/resources/channel#channel-object-channel-types) of this channel. */
    type: ChannelTypes;
    constructor(data: RawChannel, client: Client) {
        super(data.id, client);
        this.type = data.type;
    }

    static from<T extends AnyChannel = AnyChannel>(data: RawChannel, client: Client): T {
        switch (data.type) {
            case ChannelTypes.GUILD_TEXT: {
                return new TextChannel(data as RawTextChannel, client) as T;
            }
            case ChannelTypes.DM: {
                return new PrivateChannel(data as RawPrivateChannel, client) as T;
            }
            case ChannelTypes.GUILD_VOICE: {
                return new VoiceChannel(data as RawVoiceChannel, client) as T;
            }
            case ChannelTypes.GROUP_DM: {
                return new GroupChannel(data as RawGroupChannel, client) as T;
            }
            case ChannelTypes.GUILD_CATEGORY: {
                return new CategoryChannel(data as RawCategoryChannel, client) as T;
            }
            case ChannelTypes.GUILD_ANNOUNCEMENT: {
                return new AnnouncementChannel(data as RawAnnouncementChannel, client) as T;
            }
            case ChannelTypes.ANNOUNCEMENT_THREAD: {
                return new AnnouncementThreadChannel(data as RawAnnouncementThreadChannel, client) as T;
            }
            case ChannelTypes.PUBLIC_THREAD: {
                return new PublicThreadChannel(data as RawPublicThreadChannel, client) as T;
            }
            case ChannelTypes.PRIVATE_THREAD: {
                return new PrivateThreadChannel(data as RawPrivateThreadChannel, client) as T;
            }
            case ChannelTypes.GUILD_STAGE_VOICE: {
                return new StageChannel(data as RawStageChannel, client) as T;
            }
            case ChannelTypes.GUILD_FORUM: {
                return new ForumChannel(data as RawForumChannel, client) as T;
            }
            case ChannelTypes.GUILD_MEDIA: {
                return new MediaChannel(data as RawMediaChannel, client) as T;
            }
            default: {
                return new Channel(data, client) as T;
            }
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

    override toJSON(): JSONChannel {
        return {
            ...super.toJSON(),
            type: this.type
        };
    }
}

// Yes this sucks, but it works. That's the important part. Circular imports are hell.
/* eslint-disable @typescript-eslint/no-var-requires, unicorn/prefer-module */
const TextChannel = (await import("./TextChannel.js")).default;
const PrivateChannel = (await import("./PrivateChannel.js")).default;
const VoiceChannel = (await import("./VoiceChannel.js")).default;
const CategoryChannel = (await import("./CategoryChannel.js")).default;
const GroupChannel = (await import("./GroupChannel.js")).default;
const AnnouncementChannel = (await import("./AnnouncementChannel.js")).default;
const PublicThreadChannel = (await import("./PublicThreadChannel.js")).default;
const PrivateThreadChannel = (await import("./PrivateThreadChannel.js")).default;
const AnnouncementThreadChannel = (await import("./AnnouncementThreadChannel.js")).default;
const StageChannel = (await import("./StageChannel.js")).default;
const ForumChannel = (await import("./ForumChannel.js")).default;
const MediaChannel = (await import("./MediaChannel.js")).default;
/* eslint-enable @typescript-eslint/no-var-requires, unicorn/prefer-module */
