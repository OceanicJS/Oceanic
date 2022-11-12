import Base from "./Base";
import Permission from "./Permission";
import type { GuildFeature, ImageFormat } from "../Constants";
import type { RawOAuthGuild } from "../types";
import type Client from "../Client";
import * as Routes from "../util/Routes";

/** Represents a guild retrieved via oauth. */
export default class OAuthGuild extends Base {
    /** The approximate number of members in this guild (if retrieved with counts). */
    approximateMemberCount?: number;
    /** The approximate number of non-offline members in this guild (if retrieved with counts). */
    approximatePresenceCount?: number;
    /** The [features](https://discord.com/developers/docs/resources/guild#guild-object-guild-features) this guild has. */
    features: Array<GuildFeature>;
    /** The icon hash of this guild. */
    icon: string | null;
    /** The name of this guild. */
    name: string;
    /** If the user is the owner of this guild. */
    owner: boolean;
    /** The permissions of the user in this guild. */
    permissions: Permission;
    constructor(data: RawOAuthGuild, client: Client) {
        super(data.id, client);
        this.approximateMemberCount = data.approximate_member_count;
        this.approximatePresenceCount = data.approximate_presence_count;
        this.features    = data.features;
        this.name        = data.name;
        this.icon        = data.icon;
        this.owner       = data.owner;
        this.permissions = new Permission(data.permissions);
    }

    /**
     * The url of this guild's icon.
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    iconURL(format?: ImageFormat, size?: number): string | null {
        return this.icon === null ? null : this.client.util.formatImage(Routes.GUILD_ICON(this.id, this.icon), format, size);
    }
}
