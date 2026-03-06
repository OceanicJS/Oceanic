/** @module Types/GuildTemplate */
import type * as Types from "./namespaced";

export interface RawGuildTemplate {
    code: string;
    created_at: string;
    creator: Types.Users.RawUser;
    creator_id: string;
    description: string | null;
    is_dirty: boolean | null;
    name: string;
    serialized_source_guild: Partial<Types.Guilds.RawGuild>;
    source_guild_id: string;
    updated_at: string;
    usage_count: number;
}

export interface CreateTemplateOptions {
    /** The description of the template. */
    description?: string | null;
    /** The name of the template. */
    name: string;
}

export interface EditGuildTemplateOptions extends Partial<CreateTemplateOptions> {}
