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
    icon?: Buffer | string;
    name: string;
}

export interface CreateTemplateOptions {
    description?: string | null;
    name: string;
}

export type EditGuildTemplateOptions = Partial<CreateTemplateOptions>;
