/** @module Types/Applications */
import type * as Types from "./namespaced";
import type {
    ActivityLocationKind,
    ApplicationCommandOptionTypes,
    ApplicationCommandPermissionTypes,
    ApplicationCommandTypes,
    ApplicationDiscoverabilityState,
    ApplicationEventWebhookEventType,
    ApplicationEventWebhookStatus,
    ApplicationExplicitContentFilterLevel,
    ApplicationIntegrationTypes,
    ApplicationInteractionsVersion,
    ApplicationMonetizationState,
    ApplicationVerificationState,
    EntitlementOwnerTypes,
    EntitlementTypes,
    EntryPointCommandHandlerTypes,
    InteractionContextTypes,
    ApplicationInternalGuildRestriction,
    RPCApplicationState,
    SKUAccessTypes,
    SKUTypes,
    StoreApplicationState,
    SubscriptionStatuses,
    TeamMembershipState,
    EmbeddedActivityOrientationLockStateType,
    PremiumTiers,
    EmbeddedActivityLabelType,
    EmbeddedActivityReleasePhase,
    EmbeddedActivitySurface,
    EmbeddedActivityPlatformType,
    ApprovableConsoleType,
    PricingLocalizationStrategy,
    OperatingSystemType,
    TeamPayoutAccountStatus,
    TeamPayoutGateway,
    TeamMemberRoleType,
    ApplicationType
} from "../Constants";
import type ApplicationCommand from "../structures/ApplicationCommand";
import type ClientApplication from "../structures/ClientApplication";
import type User from "../structures/User";

export interface RawApplication {
    aliases?: Array<string>;
    approved_consoles?: Array<ApprovableConsoleType>;
    approximate_guild_count?: number;
    approximate_user_authorization_count?: number;
    approximate_user_install_count?: number;
    bot_approximate_guild_count?: number;
    bot_disabled?: boolean;
    /** @deprecated */
    bot_public?: boolean;
    bot_quarantined?: boolean;
    /** @deprecated */
    bot_require_code_grant?: boolean;
    connection_entrypoint_url?: string;
    cover_image?: string;
    creator_monetization_state?: number; // values unknown
    custom_install_url?: string;
    deeplink_uri?: string;
    description: string;
    developers?: Array<ApplicationCompany>;
    discoverability_state?: ApplicationDiscoverabilityState;
    discovery_eligibility_flags?: number;
    embedded_activity_config?: RawEmbeddedActivityConfig;
    eula_id?: string;
    event_webhooks_status?: ApplicationEventWebhookStatus;
    event_webhooks_types?: Array<ApplicationEventWebhookEventType>;
    event_webhooks_url?: string | null;
    executables?: Array<RawApplicationExecutable>;
    explicit_content_filter: ApplicationExplicitContentFilterLevel;
    flags: number;
    guild?: Types.Guilds.RawOAuthGuild;
    guild_id?: string;
    hook: boolean;
    icon: string | null;
    id: string;
    install_params?: Types.OAuth.InstallParams;
    integration_public?: boolean;
    integration_require_code_grant: boolean;
    integration_types?: Array<ApplicationIntegrationTypes>;
    integration_types_config?: Partial<Record<`${ApplicationIntegrationTypes}`, RawApplicationIntegrationConfig>>;
    interactions_endpoint_url?: string | null;
    interactions_event_types?: Array<string>;
    interactions_version?: ApplicationInteractionsVersion;
    internal_guild_restriction: ApplicationInternalGuildRestriction;
    is_discoverable: boolean;
    is_monetized: boolean;
    is_verified: boolean;
    max_participants?: number;
    monetization_eligibility_flags?: number;
    monetization_state?: ApplicationMonetizationState;
    name: string;
    overlay?: boolean;
    overlay_compatibility_hook?: boolean;
    overlay_methods?: number;
    overlay_warn?: boolean;
    owner?: Types.Users.RawUser;
    parent_id?: string;
    pricing_localization_strategy?: PricingLocalizationStrategy; // values unknown
    primary_sku_id?: string;
    privacy_policy_url?: string;
    publishers?: Array<ApplicationCompany>;
    redirect_uris?: Array<string>;
    role_connections_verification_url?: string | null;
    rpc_application_state?: RPCApplicationState;
    rpc_origins?: Array<string>;
    slug?: string;
    store_application_state?: StoreApplicationState;
    storefront_available: boolean;
    tags?: Array<string>;
    team?: RawTeam | null;
    terms_of_service_url?: string;
    third_party_skus?: Array<RawSKU>;
    type: ApplicationType | null;
    verification_state?: ApplicationVerificationState;
    verify_key: string;
}

