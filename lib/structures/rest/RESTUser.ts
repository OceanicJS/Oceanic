import RESTPartialUser from "./RESTPartialUser";
import type { RawRESTUser } from "../../routes/Users";
import type RESTClient from "../../RESTClient";
import type { ImageFormat } from "../../Constants";
import * as Routes from "../../util/Routes";

/** Represents a user retrieved via the REST api. */
export default class RESTUser extends RESTPartialUser {
	/** The user's banner color. */
	accentColor: number | null;
	/** The user's banner hash. */
	banner: string | null;
	constructor(data: RawRESTUser, client: RESTClient) {
		super(data, client);
		this.accentColor = data.accent_color;
		this.banner      = data.banner;
	}

	/**
	 * The url of this user's banner.
	 *
	 * @param {ImageFormat} format - The format the url should be.
	 * @param {Number} size - The dimensions of the image.
	 * @returns {(String | null)}
	 */
	bannerURL(format?: ImageFormat, size?: number) {
		return this.banner === null ? null : this._client._formatImage(Routes.BANNER(this.id, this.banner), format, size);
	}
}
