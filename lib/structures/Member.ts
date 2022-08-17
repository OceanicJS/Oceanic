import Base from "./Base";
import type User from "./User";
import type { ImageFormat } from "../Constants";
import type Client from "../Client";
import type { RawMember } from "../types/guilds";
import { assert } from "tsafe";

export default class Member extends Base {
	/** The member's avatar hash, if they have set a guild avatar. */
	avatar: string | null;
	communicationDisabledUntil: Date | null;
	deaf: boolean;
	flags: number;
	guildID: string;
	isPending: boolean;
	joinedAt: Date;
	mute: boolean;
	nick: string | null;
	pending: boolean;
	premiumSince: Date;
	roles: Array<string>;
	user: User;
	constructor(data: RawMember, client: Client, guildID: string) {
		assert(data.user, "Member recieved without accompanying user.");
		super(data.user.id, client);
		this.guildID = guildID;
		this.update(data);
	}

	protected update(data: RawMember) {
		this.avatar                     = data.user.avatar;
		this.communicationDisabledUntil = !data.communication_disabled_until ? null : new Date(data.communication_disabled_until);
		this.deaf                       = data.deaf;
		this.flags                      = data.flags;
		this.isPending                  = data.is_pending;
		this.joinedAt                   = new Date(data.joined_at);
		this.mute                       = data.mute;
		this.nick                       = data.nick;
		this.pending                    = data.pending;
		this.premiumSince               = new Date(data.premium_since);
		this.roles                      = data.roles;
		this.user                       = this._client.users.update(data.user);
	}

	/** If the member associated with the user is a bot. */
	get bot() { return this.user.bot; }
	/** The 4 digits after the username of the user associated with this member. */
	get discriminator() { return this.user.discriminator; }
	/** A string that will mention this member. */
	get mention() { return this.user.mention; }
	/** The user associated with this member's public [flags](https://discord.com/developers/docs/resources/user#user-object-user-flags). */
	get publicUsers() { return this.user.publicFlags; }
	/** If this user associated with this member is an official discord system user. */
	get system() { return this.user.system; }
	/** a combination of the user associated with this member's username and discriminator. */
	get tag() { return this.user.tag; }
	/** The user associated ith this member's username. */
	get username() { return this.user.username; }

	/**
	 * The url of this user's guild avatar (or their user avatar if no guild avatar is set, or their default avatar if none apply).
	 *
	 * @param {ImageFormat} format - The format the url should be.
	 * @param {Number} size - The dimensions of the image.
	 * @returns {String}
	 */
	avatarURL(format?: ImageFormat, size?: number) {
		return this.avatar === null ? this.user.avatarURL(format, size) : this._client._formatImage(this.avatar, format, size);
	}
}
