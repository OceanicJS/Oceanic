import RESTUser from "./RESTUser";
import type { ModifySelfUser, RawRESTSelfUser } from "../../routes/Users";
import type RESTClient from "../../RESTClient";

/** Represents the currently authenticated user. */
export default class RESTSelfUser extends RESTUser {
	/** The user's email. (always null for bots) */
	email: string | null;
	/** The flags of the user. */
	flags: number;
	/** The locale of the user */
	locale: string;
	/** If the user has mfa enabled on their account */
	mfaEnabled: boolean;
	/** If this user's email is verified. (always true for bots) */
	verified: boolean;
	constructor(data: RawRESTSelfUser, client: RESTClient) {
		super(data, client);
		this.email      = data.email;
		this.flags      = data.flags;
		this.locale     = data.locale;
		this.mfaEnabled = !!data.mfa_enabled;
		this.verified   = !!data.verified;
	}

	/**
	 * Modify this user.
	 *
	 * @param {Object} options
	 * @param {String} [options.username] - The new username
	 * @param {?(String | Buffer)} [options.avatar] - The new avatar (buffer, or full data url). `null` to remove the current avatar.
	 * @returns {Promise<RESTSelfUser>}
	 */
	async edit(options: ModifySelfUser) {
		return this._client.users.modifySelf(options);
	}
}
