import Base from "./Base";
import type Client from "../Client";
import type { ImageFormat } from "../Constants";
import * as Routes from "../util/Routes";
import type { RawPartialApplication } from "../types/oauth";

export class PartialApplication extends Base {
	/** When false, only the application's owners can invite the bot to guilds. */
	botPublic: boolean;
	/** When true, the applications bot will only join upon the completion of the full oauth2 code grant flow. */
	botRequireCodeGrant: boolean;
	/** The description of the application. */
	description: string;
	/** The icon hash of the application. */
	icon: string | null;
	/** The name of the application. */
	name: string;
	/** The bot's hex encoded public key. */
	verifyKey: string;
	/** @hideconstructor */
	constructor(data: RawPartialApplication, client: Client) {
		super(data.id, client);
		this.verifyKey = data.verify_key;
		this.update(data);
	}

	protected update(data: RawPartialApplication) {
		if (data.bot_public !== undefined) this.botPublic = data.bot_public;
		if (data.bot_require_code_grant !== undefined) this.botRequireCodeGrant = data.bot_require_code_grant;
		if (data.description !== undefined) this.description = data.description;
		if (data.icon !== undefined) this.icon = data.icon;
		if (data.name !== undefined) this.name = data.name;
	}

	/**
	 * The url of this application's icon.
	 *
	 * @param {ImageFormat} format - The format the url should be.
	 * @param {Number} size - The dimensions of the image.
	 * @returns {?String}
	 */
	iconURL(format?: ImageFormat, size?: number) {
		return this.icon === null ? null : this._client._formatImage(Routes.APPLICATION_COVER(this.id, this.icon), format, size);
	}
}