export interface RawEmbeddedActivityConfig {
    activity_preview_video_asset_id: string | null;
    application_id?: string;
    blocked_locales: Array<string>;
    client_platform_config: Record<EmbeddedActivityPlatformType, RawEmbeddedActivityPlatformConfig>;
    default_orientation_lock_state: EmbeddedActivityOrientationLockStateType;
    displays_advertisements: boolean;
    /** @deprecated */
    free_period_ends_at?: string | null;
    /** @deprecated */
    free_period_starts_at?: string | null;
    has_csp_exception: boolean;
    legacy_responsive_aspect_ratio: boolean;
    /** @deprecated */
    premium_tier_requirement?: PremiumTiers | null;
    requires_age_gate: boolean;
    shelf_rank: number;
    supported_locales: Array<string>;
    supported_platforms: Array<string>;
    tablet_default_orientation_lock_state: EmbeddedActivityOrientationLockStateType;
}

export interface RawEmbeddedActivityPlatformConfig {
    label_type: EmbeddedActivityLabelType;
    label_until?: string | null;
    omit_badge_from_surfaces: Array<EmbeddedActivitySurface>;
    release_phase: EmbeddedActivityReleasePhase;
}

export interface RawApplicationExecutable {
    is_launcher: boolean;
    name: string;
    os: OperatingSystemType;
}

export interface EmbeddedActivityConfig {
    activityPreviewVideoAssetID: string | null;
    applicationID?: string;
    blockedLocales: Array<string>;
    clientPlatformConfig: Record<EmbeddedActivityPlatformType, EmbeddedActivityPlatformConfig>;
    defaultOrientationLockState: EmbeddedActivityOrientationLockStateType;
    displaysAdvertisements: boolean;
    /** @deprecated */
    freePeriodEndsAt: Date | null;
    /** @deprecated */
    freePeriodStartsAt: Date | null;
    hasCspException: boolean;
    legacyResponsiveAspectRatio: boolean;
    /** @deprecated */
    premiumTierRequirement?: PremiumTiers | null;
    requiresAgeGate: boolean;
    shelfRank: number;
    supportedLocales: Array<string>;
    supportedPlatforms: Array<string>;
    tabletDefaultOrientationLockState: EmbeddedActivityOrientationLockStateType;
}

export interface EmbeddedActivityPlatformConfig {
    labelType: EmbeddedActivityLabelType;
    labelUntil: Date | null;
    omitBadgeFromSurfaces: Array<EmbeddedActivitySurface>;
    releasePhase: EmbeddedActivityReleasePhase;
}

export interface ApplicationExecutable {
    isLauncher: boolean;
    name: string;
    os: OperatingSystemType;
}

export interface ApplicationCompany {
    id: string;
    name: string;
}

export interface RawPartialApplication extends Pick<RawApplication, "id" | "name" | "icon" | "description">, Partial<Pick<RawApplication, "bot_public" | "bot_require_code_grant" | "verify_key">> {}
export interface RESTOAuthApplication extends Types.Shared.WithRequired<RawApplication, "cover_image" | "flags" | "owner" | "rpc_origins" | "install_params" | "integration_types" | "integration_types_config"> {}
export interface RESTApplication extends Types.Shared.WithRequired<RawApplication, "flags" | "rpc_origins" | "install_params" | "integration_types" | "integration_types_config"> {}
export interface RawClientApplication extends Required<Pick<RawApplication, "id" | "flags">> {}

export interface IntegrationTypesConfig extends Partial<Record<`${ApplicationIntegrationTypes}`, ApplicationIntegrationConfig>> {}

export interface RawApplicationIntegrationConfig {
    oauth2_install_params?: Types.OAuth.InstallParams;
}

export interface ApplicationIntegrationConfig {
    oauth2InstallParams?: Types.OAuth.InstallParams;
}

