import Base from "./Base";
import Permission from "./Permission";
import type Client from "../Client";
import type { RawRole, RoleTags } from "../types/guilds";

/** Represents a role in a guild. */
export default class Role extends Base {
	/** The color of this role. */
	color: number;
	/** The id of the guild this role is in. */
	guildID: string;
	/** If this role is hoisted. */
	hoist: boolean;
	/** The icon has of this role. */
	icon: string | null;
	/** If this role is managed by an integration. */
	managed: boolean;
	/** If this role can be mentioned by anybody. */
	mentionable: boolean;
	/** The name of this role. */
	name: string;
	/** The permissions of this role. */
	permissions: Permission;
	/** The position of this role. */
	position: number;
	/** The [tags](https://discord.com/developers/docs/topics/permissions#role-object-role-tags-structure) of this role. */
	tags: RoleTags;
	/** The unicode emoji of this role. */
	unicodeEmoji: string | null;
	/** @hideconstructor */
	constructor(data: RawRole, client: Client, guildID: string) {
		super(data.id, client);
		this.guildID = guildID;
		this.managed = data.managed;
		this.update(data);
	}

	protected update(data: Partial<RawRole>) {
		if (data.color !== undefined) this.color = data.color;
		if (data.hoist !== undefined) this.hoist = data.hoist;
		if (data.icon !== undefined) this.icon = data.icon || null;
		if (data.mentionable !== undefined) this.mentionable = data.mentionable;
		if (data.name !== undefined) this.name = data.name;
		if (data.permissions !== undefined) this.permissions = new Permission(data.permissions);
		if (data.position !== undefined) this.position = data.position;
		if (data.tags !== undefined) this.tags = data.tags || {};
		if (data.unicode_emoji !== undefined) this.unicodeEmoji = data.unicode_emoji || null;
	}

	/** A string that will mention this role. */
	get mention() {
		return `<@&${this.id}>`;
	}
}
