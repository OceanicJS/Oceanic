import RESTBase from "./RESTBase";
import type RESTClient from "../../RESTClient";
import type { RawRole, RoleTags } from "../../routes/Guilds";

export default class RESTRole extends RESTBase {
	color: number;
	guildID: string;
	hoist: boolean;
	icon: string | null;
	managed: boolean;
	mentionable: boolean;
	name: string;
	permissions: string;
	position: number;
	tags: RoleTags;
	unicodeEmoji: string | null;
	constructor(data: RawRole, client: RESTClient, guildID: string) {
		super(data.id, client);
		this.color        = data.color;
		this.guildID      = guildID;
		this.hoist        = data.hoist;
		this.icon         = data.icon || null;
		this.managed      = data.managed;
		this.mentionable  = data.mentionable;
		this.name         = data.name;
		this.permissions  = data.permissions;
		this.position     = data.position;
		this.tags         = data.tags || {};
		this.unicodeEmoji = data.unicode_emoji || null;
	}
}