export interface RawTeam {
    icon: string | null;
    id: string;
    members: Array<RawTeamMember>;
    name: string;
    owner_user_id: string;
    payout_account_status?: TeamPayoutAccountStatus | null;
    payout_account_statuses?: Array<TeamPayoutAccount>;
    stripe_connect_account_id?: string;
}

export interface TeamPayoutAccount {
    gateway: TeamPayoutGateway;
    status: TeamPayoutAccountStatus;
}

export interface RawTeamMember {
    membership_state: TeamMembershipState;
    role: TeamMemberRoleType;
    team_id: string;
    user: Types.Users.RawUser;
}

export interface TeamMember {
    /** This member's [membership state](https://discord.com/developers/docs/topics/teams#data-models-membership-state-enum) on this team. */
    membershipState: TeamMembershipState;
    /** The [role](https://discord.com/developers/docs/topics/teams#team-member-roles-team-member-role-types) of the team member. */
    role: TeamMemberRoleType;
    /** The id of the team this member is associated with. */
    teamID: string;
    /** The user associated with this team member. */
    user: User;
}

export interface RawApplicationCommand {
    application_id: string;
    contexts: Array<InteractionContextTypes>;
    default_member_permissions: string | null;
    description: string;
    description_localizations?: LocaleMap | null;
    description_localized?: string;
    dm_permission?: boolean;
    guild_id?: string;
    handler?: EntryPointCommandHandlerTypes;
    id: string;
    integration_types: Array<ApplicationIntegrationTypes>;
    name: string;
    name_localizations?: LocaleMap | null;
    name_localized?: string;
    nsfw?: boolean;
    options?: Array<RawApplicationCommandOption>;
    type: ApplicationCommandTypes;
    version: string;
}

export interface RawApplicationCommandOption {
    autocomplete?: boolean;
    channel_types?: Array<Types.Channels.ImplementedChannels>;
    choices?: Array<RawApplicationCommandOptionChoice>;
    description: string;
    description_localizations?: LocaleMap | null;
    description_localized?: string;
    max_length?: number;
    max_value?: number;
    min_length?: number;
    min_value?: number;
    name: string;
    name_localizations?: LocaleMap | null;
    name_localized?: string;
    options?: Array<RawApplicationCommandOption>;
    required?: boolean;
    type: ApplicationCommandOptionTypes;
}

export interface CombinedApplicationCommandOption {
    autocomplete?: boolean;
    channelTypes?: Array<Types.Channels.ImplementedChannels>;
    choices?: Array<ApplicationCommandOptionsChoice<ApplicationCommandOptionsTypesWithChoices>>;
    description: string;
    descriptionLocalizations?: LocaleMap | null;
    maxLength?: number;
    maxValue?: number;
    minLength?: number;
    minValue?: number;
    name: string;
    nameLocalizations?: LocaleMap | null;
    options?: Array<CombinedApplicationCommandOption>;
    required?: boolean;
    type: ApplicationCommandOptionTypes;
}

export interface RawApplicationCommandOptionChoice {
    name: string;
    name_localizations?: LocaleMap | null;
    value: string | number;
}

export type AnyApplicationCommand = ChatInputApplicationCommand | UserApplicationCommand | MessageApplicationCommand | PrimaryEntryPointApplicationCommand;
export type ApplicationCommandOptions = ApplicationCommandOptionsWithOptions | ApplicationCommandOptionsWithValue;
export type ApplicationCommandOptionsWithOptions = ApplicationCommandOptionsSubCommand | ApplicationCommandOptionsSubCommandGroup;
export type ApplicationCommandOptionsWithValue = ApplicationCommandOptionsString | ApplicationCommandOptionsInteger | ApplicationCommandOptionsBoolean | ApplicationCommandOptionsUser | ApplicationCommandOptionsChannel | ApplicationCommandOptionsRole | ApplicationCommandOptionsMentionable | ApplicationCommandOptionsNumber | ApplicationCommandOptionsAttachment;
export type ChatInputApplicationCommand = ApplicationCommand<ApplicationCommandTypes.CHAT_INPUT>;
export type UserApplicationCommand = ApplicationCommand<ApplicationCommandTypes.USER>;
export type MessageApplicationCommand = ApplicationCommand<ApplicationCommandTypes.MESSAGE>;
export type PrimaryEntryPointApplicationCommand = ApplicationCommand<ApplicationCommandTypes.PRIMARY_ENTRY_POINT>;

