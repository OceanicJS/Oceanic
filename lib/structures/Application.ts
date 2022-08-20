import { PartialApplication } from "./PartialApplication";
import type User from "./User";
import Team from "./Team";
import type Client from "../Client";
import type { ImageFormat } from "../Constants";
import * as Routes from "../util/Routes";
import type { InstallParams, RESTApplication } from "../types/oauth";

/** Represents an oauth application. */
export default class Application extends PartialApplication {
	/** This application's rich presence invite cover image hash, if any. */
	coverImage: string | null;
	/** This application's default custom authorization link, if any. */
	customInstallURL?: string;
	/** This application's [public flags](https://discord.com/developers/docs/resources/application#application-object-application-flags). */
	flags: number;
	/** If this application is a game sold on Discord, the guild to which it has been linked. */
	guildID?: string;
	/** Settings for this application's in-app authorization link, if enabled. */
	installParams?: InstallParams;
	/** The owner of this application. */
	owner: User;
	/** If this application is a game sold on Discord, the id of the Game's SKU. */
	primarySKUID?: string;
	/** A url to this application's privacy policy. */
	privacyPolicyURL?: string;
	/** A list of rpc origin urls, if rpc is enabled. */
	rpcOrigins: Array<string>;
	/** If this application is a game sold on Discord, the slug that links to its store page. */
	slug?: string;
	/** The tags for this application. */
	tags?: Array<string>;
	/** The team that owns this application, if any. */
	team: Team | null;
	/** A url to this application's terms of service. */
	termsOfServiceURL?: string;
	/** @hideconstructor */
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
