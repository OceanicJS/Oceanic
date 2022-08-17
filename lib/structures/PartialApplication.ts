import Base from "./Base";
import type Client from "../Client";
import type { ImageFormat } from "../Constants";
import * as Routes from "../util/Routes";
import type { RawPartialApplication } from "../types/oauth";

export class PartialApplication extends Base {
	botPublic: boolean;
	botRequireCodeGrant: boolean;
	description: string;
	icon: string | null;
	name: string;
	verifyKey: string;
	constructor(data: RawPartialApplication, client: Client) {
		super(data.id, client);
		this.update(data);
	}

	protected update(data: RawPartialApplication) {
		this.botPublic           = data.bot_public;
		this.botRequireCodeGrant = data.bot_require_code_grant;
		this.description         = data.description;
		this.icon                = data.icon;
		this.name                = data.name;
		this.verifyKey           = data.verify_key;
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
