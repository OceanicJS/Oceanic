import Base from "./Base";
import type Client from "../Client";
import type { GuildFeature } from "../Constants";
import type { GuildEmoji, RawGuildPreview, Sticker } from "../types/guilds";
import type { JSONGuildPreview } from "../types/json";
/** A preview of a guild. */
export default class GuildPreview extends Base {
    /** The approximate number of members in this guild. */
    approximateMemberCount: number;
    /** The approximate number of online members in this guild. */
    approximatePresenceCount: number;
    /** The description of this guild. */
    description: string | null;
    /** The discovery splash hash of this guild. */
    discoverySplash: string | null;
    /** The emojis of this guild. */
    emojis: Array<GuildEmoji>;
    /** The [features](https://discord.com/developers/docs/resources/guild#guild-object-guild-features) of this guild. */
    features: Array<GuildFeature>;
    /** The icon hash of this guild. */
    icon: string | null;
    /** The name of this guild. */
    name: string;
    /** The invite splash of this guild. */
    splash: string | null;
    /** The stickers in this guild. */
    stickers: Array<Sticker>;
    constructor(data: RawGuildPreview, client: Client);
    protected update(data: RawGuildPreview): void;
    toJSON(): JSONGuildPreview;
}