export type ApplicationCommandOptionConversion<T extends EditApplicationCommandOptions | CreateApplicationCommandOptions> =
    T extends EditChatInputApplicationCommandOptions | CreateChatInputApplicationCommandOptions ? ChatInputApplicationCommand :
        T extends EditUserApplicationCommandOptions | CreateUserApplicationCommandOptions ? UserApplicationCommand :
            T extends EditMessageApplicationCommandOptions | CreateMessageApplicationCommandOptions ? MessageApplicationCommand :
                T extends EditPrimaryEntryPointApplicationCommandOptions | CreatePrimaryEntryPointApplicationCommandOptions ? PrimaryEntryPointApplicationCommand :
                    never;


export interface ApplicationCommandOptionBase<T extends ApplicationCommandOptionTypes = ApplicationCommandOptionTypes> {
    description: string;
    descriptionLocalizations?: LocaleMap;
    /** The description of this application command in the requested locale. This cannot be sent. */
    descriptionLocalized?: string;
    name: string;
    nameLocalizations?: LocaleMap;
    /** The description of this application command in the requested locale. This cannot be sent. */
    nameLocalized?: string;
    required?: T extends ApplicationCommandOptionTypes.SUB_COMMAND | ApplicationCommandOptionTypes.SUB_COMMAND_GROUP ? never : boolean;
    type: T;
}

type ApplicationCommandOptionsTypesWithAutocomplete = ApplicationCommandOptionTypes.INTEGER | ApplicationCommandOptionTypes.NUMBER | ApplicationCommandOptionTypes.STRING;
type ApplicationCommandOptionsTypesWithChoices = ApplicationCommandOptionTypes.INTEGER | ApplicationCommandOptionTypes.NUMBER | ApplicationCommandOptionTypes.STRING;

interface ApplicationCommandOptionsChoices<T extends ApplicationCommandOptionsTypesWithChoices = ApplicationCommandOptionsTypesWithChoices> {
    choices?: Array<ApplicationCommandOptionsChoice<T>>;
}

interface ApplicationCommandOptionsChoice<T extends ApplicationCommandOptionsTypesWithChoices = ApplicationCommandOptionsTypesWithChoices> {
    name: string;
    nameLocalizations?: LocaleMap;
    value:
    T extends ApplicationCommandOptionTypes.STRING ? string :
        T extends ApplicationCommandOptionTypes.INTEGER | ApplicationCommandOptionTypes.NUMBER ? number :
            unknown;
}

interface ApplicationCommandOptionsChannelTypes {
    channelTypes?: Array<Types.Channels.ImplementedChannels>;
}

interface ApplicationCommandOptionsMinMaxValue {
    maxValue?: number;
    minValue?: number;
}

interface ApplicationCommandOptionsMinMaxLength {
    maxLength?: number;
    minLength?: number;
}

interface ApplicationCommandOptionsAutocomplete {
    autocomplete?: boolean;
}

interface ApplicationCommandOptionsSubCommand extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.SUB_COMMAND> {
    options?: Array<ApplicationCommandOptionsWithValue>;
}

interface ApplicationCommandOptionsSubCommandGroup extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.SUB_COMMAND_GROUP> {
    options?: Array<ApplicationCommandOptionsSubCommand | ApplicationCommandOptionsWithValue>;
}

export interface ApplicationCommandOptionsAttachment extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.ATTACHMENT> {}
export interface ApplicationCommandOptionsBoolean extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.BOOLEAN> {}
export interface ApplicationCommandOptionsChannel extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.CHANNEL>, ApplicationCommandOptionsChannelTypes {}
export type ApplicationCommandOptionsInteger = ApplicationCommandOptionBase<ApplicationCommandOptionTypes.INTEGER> & Types.Shared.ExclusifyUnion<ApplicationCommandOptionsAutocomplete | ApplicationCommandOptionsMinMaxValue | ApplicationCommandOptionsChoices<ApplicationCommandOptionTypes.INTEGER>>;
export interface ApplicationCommandOptionsMentionable extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.MENTIONABLE> {}
export type ApplicationCommandOptionsNumber = ApplicationCommandOptionBase<ApplicationCommandOptionTypes.NUMBER> & Types.Shared.ExclusifyUnion<ApplicationCommandOptionsAutocomplete | ApplicationCommandOptionsMinMaxValue | ApplicationCommandOptionsChoices<ApplicationCommandOptionTypes.NUMBER>>;
export interface ApplicationCommandOptionsRole extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.ROLE> {}
export type ApplicationCommandOptionsString = ApplicationCommandOptionBase<ApplicationCommandOptionTypes.STRING> & Types.Shared.ExclusifyUnion<(ApplicationCommandOptionsAutocomplete & ApplicationCommandOptionsMinMaxLength) | ApplicationCommandOptionsChoices<ApplicationCommandOptionTypes.STRING>>;
export interface ApplicationCommandOptionsUser extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.USER> {}

