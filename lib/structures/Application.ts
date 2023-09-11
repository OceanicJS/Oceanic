/** @module Application */
import ClientApplication from "./ClientApplication.js";
import OAuthGuild from "./OAuthGuild.js";
import type Client from "../Client.js";
import type { InstallParams, RESTApplication } from "../types/oauth.js";
import type { ImageFormat } from "../Constants.js";
import * as Routes from "../util/Routes.js";
import type { JSONApplication } from "../types/json.js";

/** Represents an application. */
export default class Application extends ClientApplication {
    /** The approximate number of guilds the application is in. */
    approximateGuildCount: number;
    /** This application's rich presence invite cover image hash, if any. */
    coverImage: string | null;
    /** This application's default custom authorization link, if any. */
    customInstallURL?: string;
    /** The description of the application. */
    description: string;
    /** If this application is a game sold on Discord, the guild to which it has been linked. This will only be present if recieved via `/applications/@me` {@link REST/Miscellaneous.getApplication | Miscellaneous#getApplication}). */
    guild: OAuthGuild | null;
    /** If this application is a game sold on Discord, the ID of the guild to which it has been linked. */
    guildID: string | null;
    /** The icon hash of the application. */
    icon: string | null;
    /** Settings for this application's in-app authorization link, if enabled. */
    installParams?: InstallParams;
    /** This applications interaction endpoint url, if any. */
    interactionsEndpointURL: string | null;
    /** The name of the application. */
    name: string;
    /** If this application is a game sold on Discord, the id of the Game's SKU. */
    primarySKUID?: string;
    /** A URL to this application's privacy policy. */
    privacyPolicyURL?: string;
    /** This application's role connections verification url, if any. */
    roleConnectionsVerificationURL: string | null;
    /** A list of rpc origin urls, if rpc is enabled. */
    rpcOrigins: Array<string>;
    /** If this application is a game sold on Discord, the slug that links to its store page. */
    slug?: string;
    /** The tags for this application. */
    tags?: Array<string>;
    /** A URL to this application's terms of service. */
    termsOfServiceURL?: string;
    /** The type of this application. */
    type: number | null;
    /** The bot's hex encoded public key. */
    verifyKey: string;
    constructor(data: RESTApplication, client: Client) {
        super(data, client);
        this.approximateGuildCount = data.approximate_guild_count ?? 0;
        this.coverImage = null;
        this.description = data.description;
        this.guild = null;
        this.guildID = data.guild_id ?? null;
        this.icon = null;
        this.interactionsEndpointURL = null;
        this.name = data.name;
        this.roleConnectionsVerificationURL = null;
        this.rpcOrigins = [];
        this.type = null;
        this.verifyKey = data.verify_key;
        this.update(data);
    }

    protected override update(data: Partial<RESTApplication>): void {
        super.update(data);
        if (data.approximate_guild_count !== undefined) {
            this.approximateGuildCount = data.approximate_guild_count;
        }
        if (data.cover_image !== undefined) {
            this.coverImage = data.cover_image;
        }
        if (data.custom_install_url !== undefined) {
            this.customInstallURL = data.custom_install_url;
        }
        if (data.description !== undefined) {
            this.description = data.description;
        }
        if (data.guild !== undefined) {
            this.guild = new OAuthGuild(data.guild, this.client);
        }
        this.guildID = data.guild_id === undefined ? null : data.guild_id;
        if (data.icon !== undefined) {
            this.icon = data.icon;
        }
        if (data.install_params !== undefined) {
            this.installParams = data.install_params;
        }
        if (data.interactions_endpoint_url !== undefined) {
            this.interactionsEndpointURL = data.interactions_endpoint_url;
        }
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.primary_sku_id !== undefined) {
            this.primarySKUID = data.primary_sku_id;
        }
        if (data.privacy_policy_url !== undefined) {
            this.privacyPolicyURL = data.privacy_policy_url;
        }
        if (data.role_connections_verification_url !== undefined) {
            this.roleConnectionsVerificationURL = data.role_connections_verification_url;
        }
        if (data.rpc_origins !== undefined) {
            this.rpcOrigins = data.rpc_origins;
        }
        if (data.slug !== undefined) {
            this.slug = data.slug;
        }
        if (data.tags !== undefined) {
            this.tags = data.tags;
        }
        if (data.terms_of_service_url !== undefined) {
            this.termsOfServiceURL = data.terms_of_service_url;
        }
        if (data.type !== undefined) {
            this.type = data.type;
        }
        if (data.verify_key !== undefined) {
            this.verifyKey = data.verify_key;
        }
    }

    /**
     * The url of this application's cover image.
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    coverImageURL(format?: ImageFormat, size?: number): string | null {
        return this.coverImage === null ? null : this.client.util.formatImage(Routes.APPLICATION_COVER(this.id, this.coverImage), format, size);
    }

    override toJSON(): JSONApplication {
        return {
            ...super.toJSON(),
            approximateGuildCount:          this.approximateGuildCount,
            coverImage:                     this.coverImage,
            customInstallURL:               this.customInstallURL,
            description:                    this.description,
            guild:                          this.guild?.toJSON() ?? null,
            guildID:                        this.guildID,
            icon:                           this.icon,
            installParams:                  this.installParams,
            interactionsEndpointURL:        this.interactionsEndpointURL,
            name:                           this.name,
            primarySKUID:                   this.primarySKUID,
            privacyPolicyURL:               this.privacyPolicyURL,
            roleConnectionsVerificationURL: this.roleConnectionsVerificationURL,
            rpcOrigins:                     this.rpcOrigins,
            slug:                           this.slug,
            tags:                           this.tags,
            termsOfServiceURL:              this.termsOfServiceURL,
            type:                           this.type,
            verifyKey:                      this.verifyKey
        };
    }
}
