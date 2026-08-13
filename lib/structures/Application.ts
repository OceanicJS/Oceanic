/** @module Application */
import ClientApplication from "./ClientApplication";
import OAuthGuild from "./OAuthGuild";
import User from "./User";
import Team from "./Team";
import SKU from "./SKU";
import type Client from "../Client";
import type * as Types from "../types/namespaced";
import type {
    ApplicationDiscoverabilityState,
    ApplicationEventWebhookEventType,
    ApplicationEventWebhookStatus,
    ApplicationExplicitContentFilterLevel,
    ApplicationIntegrationTypes,
    ApplicationInteractionsVersion,
    ApplicationInternalGuildRestriction,
    ApplicationMonetizationState,
    ApplicationType,
    ApplicationVerificationState,
    ApprovableConsoleType,
    EmbeddedActivityPlatformType,
    ImageFormat,
    PricingLocalizationStrategy,
    RPCApplicationState,
    StoreApplicationState
} from "../Constants";
import * as Routes from "../util/Routes";
import { WithRequired } from "../types";

/** Represents an application. */
export default class Application extends ClientApplication {
    aliases?: Array<string>;
    /** The approved console types for social SDK builds */
    approvedConsoles?: Array<ApprovableConsoleType>;
    /** The approximate number of guilds the application is in. */
    approximateGuildCount?: number;
    /** Approximate count of users that have OAuth2 authorizations for the application */
    approximateUserAuthorizationCount?: number;
    /** The approximate number of users this application has been installed by. */
    approximateUserInstallCount?: number;
    /** Approximate count of guilds the application's bot is in */
    botApproximateGuildCount?: number;
    /** Whether the application's bot is disabled by Discord (default false) */
    botDisabled?: boolean;
    /** @deprecated If the bot can be invited by anyone. */
    botPublic?: boolean;
    /** Whether the application's bot is quarantined by Discord; quarantined bots cannot join more guilds or start new direct messages (default false) */
    botQuarantined?: boolean;
    /** @deprecated If authorizing the bot requires a code grant. */
    botRequireCodeGrant?: boolean;
    /** The URL which users will be directed to when connecting their account in the application to their Discord account */
    connectionEntrypointURL?: string;
    /** This application's rich presence invite cover image hash, if any. */
    coverImage?: string | null;
    /** The current guild creator monetization state of the application */
    creatorMonetizationState?: number;
    /** This application's default custom authorization link, if any. */
    customInstallURL?: string;
    /** The URL used for deep linking during OAuth2 authorization on mobile devices */
    deeplinkURI?: string;
    /** The description of the application. */
    description: string;
    /** The companies that developed the application */
    developers?: Array<Types.Applications.ApplicationCompany>;
    /** The state of this application's discoverability. */
    discoverabilityState?: ApplicationDiscoverabilityState;
    /** The { @link Constants~ApplicationDiscoveryEligibilityFlags | flags } for this application's discovery eligibility. */
    discoveryEligibilityFlags?: number;
    /** The configuration for the application's embedded activity */
    embeddedActivityConfig?: Types.Applications.EmbeddedActivityConfig;
    /** The ID of the EULA required to play the application's game */
    eulaID?: string;
    /** If webhook events are enabled for the app. */
    eventWebhooksStatus?: ApplicationEventWebhookStatus;
    /**	List of Webhook event types the app subscribes to. */
    eventWebhooksTypes?: Array<ApplicationEventWebhookEventType>;
    /** Event webhooks URL for the app to receive webhook events. */
    eventWebhooksURL?: string | null;
    /** The unique executables of the application's game */
    executables?: Array<Types.Applications.ApplicationExecutable>;
    /** The explicit content filter for this application. */
    explicitContentFilter?: ApplicationExplicitContentFilterLevel;
    // flags is in the parent class
    /** If this application is a game sold on Discord, the guild to which it has been linked. This will only be present if received via {@link REST/Applications.getCurrent | `/applications/@me`}. */
    guild?: OAuthGuild | null;
    /** If this application is a game sold on Discord, the ID of the guild to which it has been linked. */
    guildID?: string | null;
    /** Whether the Discord client is allowed to hook into the application's game directly */
    hook: boolean;
    /** The icon hash of the application. */
    icon: string | null;
    /** Settings for this application's in-app authorization link, if enabled. */
    installParams?: Types.OAuth.InstallParams;
    /** Whether only the application owner can add the integration */
    integrationPublic?: boolean;
    /** Whether the integration will only be added upon completion of a full OAuth2 token exchange */
    integrationRequireCodeGrant?: boolean;
    /** The install types available for this application. */
    integrationTypes?: Array<ApplicationIntegrationTypes>;
    /** The configs for the install types available for this application. */
    integrationTypesConfig?: Types.Applications.IntegrationTypesConfig;
    /** This applications interaction endpoint url, if any. */
    interactionsEndpointURL?: string | null;
    /** The event types that will be received like http interactions, if interactionsVersion is 2. */
    interactionsEventTypes?: Array<string>;
    /** The interactions version of this application. */
    interactionsVersion?: ApplicationInteractionsVersion;
    /** What guilds the application can be authorized in */
    internalGuildRestriction?: ApplicationInternalGuildRestriction;
    /** Whether the application is discoverable in the application directory */
    isDiscoverable: boolean;
    /** If this application is monetized. */
    isMonetized: boolean;
    /** Whether the application is verified */
    isVerified: boolean;
    /** The maximum possible participants in the application's embedded activity (-1 for no limit) */
    maxParticipants?: number;
    /** The { @link Constants~ApplicationMonetizationEligibilityFlags | flags } for this application's monetization eligibility. */
    monetizationEligibilityFlags?: number;
    /** This application's monetization state. */
    monetizationState?: ApplicationMonetizationState;
    /** The name of the application. */
    name: string;
    /** Whether the application's game supports the Discord overlay (default false) */
    overlay?: boolean;
    /** Whether to use the compatibility hook for the overlay (default false) */
    overlayCompatibilityHook?: boolean;
    /** The { @link Constants~OverlayMethodFlags | methods of overlaying } that the application's game supports */
    overlayMethods?: number;
    /** Whether the Discord overlay is known to be problematic with this application's game (default false) */
    overlayWarn?: boolean;
    /** The owner of this application. */
    owner?: User | null;
    /** The ID of the parent application */
    parentID?: string;
    /** The pricing localization strategy used for the application's store presence */
    pricingLocalizationStrategy?: PricingLocalizationStrategy;
    /** If this application is a game sold on Discord, the id of the Game's SKU. */
    primarySKUID?: string;
    /** A URL to this application's privacy policy. */
    privacyPolicyURL?: string;
    /** The companies that published the application*/
    publishers?: Array<Types.Applications.ApplicationCompany>;
    /** The redirect URIs for this application. */
    redirectURIs?: Array<string>;
    /** This application's role connections verification url, if any. */
    roleConnectionsVerificationURL?: string | null;
    /** The state of this application's RPC application. */
    rpcApplicationState?: RPCApplicationState;
    /** A list of rpc origin urls, if rpc is enabled. */
    rpcOrigins?: Array<string>;
    /** If this application is a game sold on Discord, the slug that links to its store page. */
    slug?: string;
    /** The state of this application's store application state. */
    storeApplicationState?: StoreApplicationState;
    /** Whether the application has public subscriptions or products available for purchase */
    storefrontAvailable: boolean;
    /** The tags for this application. */
    tags?: Array<string>;
    /** The team that owns this application. */
    team?: Team | null;
    /** A URL to this application's terms of service. */
    termsOfServiceURL?: string;
    /** The third party SKUs of the application's game */
    thirdPartySKUs?: Array<SKU>;
    /** The type of this application. */
    type: ApplicationType | null;
    /** The state of this application's verification. */
    verificationState?: ApplicationVerificationState;
    /** The bot's hex encoded public key. */
    verifyKey: string;
    constructor(data: Types.Applications.RawApplication, client: Client) {
        super(data as Types.Shared.WithRequired<Types.Applications.RawApplication, "flags" | "flags_new">, client);
        this.description = data.description;
        this.hook = data.hook;
        this.icon = data.icon;
        this.isDiscoverable = data.is_discoverable;
        this.isMonetized = data.is_monetized;
        this.isVerified = data.is_verified;
        this.name = data.name;
        this.storefrontAvailable = data.storefront_available;
        this.type = data.type;
        this.verifyKey = data.verify_key;
        this.update(data);
    }