// desc, options
export interface CreateApplicationCommandOptionsBase<T extends ApplicationCommandTypes = ApplicationCommandTypes> {
    /** The interaction contexts where the command can be used. Defaults to all interaction context types for new commands. */
    contexts?: Array<InteractionContextTypes>;
    /** The default member permissions for the command. */
    defaultMemberPermissions?: string | null;
    /**
     * If the command can be used in a DM.
     * @deprecated Use contexts instead.
     */
    dmPermission?: boolean | null;
    /** The ID of the command, if known. (Only usable when bulkEditing guild commands.) */
    id?: string;
    /** The install contexts where the command is available. Defaults to {@link Constants~ApplicationIntegrationTypes.GUILD_INSTALL | GUILD_INSTALL}. */
    integrationTypes?: Array<ApplicationIntegrationTypes>;
    /** The name of the command. */
    name: string;
    /** A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names. */
    nameLocalizations?: LocaleMap | null;
    /** Whether the command is age restricted. */
    nsfw?: boolean;
    /** The type of the command. */
    type: T;
}

export type CreateApplicationCommandOptions = CreateChatInputApplicationCommandOptions | CreateUserApplicationCommandOptions | CreateMessageApplicationCommandOptions | CreatePrimaryEntryPointApplicationCommandOptions;
export interface CreateGuildChatInputApplicationCommandOptions extends Omit<CreateChatInputApplicationCommandOptions, "dmPermission" | "integrationTypes" | "contexts"> {}
export interface CreateGuildUserApplicationCommandOptions extends Omit<CreateUserApplicationCommandOptions, "dmPermission" | "integrationTypes" | "contexts"> {}
export interface CreateGuildMessageApplicationCommandOptions extends Omit<CreateMessageApplicationCommandOptions, "dmPermission" | "integrationTypes" | "contexts"> {}
export type CreateGuildApplicationCommandOptions = CreateGuildChatInputApplicationCommandOptions | CreateGuildUserApplicationCommandOptions | CreateGuildMessageApplicationCommandOptions;
export interface CreateChatInputApplicationCommandOptions extends CreateApplicationCommandOptionsBase<ApplicationCommandTypes.CHAT_INPUT> {
    /** The description of the command. */
    description: string;
    /** A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized descriptions. */
    descriptionLocalizations?: LocaleMap | null;
    /** See [Discord's docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure) for more information. Convert `snake_case` keys to `camelCase`. */
    options?: Array<ApplicationCommandOptions>;
}

export interface CreateUserApplicationCommandOptions extends CreateApplicationCommandOptionsBase<ApplicationCommandTypes.USER> {}
export interface CreateMessageApplicationCommandOptions extends CreateApplicationCommandOptionsBase<ApplicationCommandTypes.MESSAGE> {}
export interface CreatePrimaryEntryPointApplicationCommandOptions extends CreateApplicationCommandOptionsBase<ApplicationCommandTypes.PRIMARY_ENTRY_POINT> {
    handler: EntryPointCommandHandlerTypes;
}

export type EditApplicationCommandOptions = EditChatInputApplicationCommandOptions | EditUserApplicationCommandOptions | EditMessageApplicationCommandOptions | EditPrimaryEntryPointApplicationCommandOptions;
export interface EditChatInputApplicationCommandOptions extends Partial<Omit<CreateChatInputApplicationCommandOptions, "type">> {}
export interface EditUserApplicationCommandOptions extends Partial<Omit<CreateUserApplicationCommandOptions, "type">> {}
export interface EditMessageApplicationCommandOptions extends Partial<Omit<CreateMessageApplicationCommandOptions, "type">> {}
export interface EditPrimaryEntryPointApplicationCommandOptions extends Partial<Omit<CreatePrimaryEntryPointApplicationCommandOptions, "type">> {}

