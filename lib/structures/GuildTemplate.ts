import type Guild from "./Guild";
import type User from "./User";
import type Client from "../Client";
import type { CreateGuildFromTemplateOptions, EditGuildTemplateOptions, RawGuildTemplate } from "../types/guild-template";
import type { RawGuild } from "../types/guilds";
import type { Uncached } from "../types/shared";

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
	/** @hideconstructor */
	constructor(data: RawGuildTemplate, client: Client) {
		this._client = client;
		this.update(data);
	}

	protected update(data: RawGuildTemplate) {
		this.code                  = data.code;
		this.createdAt             = new Date(data.created_at);
		this.creator               = this._client.users.update(data.creator);
		this.description           = data.description;
		this.isDirty               = data.is_dirty;
		this.name                  = data.name;
		this.serializedSourceGuild = data.serialized_source_guild;
		this.sourceGuild           = this._client.guilds.get(data.source_guild_id) || { id: data.source_guild_id };
		this.updatedAt             = new Date(data.updated_at);
		this.usageCount            = data.usage_count;
	}

	/**
	 * Create a guild from this template. This can only be used by bots in less than 10 guilds.
	 *
	 * @param {Object} options
	 * @param {(Buffer | String)} [options.icon] - The icon for the created guild (buffer, or full data url).
	 * @param {String} options.name - The name of the guild.
	 * @returns {Promise<Guild>}
	 */
	async createGuild(options: CreateGuildFromTemplateOptions) {
		return this._client.rest.guilds.createFromTemplate(this.code, options);
	}

	/**
	 * Delete this template.
	 *
	 * @returns {Promise<void>}
	 */
	async delete() {
		return this._client.rest.guilds.deleteTemplate(this.sourceGuild.id, this.code);
	}

	/**
	 * Edit this template.
	 *
	 * @param {Object} options
	 * @param {String} [options.description] - The description of the template.
	 * @param {String} [options.name] - The name of the template.
	 * @returns {Promise<GuildTemplate>}
	 */
	async editTemplate(options: EditGuildTemplateOptions) {
		return this._client.rest.guilds.editTemplate(this.sourceGuild.id, this.code, options);
	}

	/**
	 * Sync this template.
	 *
	 * @returns {Promise<GuildTemplate>}
	 */
	async syncTemplate() {
		return this._client.rest.guilds.syncTemplate(this.sourceGuild.id, this.code);
	}
}
