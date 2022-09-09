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
    constructor(data: RawGuildPreview, client: Client) {
        super(data.id, client);
        this.approximateMemberCount = 0;
        this.approximatePresenceCount = 0;
        this.description = null;
        this.discoverySplash = null;
        this.emojis = [];
        this.features = [];
        this.icon = null;
        this.name = data.name;
        this.splash = null;
        this.stickers = [];
        this.update(data);
    }

    protected update(data: RawGuildPreview): void {
        if (data.approximate_member_count !== undefined) {
            this.approximateMemberCount = data.approximate_member_count;
        }
        if (data.approximate_presence_count !== undefined) {
            this.approximatePresenceCount = data.approximate_presence_count;
        }
        if (data.description !== undefined) {
            this.description = data.description;
        }
        if (data.discovery_splash !== undefined) {
            this.discoverySplash = data.discovery_splash;
        }
        if (data.emojis !== undefined) {
            this.emojis = data.emojis.map(emoji => ({
                ...emoji,
                user: !emoji.user ? undefined : this.client.users.update(emoji.user)
            }));
        }
        if (data.features !== undefined) {
            this.features = data.features;
        }
        if (data.icon !== undefined) {
            this.icon = data.icon;
        }
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.splash !== undefined) {
            this.splash = data.splash;
        }
        if (data.stickers !== undefined) {
            this.stickers = data.stickers;
        }
    }

    override toJSON(): JSONGuildPreview {
        return {
            ...super.toJSON(),
            approximateMemberCount:   this.approximateMemberCount,
            approximatePresenceCount: this.approximatePresenceCount,
            description:              this.description,
            discoverySplash:          this.discoverySplash,
            emojis:                   this.emojis,
            features:                 this.features,
            icon:                     this.icon,
            name:                     this.name,
            splash:                   this.splash,
            stickers:                 this.stickers
        };
    }
}