export type EditGuildApplicationCommandOptions = EditGuildChatInputApplicationCommandOptions | EditGuildUserApplicationCommandOptions | EditGuildMessageApplicationCommandOptions;
export interface EditGuildChatInputApplicationCommandOptions extends Partial<Omit<CreateChatInputApplicationCommandOptions, "type" | "dmPermission" | "integrationTypes" | "contexts">> {}
export interface EditGuildUserApplicationCommandOptions extends Partial<Omit<CreateUserApplicationCommandOptions, "type" | "dmPermission" | "integrationTypes" | "contexts">> {}
export interface EditGuildMessageApplicationCommandOptions extends Partial<Omit<CreateMessageApplicationCommandOptions, "type" | "dmPermission" | "integrationTypes" | "contexts">> {}

export interface RawGuildApplicationCommandPermissions {
    application_id: string;
    guild_id: string;
    id: string;
    permissions: Array<ApplicationCommandPermission>;
}

export interface RESTGuildApplicationCommandPermissions {
    applicationID: string;
    guildID: string;
    id: string;
    permissions: Array<ApplicationCommandPermission>;
}
export interface GuildApplicationCommandPermissions {
    application?: ClientApplication;
    applicationID: string;
    id: string;
    permissions: Array<ApplicationCommandPermission>;
}

export interface ApplicationCommandPermission {
    /** The id of the role, user, channel, or a [permission constant](https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permissions-constants). */
    id: string;
    /** If the permission is allowed. */
    permission: boolean;
    /** The [type](https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permission-type) of permission */
    type: ApplicationCommandPermissionTypes;
}

export interface EditApplicationCommandPermissionsOptions {
    /** If the overall authorization of this rest instance is not a bearer token, a bearer token can be supplied via this option. */
    accessToken?: string;
    /** The permissions to set for the command. */
    permissions: Array<ApplicationCommandPermission>;
}

export type TypeToEdit<T extends ApplicationCommandTypes> =
T extends ApplicationCommandTypes.CHAT_INPUT ? EditChatInputApplicationCommandOptions :
    T extends ApplicationCommandTypes.USER ? EditUserApplicationCommandOptions :
        T extends ApplicationCommandTypes.MESSAGE ? EditMessageApplicationCommandOptions :
            never;


export interface GetApplicationCommandOptions {
    /** The [locale](https://discord.com/developers/docs/reference#locales) to receive localized responses for (`descriptionLocalized`, `nameLocalized`). If no localization for the locale is present, the properties will not be present. */
    locale?: string;
    /** If localizations should be included. */
    withLocalizations?: boolean;
}

export type Locale =
    "id" |
    "da" |
    "de" |
    "en-GB" |
    "en-US" |
    "es-ES" |
    "es-419" |
    "fr" |
    "hr" |
    "it" |
    "lt" |
    "hu" |
    "nl" |
    "no" |
    "pl" |
    "pt-BR" |
    "ro" |
    "fi" |
    "sv-SE" |
    "vi" |
    "tr" |
    "cs" |
    "el" |
    "bg" |
    "ru" |
    "uk" |
    "hi" |
    "th" |
    "zh-CN" |
    "ja" |
    "zh-TW" |
    "ko";
export type LocaleMap = Partial<Record<Locale, string>>;

export interface CreateTestEntitlementOptions {
    /** The ID of the owner of the test entitlement, a user or guild. */
    ownerID: string;
    /** The type of the owner of the entitlement. */
    ownerType: EntitlementOwnerTypes;
    /** The ID of the SKU to create an entitlement for. */
    skuID: string;
}

export interface RawBaseEntitlement {
    application_id: string;
    consumed: boolean;
    deleted: boolean;
    gift_code_flags: number;
    guild_id: string | null;
    id: string;
    promotion_id: string | null;
    sku_id: string;
    type: EntitlementTypes;
    user_id: string | null;
}

