/** @module Channel */
import Base from "./Base";
import type * as Types from "../types/namespaced";
import { ChannelTypes } from "../Constants";
import type Client from "../Client";

/** Represents a channel. */
export default class Channel extends Base {
    /** The [type](https://discord.com/developers/docs/resources/channel#channel-object-channel-types) of this channel. */
    type: ChannelTypes;
    constructor(data: Types.Channels.RawChannel, client: Client) {
        super(data.id, client);
        this.type = data.type;
    }

    static from<T extends Types.Channels.AnyChannel = Types.Channels.AnyChannel>(data: Types.Channels.RawChannel, client: Client): T {
        switch (data.type) {
            case ChannelTypes.GUILD_TEXT: {
                return new TextChannel(data as Types.Channels.RawTextChannel, client) as T;
            }
            case ChannelTypes.DM: {
                return new PrivateChannel(data as Types.Channels.RawPrivateChannel, client) as T;
            }
            case ChannelTypes.GUILD_VOICE: {
                return new VoiceChannel(data as Types.Channels.RawVoiceChannel, client) as T;
            }
            case ChannelTypes.GROUP_DM: {
                return new GroupChannel(data as Types.Channels.RawGroupChannel, client) as T;
            }
            case ChannelTypes.GUILD_CATEGORY: {
                return new CategoryChannel(data as Types.Channels.RawCategoryChannel, client) as T;
            }
            case ChannelTypes.GUILD_ANNOUNCEMENT: {
                return new AnnouncementChannel(data as Types.Channels.RawAnnouncementChannel, client) as T;
            }
            case ChannelTypes.ANNOUNCEMENT_THREAD: {
                return new AnnouncementThreadChannel(data as Types.Channels.RawAnnouncementThreadChannel, client) as T;
            }
            case ChannelTypes.PUBLIC_THREAD: {
                return new PublicThreadChannel(data as Types.Channels.RawPublicThreadChannel, client) as T;
            }
            case ChannelTypes.PRIVATE_THREAD: {
                return new PrivateThreadChannel(data as Types.Channels.RawPrivateThreadChannel, client) as T;
            }
            case ChannelTypes.GUILD_STAGE_VOICE: {
                return new StageChannel(data as Types.Channels.RawStageChannel, client) as T;
            }
            case ChannelTypes.GUILD_FORUM: {
                return new ForumChannel(data as Types.Channels.RawForumChannel, client) as T;
            }
            case ChannelTypes.GUILD_MEDIA: {
                return new MediaChannel(data as Types.Channels.RawMediaChannel, client) as T;
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

    override toJSON(): Types.JSON.JSONChannel {
        return {
            ...super.toJSON(),
            type: this.type
        };
    }
}

// Yes this sucks, but it works. That's the important part. Circular imports are hell.
/* eslint-disable @typescript-eslint/no-var-requires, unicorn/prefer-module */
const TextChannel = (require("./TextChannel") as typeof import("./TextChannel")).default;
const PrivateChannel = (require("./PrivateChannel") as typeof import("./PrivateChannel")).default;
const VoiceChannel = (require("./VoiceChannel") as typeof import("./VoiceChannel")).default;
const CategoryChannel = (require("./CategoryChannel") as typeof import("./CategoryChannel")).default;
const GroupChannel = (require("./GroupChannel") as typeof import("./GroupChannel")).default;
const AnnouncementChannel = (require("./AnnouncementChannel") as typeof import("./AnnouncementChannel")).default;
const PublicThreadChannel = (require("./PublicThreadChannel") as typeof import("./PublicThreadChannel")).default;
const PrivateThreadChannel = (require("./PrivateThreadChannel") as typeof import("./PrivateThreadChannel")).default;
const AnnouncementThreadChannel = (require("./AnnouncementThreadChannel") as typeof import("./AnnouncementThreadChannel")).default;
const StageChannel = (require("./StageChannel") as typeof import("./StageChannel")).default;
const ForumChannel = (require("./ForumChannel") as typeof import("./ForumChannel")).default;
const MediaChannel = (require("./MediaChannel") as typeof import("./MediaChannel")).default;
/* eslint-enable @typescript-eslint/no-var-requires, unicorn/prefer-module */
