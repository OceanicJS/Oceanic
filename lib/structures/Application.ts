import { PartialApplication } from "./PartialApplication";
import type User from "./User";
import Team from "./Team";
import type Client from "../Client";
import type { ImageFormat } from "../Constants";
import * as Routes from "../util/Routes";
import type { InstallParams, RESTApplication } from "../types/oauth";

export default class Application extends PartialApplication {
	coverImage: string | null;
	customInstallURL?: string;
	flags: number;
	guildID?: string;
	installParams: InstallParams;
	owner: User;
	primarySKUID?: string;
	privacyPolicyURL?: string;
	rpcOrigins: Array<string>;
	slug?: string;
	tags?: Array<string>;
	team: Team | null;
	termsOfServiceURL?: string;
	constructor(data: RESTApplication, client: Client) {
		super(data, client);
		this.update(data);
	}

	protected update(data: RESTApplication) {
		super.update(data);
		this.coverImage = data.cover_image;
		this.customInstallURL = data.custom_install_url;
		this.flags = data.flags;
		this.guildID = data.guild_id;
		this.installParams = data.install_params;
		this.owner = this._client.users.update(data.owner);
		this.primarySKUID = data.primary_sku_id;
		this.privacyPolicyURL = data.privacy_policy_url;
		this.rpcOrigins = data.rpc_origins;
		this.slug = data.slug;
		this.tags = data.tags;
		this.team = data.team ? new Team(data.team, this._client) : null;
		this.termsOfServiceURL = data.terms_of_service_url;
	}

	/**
	 * The url of this application's cover image.
	 *
	 * @param {ImageFormat} format - The format the url should be.
	 * @param {Number} size - The dimensions of the image.
	 * @returns {?String}
	 */
	coverImageURL(format?: ImageFormat, size?: number) {
		return this.coverImage === null ? null : this._client._formatImage(Routes.APPLICATION_COVER(this.id, this.coverImage), format, size);
	}
}
