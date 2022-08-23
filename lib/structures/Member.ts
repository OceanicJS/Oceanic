import Base from "./Base";
import type User from "./User";
import type { ImageFormat } from "../Constants";
import type Client from "../Client";
import type { RawMember } from "../types/guilds";
import { assert } from "tsafe";

/** Represents a member of a guild. */
export default class Member extends Base {
	/** The member's avatar hash, if they have set a guild avatar. */
	avatar: string | null;
	/** When the member's [timeout](https://support.discord.com/hc/en-us/articles/4413305239191-Time-Out-FAQ) will expire, if active. */
	communicationDisabledUntil: Date | null;
	/** If this member is server deafened. */
	deaf: boolean;
	/** Undocumented. */
	flags?: number;
	/** The id of the guild this member is for. */
	guildID: string;
	/** Undocumented. */
	isPending?: boolean;
	/** The date at which this member joined the guild. */
	joinedAt: Date;
	/** If this member is server muted. */
	mute: boolean;
	/** This member's nickname, if any. */
	nick: string | null;
	/** If this member has not passed the guild's [membership screening](https://discord.com/developers/docs/resources/guild#membership-screening-object) requirements. */
	pending: boolean;
	/** The date at which this member started boosting the guild, if applicable. */
	premiumSince: Date | null;
	/** The roles this member has. */
	roles: Array<string>;
	/** The user associated with this member. */
	user: User;
	/** @hideconstructor */
	constructor(data: RawMember, client: Client, guildID: string) {
		assert(data.user, "Member recieved without accompanying user.");
		super(data.user.id, client);
		this.avatar = null;
		this.communicationDisabledUntil = null;
		this.nick = null;
		this.pending = false;
		this.premiumSince = null;
		this.guildID = guildID;
		this.update(data);
	}

	protected update(data: Partial<RawMember>) {
		if (data.avatar !== undefined) this.avatar = data.avatar;
		if (data.communication_disabled_until !== undefined) this.communicationDisabledUntil = data.communication_disabled_until === null ? null : new Date(data.communication_disabled_until);
		if (data.deaf !== undefined) this.deaf = data.deaf;
		if (data.flags !== undefined) this.flags = data.flags;
		if (data.is_pending !== undefined) this.isPending = data.is_pending;
		if (data.joined_at !== undefined) this.joinedAt = new Date(data.joined_at);
		if (data.mute !== undefined) this.mute = data.mute;
		if (data.nick !== undefined) this.nick = data.nick;
		if (data.pending !== undefined) this.pending = data.pending;
		if (data.premium_since !== undefined) this.premiumSince = new Date(data.premium_since);
		if (data.roles !== undefined) this.roles = data.roles;
		if (data.user !== undefined) this.user = this._client.users.update(data.user);
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