    protected override update(data: Partial<Types.Applications.RawApplication>): void {
        super.update(data);
        if (data.aliases !== undefined) this.aliases = data.aliases;
        if (data.approved_consoles !== undefined) this.approvedConsoles = data.approved_consoles;
        if (data.approximate_guild_count !== undefined) this.approximateGuildCount = data.approximate_guild_count;
        if (data.approximate_user_authorization_count !== undefined) this.approximateUserAuthorizationCount = data.approximate_user_authorization_count;
        if (data.approximate_user_install_count !== undefined) this.approximateUserInstallCount = data.approximate_user_install_count;
        if (data.bot_approximate_guild_count !== undefined) this.botApproximateGuildCount = data.bot_approximate_guild_count;
        if (data.bot_disabled !== undefined) this.botDisabled = data.bot_disabled;
        if (data.bot_quarantined !== undefined) this.botQuarantined = data.bot_disabled;
        if (data.bot_public !== undefined) this.botPublic = data.bot_public;
        if (data.bot_require_code_grant !== undefined) this.botRequireCodeGrant = data.bot_require_code_grant;
        if (data.connection_entrypoint_url !== undefined) this.connectionEntrypointURL = data.connection_entrypoint_url;
        if (data.cover_image !== undefined) this.coverImage = data.cover_image;
        if (data.creator_monetization_state !== undefined) this.creatorMonetizationState = data.creator_monetization_state;
        if (data.custom_install_url !== undefined) this.customInstallURL = data.custom_install_url;
        if (data.deeplink_uri !== undefined) this.deeplinkURI = data.deeplink_uri;
        if (data.description !== undefined) this.description = data.description;
        if (data.developers !== undefined) this.developers = data.developers;
        if (data.discoverability_state !== undefined) this.discoverabilityState = data.discoverability_state;
        if (data.discovery_eligibility_flags !== undefined) this.discoveryEligibilityFlags = data.discovery_eligibility_flags;
        if (data.embedded_activity_config !== undefined) {
            this.embeddedActivityConfig = {
                activityPreviewVideoAssetID: data.embedded_activity_config.activity_preview_video_asset_id,
                applicationID:               data.embedded_activity_config.application_id,
                blockedLocales:              data.embedded_activity_config.blocked_locales,
                clientPlatformConfig:        Object.entries(data.embedded_activity_config.client_platform_config).reduce((obj, [key, value]) => {
                    obj[key as EmbeddedActivityPlatformType] = {
                        labelType:             value.label_type,
                        labelUntil:            value.label_until ? new Date(value.label_until) : null,
                        omitBadgeFromSurfaces: value.omit_badge_from_surfaces,
                        releasePhase:          value.release_phase
                    };
                    return obj;
                }, {} as Record<EmbeddedActivityPlatformType, Types.Applications.EmbeddedActivityPlatformConfig>),
                defaultOrientationLockState:       data.embedded_activity_config.default_orientation_lock_state,
                displaysAdvertisements:            data.embedded_activity_config.displays_advertisements,
                freePeriodEndsAt:                  data.embedded_activity_config.free_period_ends_at ? new Date(data.embedded_activity_config.free_period_ends_at) : null,
                freePeriodStartsAt:                data.embedded_activity_config.free_period_starts_at ? new Date(data.embedded_activity_config.free_period_starts_at) : null,
                hasCspException:                   data.embedded_activity_config.has_csp_exception,
                legacyResponsiveAspectRatio:       data.embedded_activity_config.legacy_responsive_aspect_ratio,
                premiumTierRequirement:            data.embedded_activity_config.premium_tier_requirement,
                requiresAgeGate:                   data.embedded_activity_config.requires_age_gate,
                shelfRank:                         data.embedded_activity_config.shelf_rank,
                supportedLocales:                  data.embedded_activity_config.supported_locales,
                supportedPlatforms:                data.embedded_activity_config.supported_platforms,
                tabletDefaultOrientationLockState: data.embedded_activity_config.tablet_default_orientation_lock_state
            };
        }
        if (data.eula_id !== undefined) this.eulaID = data.eula_id;
        if (data.event_webhooks_status !== undefined) this.eventWebhooksStatus = data.event_webhooks_status;
        if (data.event_webhooks_types !== undefined) this.eventWebhooksTypes = data.event_webhooks_types;
        if (data.event_webhooks_url !== undefined) this.eventWebhooksURL = data.event_webhooks_url;
        if (data.executables !== undefined) {
            this.executables = data.executables.map(executable => ({
                isLauncher: executable.is_launcher,
                name:       executable.name,
                os:         executable.os
            }));
        }
        if (data.explicit_content_filter !== undefined) this.explicitContentFilter = data.explicit_content_filter;
        if (data.flags !== undefined) this.flags = data.flags;
        if (data.guild !== undefined) this.guild = data.guild ? new OAuthGuild(data.guild, this.client) : null;
        if (data.guild_id !== undefined) this.guildID = data.guild_id;
        if (data.hook !== undefined) this.hook = data.hook;
        if (data.icon !== undefined) this.icon = data.icon;
        if (data.install_params !== undefined) this.installParams = data.install_params;
        if (data.integration_public !== undefined) this.integrationPublic = data.integration_public;
        if (data.integration_require_code_grant !== undefined) this.integrationRequireCodeGrant = data.integration_require_code_grant;
        if (data.integration_types !== undefined) this.integrationTypes = data.integration_types;
        if (data.integration_types_config !== undefined) this.integrationTypesConfig = Object.entries(data.integration_types_config).reduce((obj, [key, value]) => {
            obj[key as `${ApplicationIntegrationTypes}`] = {
                oauth2InstallParams: value.oauth2_install_params
            };
            return obj;
        }, {} as Types.Applications.IntegrationTypesConfig);
        if (data.interactions_endpoint_url !== undefined) this.interactionsEndpointURL = data.interactions_endpoint_url;
        if (data.interactions_event_types !== undefined) this.interactionsEventTypes = data.interactions_event_types;
        if (data.interactions_version !== undefined) this.interactionsVersion = data.interactions_version;
        if (data.internal_guild_restriction !== undefined) this.internalGuildRestriction = data.internal_guild_restriction;
        if (data.is_discoverable !== undefined) this.isDiscoverable = data.is_discoverable;
        if (data.is_monetized !== undefined) this.isMonetized = data.is_monetized;
        if (data.is_verified !== undefined) this.isVerified = data.is_verified;
        if (data.max_participants !== undefined) this.maxParticipants = data.max_participants;
        if (data.monetization_eligibility_flags !== undefined) this.monetizationEligibilityFlags = data.monetization_eligibility_flags;
        if (data.monetization_state !== undefined) this.monetizationState = data.monetization_state;
        if (data.name !== undefined) this.name = data.name;
        if (data.overlay !== undefined) this.overlay = data.overlay;
        if (data.overlay_compatibility_hook !== undefined) this.overlayCompatibilityHook = data.overlay_compatibility_hook;
        if (data.overlay_methods !== undefined) this.overlayMethods = data.overlay_methods;
        if (data.overlay_warn !== undefined) this.overlayWarn = data.overlay_warn;
        if (data.owner !== undefined) this.owner = data.owner ? new User(data.owner, this.client) : null;
        if (data.parent_id !== undefined) this.parentID = data.parent_id;
        if (data.pricing_localization_strategy !== undefined) this.pricingLocalizationStrategy = data.pricing_localization_strategy;
        if (data.primary_sku_id !== undefined) this.primarySKUID = data.primary_sku_id;
        if (data.privacy_policy_url !== undefined) this.privacyPolicyURL = data.privacy_policy_url;
        if (data.publishers !== undefined) this.publishers = data.publishers;
        if (data.redirect_uris !== undefined) this.redirectURIs = data.redirect_uris;
        if (data.role_connections_verification_url !== undefined) this.roleConnectionsVerificationURL = data.role_connections_verification_url;
        if (data.rpc_application_state !== undefined) this.rpcApplicationState = data.rpc_application_state;
        if (data.rpc_origins !== undefined) this.rpcOrigins = data.rpc_origins;
        if (data.slug !== undefined) this.slug = data.slug;
        if (data.store_application_state !== undefined) this.storeApplicationState = data.store_application_state;
        if (data.storefront_available !== undefined) this.storefrontAvailable = data.storefront_available;
        if (data.tags !== undefined) this.tags = data.tags;
        if (data.team !== undefined) this.team = data.team ? new Team(data.team, this.client) : null;
        if (data.terms_of_service_url !== undefined) this.termsOfServiceURL = data.terms_of_service_url;
        if (data.third_party_skus !== undefined) this.thirdPartySKUs = data.third_party_skus.map(sku => new SKU(sku, this.client));
        if (data.type !== undefined) this.type = data.type;
        if (data.verification_state !== undefined) this.verificationState = data.verification_state;
        if (data.verify_key !== undefined) this.verifyKey = data.verify_key;
    }

