import type Guild from "./Guild";
import type User from "./User";
import type Client from "../Client";
import type { CreateGuildFromTemplateOptions, EditGuildTemplateOptions, RawGuildTemplate } from "../types/guild-template";
import type { RawGuild } from "../types/guilds";
import type { Uncached } from "../types/shared";
import type { JSONGuildTemplate } from "../types/json";
export default class GuildTemplate {
    protected _client: Client;
    /** The code of the template. */
    code: string;
    /** When this template was created. */
    createdAt: Date;
    /** The creator of this template. */
    creator: User;
    /** The description of this template. */
    description: string | null;
    /** If this template has unsynced changes. */
    isDirty: boolean | null;
    /** The name of this template. */
    name: string;
    /** A snapshot of the guild. */
    serializedSourceGuild: Partial<RawGuild>;
    /** The source guild of this template. */
    sourceGuild: Guild | Uncached;
    /** When this template was last updated. */
    updatedAt: Date;
    /** The amount of times this template has been used. */
    usageCount: number;
    constructor(data: RawGuildTemplate, client: Client);
    protected update(data: Partial<RawGuildTemplate>): void;
    /**
     * Create a guild from this template. This can only be used by bots in less than 10 guilds.
     *
     * @param {Object} options
     * @param {(Buffer | String)} [options.icon] - The icon for the created guild (buffer, or full data url).
     * @param {String} options.name - The name of the guild.
     * @returns {Promise<Guild>}
     */
    createGuild(options: CreateGuildFromTemplateOptions): Promise<Guild>;
    /**
     * Delete this template.
     *
     * @returns {Promise<void>}
     */
    delete(): Promise<void>;
    /**
     * Edit this template.
     *
     * @param {Object} options
     * @param {String} [options.description] - The description of the template.
     * @param {String} [options.name] - The name of the template.
     * @returns {Promise<GuildTemplate>}
     */
    editTemplate(options: EditGuildTemplateOptions): Promise<GuildTemplate>;
    /**
     * Sync this template.
     *
     * @returns {Promise<GuildTemplate>}
     */
    syncTemplate(): Promise<GuildTemplate>;
    toJSON(): JSONGuildTemplate;
}
