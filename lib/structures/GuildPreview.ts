import Base from "./Base";
import type Client from "../Client";
import type { GuildFeature } from "../Constants";
import type { GuildEmoji, RawGuildPreview, Sticker } from "../types/guilds";

/** A preview of a guild. */
export default class GuildPreview extends Base {
	/** The approximate number of members in this guild.  */
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
	/** @hideconstructor */
	constructor(data: RawGuildPreview, client: Client) {
		super(data.id, client);
		this.update(data);
	}

	protected update(data: RawGuildPreview) {
		this.approximateMemberCount   = data.approximate_member_count;
		this.approximatePresenceCount = data.approximate_presence_count;
		this.description              = data.description;
		this.discoverySplash          = data.discovery_splash;
		this.emojis                   = data.emojis.map(emoji => ({
			...emoji,
			user: !emoji.user ? undefined : this._client.users.update(emoji.user)
		}));
		this.features                 = data.features;
		this.icon                     = data.icon;
		this.name                     = data.name;
		this.splash                   = data.splash;
		this.stickers                 = data.stickers;
	}
}