    /**
     * The url of this application's cover image.
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    coverImageURL(format?: ImageFormat, size?: number): string | null {
        return this.coverImage ? this.client.util.formatImage(Routes.APPLICATION_COVER(this.id, this.coverImage), format, size) : null;
    }

    /**
     * The url of this application's icon.
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    iconURL(format?: ImageFormat, size?: number): string | null {
        return this.icon === null ? null : this.client.util.formatImage(Routes.APPLICATION_ICON(this.id, this.icon), format, size);
    }

    override toJSON(): Types.JSON.JSONApplication {
        return {
            ...super.toJSON(),
            aliases:                           this.aliases,
            approvedConsoles:                  this.approvedConsoles,
            approximateGuildCount:             this.approximateGuildCount,
            approximateUserAuthorizationCount: this.approximateUserAuthorizationCount,
            approximateUserInstallCount:       this.approximateUserInstallCount,
            botApproximateGuildCount:          this.botApproximateGuildCount,
            botDisabled:                       this.botDisabled,
            botPublic:                         this.botPublic,
            botQuarantined:                    this.botQuarantined,
            botRequireCodeGrant:               this.botRequireCodeGrant,
            connectionEntrypointURL:           this.connectionEntrypointURL,
            coverImage:                        this.coverImage,
            creatorMonetizationState:          this.creatorMonetizationState,
            customInstallURL:                  this.customInstallURL,
            deeplinkURI:                       this.deeplinkURI,
            description:                       this.description,
            developers:                        this.developers,
            discoverabilityState:              this.discoverabilityState,
            discoveryEligibilityFlags:         this.discoveryEligibilityFlags,
            embeddedActivityConfig:            this.embeddedActivityConfig,
            eulaID:                            this.eulaID,
            eventWebhooksStatus:               this.eventWebhooksStatus,
            eventWebhooksTypes:                this.eventWebhooksTypes,
            eventWebhooksURL:                  this.eventWebhooksURL,
            executables:                       this.executables,
            explicitContentFilter:             this.explicitContentFilter,
            guild:                             this.guild?.toJSON() ?? null,
            guildID:                           this.guildID,
            hook:                              this.hook,
            icon:                              this.icon,
            installParams:                     this.installParams,
            integrationPublic:                 this.integrationPublic,
            integrationRequireCodeGrant:       this.integrationRequireCodeGrant,
            integrationTypes:                  this.integrationTypes,
            integrationTypesConfig:            this.integrationTypesConfig,
            interactionsEndpointURL:           this.interactionsEndpointURL,
            interactionsEventTypes:            this.interactionsEventTypes,
            interactionsVersion:               this.interactionsVersion,
            internalGuildRestriction:          this.internalGuildRestriction,
            isDiscoverable:                    this.isDiscoverable,
            isMonetized:                       this.isMonetized,
            isVerified:                        this.isVerified,
            maxParticipants:                   this.maxParticipants,
            monetizationEligibilityFlags:      this.monetizationEligibilityFlags,
            monetizationState:                 this.monetizationState,
            name:                              this.name,
            overlay:                           this.overlay,
            overlayCompatibilityHook:          this.overlayCompatibilityHook,
            overlayMethods:                    this.overlayMethods,
            overlayWarn:                       this.overlayWarn,
            owner:                             this.owner?.toJSON() ?? null,
            parentID:                          this.parentID,
            pricingLocalizationStrategy:       this.pricingLocalizationStrategy,
            primarySKUID:                      this.primarySKUID,
            privacyPolicyURL:                  this.privacyPolicyURL,
            publishers:                        this.publishers,
            redirectURIs:                      this.redirectURIs,
            roleConnectionsVerificationURL:    this.roleConnectionsVerificationURL,
            rpcApplicationState:               this.rpcApplicationState,
            rpcOrigins:                        this.rpcOrigins,
            slug:                              this.slug,
            storeApplicationState:             this.storeApplicationState,
            storefrontAvailable:               this.storefrontAvailable,
            tags:                              this.tags,
            team:                              this.team?.toJSON() ?? null,
            termsOfServiceURL:                 this.termsOfServiceURL,
            thirdPartySKUs:                    this.thirdPartySKUs?.map(sku => sku.toJSON()),
            type:                              this.type,
            verificationState:                 this.verificationState,
            verifyKey:                         this.verifyKey
        };
    }
}
