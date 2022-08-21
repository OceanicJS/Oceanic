import type User from "./User";
import Team from "./Team";
import ClientApplication from "./ClientApplication";
import type Client from "../Client";
import type { InstallParams, RESTApplication } from "../types/oauth";
import type { ImageFormat } from "../Constants";
import * as Routes from "../util/Routes";

/** Represents an oauth application. */
export default class Application extends ClientApplication {
	/** When false, only the application's owners can invite the bot to guilds. */
	botPublic: boolean;
	/** When true, the applications bot will only join upon the completion of the full oauth2 code grant flow. */
	botRequireCodeGrant: boolean;
	/** This application's rich presence invite cover image hash, if any. */
	coverImage: string | null;
	/** This application's default custom authorization link, if any. */
	customInstallURL?: string;
	/** The description of the application. */
	description: string;
	/** If this application is a game sold on Discord, the guild to which it has been linked. */
	guildID?: string;
	/** The icon hash of the application. */
	icon: string | null;
	/** Settings for this application's in-app authorization link, if enabled. */
	installParams?: InstallParams;
	/** The name of the application. */
	name: string;
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
	/** The bot's hex encoded public key. */
	verifyKey: string;
	/** @hideconstructor */
	constructor(data: RESTApplication, client: Client) {
		super(data, client);
		this.update(data);
	}

	protected update(data: RESTApplication) {
		super.update(data);
		this.botPublic           = data.bot_public;
		this.botRequireCodeGrant = data.bot_require_code_grant;
		this.coverImage          = data.cover_image;
		this.customInstallURL    = data.custom_install_url;
		this.description         = data.description;
		this.guildID             = data.guild_id;
		this.icon                = data.icon;
		this.installParams       = data.install_params;
		this.name                = data.name;
		this.owner               = this._client.users.update(data.owner);
		this.primarySKUID        = data.primary_sku_id;
		this.privacyPolicyURL    = data.privacy_policy_url;
		this.rpcOrigins          = data.rpc_origins;
		this.slug                = data.slug;
		this.tags                = data.tags;
		this.team                = data.team ? new Team(data.team, this._client) : null;
		this.termsOfServiceURL   = data.terms_of_service_url;
		this.verifyKey           = data.verify_key;
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
