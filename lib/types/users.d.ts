/** @module Types/Users */
import type * as Types from "./namespaced";
import type { DisplayNameEffect, DisplayNameFont, PremiumTypes } from "../Constants";

export interface RESTUser {
    accent_color?: number | null;
    avatar: string | null;
    avatar_decoration_data?: RawAvatarDecorationData | null;
    banner?: string | null;
    bot?: boolean;
    clan?: RawClan | null;
    collectibles?: RawCollectibles | null;
    discriminator: string;
    display_name_styles?: RawDisplayNameStyles | null;
    email?: string | null;
    flags?: number;
    global_name: string | null;
    id: string;
    locale?: string;
    member?: Types.Guilds.RawMember;
    mfa_enabled?: boolean;
    premium_type?: PremiumTypes;
    primary_guild?: RawClan | null;
    public_flags?: number;
    system?: boolean;
    username: string;
    verified?: boolean;
}
export interface RawUser extends Pick<RESTUser, "id" | "username" | "discriminator" | "avatar" | "avatar_decoration_data" | "bot" | "system" | "banner" | "accent_color" | "clan" | "collectibles" | "premium_type" | "primary_guild" | "display_name_styles">, Required<Pick<RESTUser, "public_flags" | "global_name">> {}
export interface RawUserWithMember extends RawUser, Pick<RESTUser, "member"> {}
export interface RawOAuthUser extends Pick<RESTUser, "id" | "username" | "discriminator" | "avatar" | "avatar_decoration_data" | "bot" | "system" | "global_name" | "premium_type">, Required<Pick<RESTUser, "banner" | "accent_color" | "locale" | "mfa_enabled" | "email" | "verified" | "flags" | "public_flags" | "clan">> {}
export interface RawExtendedUser extends Pick<RawOAuthUser, "avatar" | "avatar_decoration_data" | "bot" | "discriminator" | "email" | "flags" | "id" | "mfa_enabled" | "premium_type" | "username" | "verified" | "global_name" | "clan"> {}

export interface EditSelfUserOptions {
    /** The new avatar (buffer, or full data url). `null` to reset. */
    avatar?: Buffer | string | null;
    /** The new banner (buffer, or full data url). `null` to reset. */
    banner?: Buffer | string | null;
    /** The new username. */
    username?: string;
}

export interface CreateGroupChannelOptions {
    /** An array of access tokens with the `gdm.join` scope. */
    accessTokens: Array<string>;
    /** A dictionary of ids to nicknames, looks unused. */
    nicks?: Record<string, string>;
}

export interface RawClan {
    badge: string;
    identity_enabled: boolean;
    identity_guild_id: string;
    tag: string;
}

export interface RawAvatarDecorationData {
    asset: string;
    sku_id: string;
}

export interface AvatarDecorationData {
    asset: string;
    skuID: string;
}

export interface RawCollectibles {
    nameplate?: RawNameplate;
}

export interface Collectibles {
    nameplate?: Nameplate;
}

export interface RawNameplate {
    asset: string;
    label: string;
    palette: NameplatePalette;
    sku_id: string;
}

export interface Nameplate {
    asset: string;
    label: string;
    palette: NameplatePalette;
    skuID: string;
}

export type NameplatePalette = "crimson" | "berry" | "sky" | "teal" | "forest" | "bubble_gum" | "violet" | "cobalt" | "clover" | "lemon" | "white";

export interface RawDisplayNameStyles {
    colors: Array<number>;
    effect_id: DisplayNameEffect;
    font_id: DisplayNameFont;
}

export interface DisplayNameStyles {
    /** The colors to use encoded as an array of integers representing hexadecimal color codes (max 2) */
    colors: Array<number>;
    /** The effect to use */
    effectID: DisplayNameEffect;
    /** The font to use */
    fontID: DisplayNameFont;
}
