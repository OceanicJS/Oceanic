/** @module Types/GuildTemplate */
import type { RawGuild } from "./guilds";
import type { RawUser } from "./users";

export interface RawGuildTemplate {
    code: string;
    created_at: string;
    creator: RawUser;
    creator_id: string;
    description: string | null;
    is_dirty: boolean | null;
    name: string;
    serialized_source_guild: Partial<RawGuild>;
    source_guild_id: string;
    updated_at: string;
    usage_count: number;
}

export interface CreateGuildFromTemplateOptions {
    /** The icon for the created guild (buffer, or full data url). */
    icon?: Buffer | string;
    /** The name of the guild. */
    name: string;
}

export interface CreateTemplateOptions {
    /** The description of the template. */
    description?: string | null;
    /** The name of the template. */
    name: string;
}

export interface EditGuildTemplateOptions extends Partial<CreateTemplateOptions> {}
