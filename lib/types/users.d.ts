/** @module Types/Users */
import type { RawMember } from "./guilds";
import type { PremiumTypes } from "../Constants";

// avatar_decoration, (self) bio
export interface RESTUser {
    accent_color?: number | null;
    avatar: string | null;
    avatar_decoration?: string | null;
    banner?: string | null;
    bot?: boolean;
    discriminator: string;
    email?: string | null;
    flags?: number;
    id: string;
    locale?: string;
    member?: RawMember;
    mfa_enabled?: boolean;
    premium_type?: PremiumTypes;
    public_flags?: number;
    system?: boolean;
    username: string;
    verified?: boolean;
}
export type RawUser = Pick<RESTUser, "id" | "username" | "discriminator" | "avatar" | "avatar_decoration" | "bot" | "system" | "banner" | "accent_color"> & Required<Pick<RESTUser, "public_flags">>;
export type RawUserWithMember = RawUser & Pick<RESTUser, "member">;
export type RawOAuthUser = Pick<RESTUser, "id" | "username" | "discriminator" | "avatar" | "avatar_decoration" | "bot" | "system"> & Required<Pick<RESTUser, "banner" | "accent_color" | "locale" | "mfa_enabled" | "email" | "verified" | "flags" | "public_flags">>;
export type RawExtendedUser = Pick<RawOAuthUser, "avatar" | "avatar_decoration" | "bot" | "discriminator" | "email" | "flags" | "id" | "mfa_enabled" | "username" | "verified">;

export interface EditSelfUserOptions {
    /** The new avatar (buffer, or full data url). `null` to reset. */
    avatar?: Buffer | string | null;
    /** The new username. */
    username?: string;
}

export interface CreateGroupChannelOptions {
    /** An array of access tokens with the `gdm.join` scope. */
    accessTokens: Array<string>;
    /** A dictionary of ids to nicknames, looks unused. */
    nicks?: Record<string, string>;
}