export interface RawEntitlement extends RawBaseEntitlement {
    ends_at: string | null;
    starts_at: string | null;
    subscription_id: string;
}

export interface RawTestEntitlement extends RawBaseEntitlement {}

export interface SearchEntitlementsOptions {
    after?: string;
    before?: string;
    excludeDeleted?: boolean;
    excludeEnded?: boolean;
    guildID?: string;
    limit?: number;
    skuIDs?: Array<string>;
    userID?: string;
}

export interface RawSKU {
    access_type: SKUAccessTypes; // undocumented, guessed
    application_id: string;
    dependent_sku_id: string | null;
    features: []; // undocumented
    flags: number;
    id: string;
    manifest_labels: null; // undocumented
    name: string;
    release_date: null; // undocumented
    show_age_gate: boolean;
    slug: string;
    type: SKUTypes;
}

export interface EditApplicationOptions {
    /** The cover image for the application. */
    coverImage?: string | Buffer | null;
    /** The default authorization url shown in Discord. */
    customInstallURL?: string;
    /** The description of the application. */
    description?: string;
    eventWebhooksStatus?: Exclude<ApplicationEventWebhookStatus, ApplicationEventWebhookStatus.DISABLED_BY_DISCORD>;
    eventWebhooksTypes?: Array<ApplicationEventWebhookEventType>;
    eventWebhooksURL?: string | null;
    /** The [public flags](https://discord.com/developers/docs/resources/application#application-object-application-flags) of the application. */
    flags?: number;
    /** The icon for the application. */
    icon?: string | Buffer | null;
    /** The install parameters of the application. */
    installParams?: Types.OAuth.InstallParams;
    integrationTypesConfig?: IntegrationTypesConfig;
    /** The url where the application receives interactions. Must be valid according to Discord's [Receiving an interaction](https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction) documentation. */
    interactionsEndpointURL?: string;
    /** The role connection verification url for the application. */
    roleConnectionsVerificationURL?: string;
    /** The tags for the application. Max 5 per application, 20 characters each. */
    tags?: Array<string>;
}

export interface RawApplicationEmoji extends Required<Omit<Types.Misc.Emoji, "user" | "id">>  { id: string; user?: Types.Users.RawUser; }
export interface ApplicationEmoji extends Omit<RawApplicationEmoji, "user" | "id" | "require_colons"> { id: string; requireColons?: boolean; user?: User; }

export interface RawApplicationEmojis {
    items: Array<RawApplicationEmoji>;
}

export interface ApplicationEmojis {
    items: Array<ApplicationEmoji>;
}

export interface CreateApplicationEmojiOptions {
    /** The image (buffer, or full data url). */
    image: Buffer | string;
    /** The name of the emoji (must be unique). */
    name: string;
}

export interface EditApplicationEmojiOptions {
    name: string;
}

export interface RawSubscription {
    canceled_at: string | null;
    country?: string;
    current_period_end: string;
    current_period_start: string;
    entitlement_ids: Array<string>;
    id: string;
    renewal_sku_ids: Array<string>;
    sku_ids: Array<string>;
    status: SubscriptionStatuses;
    user_id: string;
}

export interface SearchSKUSubscriptions {
    after?: string;
    before?: string;
    limit?: number;
    /** Required except for OAuth queries. */
    userID?: string;
}

export interface RawActivityInstance {
    application_id: string;
    instance_id: string;
    launch_id: string;
    location: RawActivityLocation;
    users: Array<string>;
}


export interface RawActivityLocation {
    channel_id: string;
    guild_id?: string | null;
    id: string;
    kind: ActivityLocationKind;
}

export interface ActivityInstance {
    /** Application ID. */
    applicationID: string;
    /** Activity Instance ID. */
    instanceID: string;
    /** Unique identifier for the launch. */
    launchID: string;
    /** Location the instance is runnning in. */
    location: ActivityLocation;
    /** IDs of the Users currently connected to the instance. */
    users: Array<string>;
}


export interface ActivityLocation {
    /**	ID of the Channel. */
    channelID: string;
    /** ID of the Guild. */
    guildID?: string | null;
    /** Unique identifier for the location. */
    id: string;
    /**	Enum describing kind of location. `gc` = guild channel, `pc` = private channel (dm, gdm). */
    kind: ActivityLocationKind;
}
