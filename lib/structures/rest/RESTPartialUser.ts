import RESTBase from "./RESTBase";
import type { RawPartialUser } from "../../routes/Users";
import type { ImageFormat } from "../../Constants";
import type RESTClient from "../../RESTClient";
import * as Routes from "../../util/Routes";

/** Represents a partial user retrieved via the REST api. */
export default class RESTPartialUser extends RESTBase {
	/** The user's avatar hash. */
	avatar: string | null;
	/** If this user is a bot. */
	bot: boolean;
	/** The 4 digits after the user's username. */
	discriminator: string;
	/** The user's public [flags](https://discord.com/developers/docs/resources/user#user-object-user-flags). */
	publicFlags: number;
	/** If this user is an official discord system user. */
	system: boolean;
	/** The user's username. */
	username: string;
	constructor(data: RawPartialUser, client: RESTClient) {
		super(data.id, client);
		this.avatar        = data.avatar;
		this.bot		   = !!data.bot;
		this.discriminator = data.discriminator;
		this.publicFlags   = data.public_flags;
		this.system        = !!data.system;
		this.username      = data.username;
	}

	/** The default avatar value of this user (discriminator modulo 5). */
	get defaultAvatar() {
		return Number(this.discriminator) % 5;
	}

	/** A string that will mention this user. */
	get mention() {
		return `<@${this.id}>`;
	}

	/** a combination of this user's username and discriminator. */
	get tag() {
		return `${this.username}#${this.discriminator}`;
	}

	/**
	 * The url of this user's avatar (or default avatar, if they have not set an avatar).
	 *
	 * @param {ImageFormat} format - The format the url should be.
	 * @param {Number} size - The dimensions of the image.
	 * @returns {String}
	 */
	avatarURL(format?: ImageFormat, size?: number) {
		return this.avatar === null ? this.defaultAvatarURL() : this._client._formatImage(Routes.USER_AVATAR(this.id, this.avatar), format, size);
	}

	/**
	 * The url of this user's default avatar.
	 *
	 * @returns {String}
	 */
	defaultAvatarURL() {
		return this._client._formatImage(Routes.EMBED_AVATAR(this.defaultAvatar), "png");
	}
}
