/** @module Types/JSON */
import type * as Types from "./namespaced";
/* eslint-disable @typescript-eslint/no-empty-interface */
import type { InstallParams } from "./oauth";
import type { ApplicationCompany, ApplicationExecutable, EmbeddedActivityConfig, IntegrationTypesConfig } from "./applications";
import type { Uncached } from "./shared";
import type {
    ApplicationCommandTypes,
    AutoModerationEventTypes,
    AutoModerationTriggerTypes,
    ChannelTypes,
    DefaultMessageNotificationLevels,
    ExplicitContentFilterLevels,
    GuildFeature,
    GuildNSFWLevels,
    IntegrationExpireBehaviors,
    IntegrationType,
    InteractionTypes,
    InviteTargetTypes,
    MessageTypes,
    MFALevels,
    OverwriteTypes,
    PremiumTiers,
    RESTMethod,
    GuildScheduledEventEntityTypes,
    GuildScheduledEventPrivacyLevels,
    GuildScheduledEventStatuses,
    ThreadAutoArchiveDuration,
    VerificationLevels,
    VideoQualityModes,
    WebhookTypes,
    SortOrderTypes,
    StageInstancePrivacyLevels,
    ForumLayoutTypes,
    EntitlementTypes,
    ApplicationIntegrationTypes,
    InteractionContextTypes,
    PollLayoutType,
    ApplicationDiscoverabilityState,
    ApplicationEventWebhookEventType,
    ApplicationEventWebhookStatus,
    ApplicationExplicitContentFilterLevel,
    ApplicationInternalGuildRestriction,
    ApplicationMonetizationState,
    ApplicationType,
    ApprovableConsoleType,
    PricingLocalizationStrategy,
    RPCApplicationState,
    SKUAccessTypes,
    SKUTypes,
    StoreApplicationState,
    ApplicationVerificationState,
    ApplicationInteractionsVersion,
    EntryPointCommandHandlerTypes,
    SubscriptionStatuses
} from "../Constants";

export interface JSONAnnouncementChannel extends JSONThreadableChannel {
    rateLimitPerUser: 0;
    type: ChannelTypes.GUILD_ANNOUNCEMENT;
}
export interface JSONAnnouncementThreadChannel extends JSONThreadChannel {
    threadMetadata: Types.Channels.ThreadMetadata;
    type: ChannelTypes.ANNOUNCEMENT_THREAD;
}
export interface JSONApplication extends JSONClientApplication {
    aliases?: Array<string>;
    approvedConsoles?: Array<ApprovableConsoleType>;
    approximateGuildCount?: number;
    approximateUserAuthorizationCount?: number;
    approximateUserInstallCount?: number;
    botApproximateGuildCount?: number;
    botDisabled?: boolean;
    botPublic?: boolean;
    botQuarantined?: boolean;
    botRequireCodeGrant?: boolean;
    connectionEntrypointURL?: string;
    coverImage?: string | null;
    creatorMonetizationState?: number;
    customInstallURL?: string;
    deeplinkURI?: string;
    description: string;
    developers?: Array<ApplicationCompany>;
    discoverabilityState?: ApplicationDiscoverabilityState;
    discoveryEligibilityFlags?: number;
    embeddedActivityConfig?: EmbeddedActivityConfig;
    eulaID?: string;
    eventWebhooksStatus?: ApplicationEventWebhookStatus;
    eventWebhooksTypes?: Array<ApplicationEventWebhookEventType>;
    eventWebhooksURL?: string | null;
    executables?: Array<ApplicationExecutable>;
    explicitContentFilter?: ApplicationExplicitContentFilterLevel;
    guild: JSONOAuthGuild | null;
    guildID?: string | null;
    hook: boolean;
    icon: string | null;
    installParams?: InstallParams;
    integrationPublic?: boolean;
    integrationRequireCodeGrant?: boolean;
    integrationTypes?: Array<ApplicationIntegrationTypes>;
    integrationTypesConfig?: IntegrationTypesConfig;
    interactionsEndpointURL?: string | null;
    interactionsEventTypes?: Array<string>;
    interactionsVersion?: ApplicationInteractionsVersion;
    internalGuildRestriction?: ApplicationInternalGuildRestriction;
    isDiscoverable: boolean;
    isMonetized: boolean;
    isVerified: boolean;
    maxParticipants?: number;
    monetizationEligibilityFlags?: number;
    monetizationState?: ApplicationMonetizationState;
    name: string;
    overlay?: boolean;
    overlayCompatibilityHook?: boolean;
    overlayMethods?: number;
    overlayWarn?: boolean;
    owner: JSONUser | null;
    parentID?: string;
    pricingLocalizationStrategy?: PricingLocalizationStrategy;
    primarySKUID?: string;
    privacyPolicyURL?: string;
    publishers?: Array<ApplicationCompany>;
    redirectURIs?: Array<string>;
    roleConnectionsVerificationURL?: string | null;
    rpcApplicationState?: RPCApplicationState;
    rpcOrigins?: Array<string>;
    slug?: string;
    storeApplicationState?: StoreApplicationState;
    storefrontAvailable: boolean;
    tags?: Array<string>;
    team: JSONTeam | null;
    termsOfServiceURL?: string;
    thirdPartySKUs?: Array<JSONSKU>;
    type: ApplicationType | null;
    verificationState?: ApplicationVerificationState;
    verifyKey: string;
}
export interface JSONApplicationCommand extends JSONBase {
    applicationID: string;
    contexts: Array<InteractionContextTypes>;
    defaultMemberPermissions?: JSONPermission;
    description: string;
    descriptionLocalizations?: Types.Applications.LocaleMap | null;
    dmPermission?: boolean;
    guildID?: string;
    handler?: EntryPointCommandHandlerTypes;
    integrationTypes: Array<ApplicationIntegrationTypes>;
    name: string;
    nameLocalizations?: Types.Applications.LocaleMap | null;
    nsfw?: boolean;
    options?: Array<Types.Applications.ApplicationCommandOptions>;
    type: ApplicationCommandTypes;
    version: string;
}
export interface JSONAttachment extends JSONBase {
    application?: JSONApplication;
    clipCreatedAt?: string;
    clipParticipants?: Array<JSONUser>;
    contentType?: string;
    description?: string;
    durationSecs?: number;
    ephemeral?: boolean;
    filename: string;
    flags: number;
    height?: number;
    placeholder?: string;
    placeholderVersion?: number;
    proxyURL: string;
    size: number;
    title?: string;
    url: string;
    waveform?: string;
    width?: number;
}
export interface JSONAutocompleteInteraction extends JSONInteraction {
    appPermissions: JSONPermission;
    attachmentSizeLimit: number;
    authorizingIntegrationOwners: Types.Interactions.AuthorizingIntegrationOwners;
    channelID: string;
    context?: InteractionContextTypes;
    data: Types.Interactions.AutocompleteInteractionData;
    guildID?: string;
    guildLocale?: string;
    locale: string;
    member?: JSONMember;
    type: InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE;
    user: JSONUser;
}
export interface JSONAutoModerationRule extends JSONBase {
    actions: Array<Types.AutoModeration.AutoModerationAction>;
    creatorID: string;
    enabled: boolean;
    eventType: AutoModerationEventTypes;
    exemptChannels: Array<string>;
    exemptRoles: Array<string>;
    guildID: string;
    name: string;
    triggerMetadata: Types.AutoModeration.TriggerMetadata;
    triggerType: AutoModerationTriggerTypes;
}
export interface JSONBase {
    createdAt: number;
    id: string;
}
export interface JSONBaseEntitlement extends JSONBase {
    applicationID: string;
    consumed: boolean;
    deleted: boolean;
    giftCodeFlags: number;
    guildID: string | null;
    promotionID: string | null;
    skuID: string;
    type: EntitlementTypes;
    userID: string | null;
}
export interface JSONCategoryChannel extends JSONGuildChannel {
    channels: Array<string>;
    permissionOverwrites: Array<JSONPermissionOverwrite>;
    position: number;
    type: ChannelTypes.GUILD_CATEGORY;
}
export interface JSONChannel extends JSONBase {
    flags: number;
    type: ChannelTypes;
}
export interface JSONClientApplication extends JSONBase {
    flags: number;
    flagsNew: bigint;
}
export interface JSONClientUser extends JSONUser {
    email: string | null;
    flags: number;
    locale: string;
    mfaEnabled: boolean;
    verified: boolean;
}
export interface JSONCommandInteraction extends JSONInteraction {
    appPermissions: JSONPermission;
    attachmentSizeLimit: number;
    authorizingIntegrationOwners: Types.Interactions.AuthorizingIntegrationOwners;
    channelID: string;
    context?: InteractionContextTypes;
    data: Types.Interactions.ApplicationCommandInteractionData;
    guildID?: string;
    guildLocale?: string;
    locale: string;
    member?: JSONMember;
    type: InteractionTypes.APPLICATION_COMMAND;
    user: JSONUser;
}
export interface JSONComponentInteraction extends JSONInteraction {
    appPermissions: JSONPermission;
    attachmentSizeLimit: number;
    authorizingIntegrationOwners: Types.Interactions.AuthorizingIntegrationOwners;
    channelID: string;
    context?: InteractionContextTypes;
    data: Types.Interactions.MessageComponentButtonInteractionData | Types.Interactions.MessageComponentSelectMenuInteractionData;
    guildID?: string;
    guildLocale?: string;
    locale: string;
    member?: JSONMember;
    type: InteractionTypes.MESSAGE_COMPONENT;
    user: JSONUser;
}
export interface JSONEntitlement extends JSONBaseEntitlement {
    endsAt: number | null;
    startsAt: number | null;
    subscriptionID: string;
}
export interface JSONDiscordHTTPError {
    message: string;
    method: RESTMethod;
    name: string;
    resBody: Record<string, unknown> | null;
    stack: string;
}
export interface JSONDiscordRESTError {
    message: string;
    method: RESTMethod;
    name: string;
    resBody: Record<string, unknown> | null;
    stack: string;
}
export interface JSONExtendedUser extends JSONUser {
    email: string | null;
    flags: number;
    locale?: string;
    mfaEnabled: boolean;
    verified: boolean;
}
export interface JSONForumChannel extends JSONThreadOnlyChannel {
    type: ChannelTypes.GUILD_FORUM;
}
export interface JSONGroupChannel extends JSONChannel {
    applicationID: string;
    icon: string | null;
    lastMessageID: string | null;
    lastPinTimestamp: string | null;
    managed: boolean;
    name: string | null;
    nicks: Array<Record<"id" | "nick", string>>;
    ownerID: string;
    recipients: Array<JSONUser>;
    type: ChannelTypes.GROUP_DM;
}
export interface JSONGuild extends JSONBase {
    afkChannelID: string | null;
    afkTimeout: number;
    application?: string;
    approximateMemberCount?: number;
    approximatePresenceCount?: number;
    autoModerationRules: Array<JSONAutoModerationRule>;
    banner: string | null;
    channels: Array<string>;
    defaultMessageNotifications: DefaultMessageNotificationLevels;
    description: string | null;
    discoverySplash: string | null;
    emojis: Array<Types.Guilds.GuildEmoji>;
    explicitContentFilter: ExplicitContentFilterLevels;
    features: Array<GuildFeature>;
    icon: string | null;
    incidentActions: Types.Guilds.IncidentActions | null;
    joinedAt: number | null;
    large: boolean;
    maxMembers?: number;
    maxPresences?: number;
    maxStageVideoChannelUsers?: number;
    maxVideoChannelUsers?: number;
    memberCount: number;
    members: Array<string>;
    mfaLevel: MFALevels;
    name: string;
    nsfwLevel: GuildNSFWLevels;
    ownerID: string | null;
    preferredLocale: string;
    premiumProgressBarEnabled: boolean;
    premiumSubscriptionCount?: number;
    premiumTier: PremiumTiers;
    profile: Types.Guilds.GuildProfile | null;
    publicUpdatesChannelID: string | null;
    region?: string | null;
    roles: Array<JSONRole>;
    rulesChannelID: string | null;
    scheduledEvents: Array<JSONScheduledEvent>;
    splash: string | null;
    stageInstances: Array<JSONStageInstance>;
    stickers?: Array<Types.Guilds.Sticker>;
    systemChannelFlags: number;
    systemChannelID: string | null;
    threads: Array<string>;
    unavailable: boolean;
    vanityURLCode: string | null;
    verificationLevel: VerificationLevels;
    voiceStates: Array<JSONVoiceState>;
    welcomeScreen?: Types.Guilds.WelcomeScreen;
    widgetChannelID: string | null;
    widgetEnabled?: boolean;
}
export interface JSONGuildChannel extends JSONChannel {
    guildID: string;
    name: string;
    parentID: string | null;
    type: Types.Channels.GuildChannels;
}
export interface JSONGuildPreview extends JSONBase {
    approximateMemberCount: number;
    approximatePresenceCount: number;
    description: string | null;
    discoverySplash: string | null;
    emojis: Array<Types.Guilds.GuildEmoji>;
    features: Array<GuildFeature>;
    icon: string | null;
    name: string;
    splash: string | null;
    stickers: Array<Types.Guilds.RawSticker>;
}
export interface JSONGuildTemplate {
    code: string;
    createdAt: number;
    creator: JSONUser;
    description: string | null;
    isDirty: boolean | null;
    name: string;
    serializedSourceGuild: Partial<Types.Guilds.RawGuild>;
    sourceGuildID: string;
    updatedAt: number;
    usageCount: number;
}
export interface JSONIntegration extends JSONBase {
    account: Types.Guilds.IntegrationAccount;
    application?: JSONPartialApplication;
    enableEmoticons?: boolean;
    enabled?: boolean;
    expireBehavior?: IntegrationExpireBehaviors;
    expireGracePeriod?: number;
    name: string;
    revoked?: boolean;
    roleID: string | null;
    scopes?: Array<string>;
    subscriberCount?: number;
    syncedAt?: number;
    syncing?: boolean;
    type: IntegrationType;
    user?: JSONUser;
}
export interface JSONLobby extends JSONBase {
    applicationID: string;
    linkedChannel?: JSONGuildChannel | Uncached;
    members: Array<JSONLobbyMember>;
    metadata?: Record<string, string> | null;
}
export interface JSONLobbyMember extends JSONBase {
    flags?: number;
    lobbyID: string;
    metadata?: Record<string, string> | null;
}
export interface JSONInteraction extends JSONBase {
    applicationID: string;
    type: InteractionTypes;
    version: 1;
}
export interface JSONInteractionResolvedChannel extends JSONChannel {
    appPermissions: JSONPermissions;
    name: string | null;
    parentID: string | null;
    permissions: JSONPermissions;
    threadMetadata: Types.Channels.ThreadMetadata | Types.Channels.PrivateThreadMetadata | null;
    type: Types.Channels.ImplementedChannels;
}
export interface JSONInvite {
    approximateMemberCount?: number;
    approximatePresenceCount?: number;
    channelID?: string;
    code: string;
    createdAt?: number;
    expiresAt?: number;
    guild?: JSONInviteGuild;
    guildID?: string;
    guildScheduledEvent?: JSONScheduledEvent;
    inviter?: JSONUser;
    maxAge?: number;
    maxUses?: number;
    roles?: Array<JSONInviteRole>;
    stageInstance?: {
        members: Array<string>;
        participantCount: number;
        speakerCount: number;
        topic: string;
    };
    targetApplication?: JSONPartialApplication;
    targetType?: InviteTargetTypes;
    targetUser?: JSONUser;
    temporary?: boolean;
    uses?: number;
}
export interface JSONInviteGuild extends JSONBase {
    banner: string | null;
    description: string | null;
    features: Array<GuildFeature>;
    icon: string | null;
    name: string;
    nsfwLevel: GuildNSFWLevels;
    premiumSubscriptionCount?: number;
    splash: string | null;
    vanityURLCode: string | null;
    verificationLevel: VerificationLevels;
}
export interface JSONInviteRole extends JSONBase {
    /** @deprecated */
    color: number;
    colors: Types.Guilds.RoleColors;
    guild: JSONInviteGuild;
    guildID: string;
    icon: string | null;
    name: string;
    permissions: JSONPermission;
    position: number;
    unicodeEmoji: string | null;
}
export interface JSONMediaChannel extends JSONThreadOnlyChannel {
    type: ChannelTypes.GUILD_MEDIA;
}
export interface JSONMember extends JSONBase {
    avatar: string | null;
    avatarDecorationData: Types.Users.AvatarDecorationData | null;
    banner: string | null;
    communicationDisabledUntil: number | null;
    deaf: boolean;
    flags?: number;
    guildID: string;
    isPending?: boolean;
    joinedAt: number | null;
    mute: boolean;
    nick: string | null;
    pending: boolean;
    premiumSince: number | null;
    presence?: Types.Guilds.Presence;
    roles: Array<string>;
    user: JSONUser;
}
export interface JSONMessage extends JSONBase {
    activity?: Types.Channels.MessageActivity;
    applicationID?: string;
    attachments: Array<JSONAttachment>;
    author: JSONUser;
    channelID: string;
    components?: Array<Types.Channels.MessageComponent>;
    content: string;
    editedTimestamp: number | null;
    embeds: Array<Types.Channels.Embed>;
    flags?: number;
    guildID?: string;
    /** @deprecated Use {@link JSON/JSONMessage#interactionMetadata | JSONMessage#interactionMetadata } instead. */
    interaction?: {
        id: string;
        member?: JSONMember;
        name: string;
        type: InteractionTypes;
        user: JSONUser;
    };
    interactionMetadata?: {
        authorizingIntegrationOwners: Types.Interactions.AuthorizingIntegrationOwners;
        id: string;
        interactedMessageID?: string;
        name?: string;
        originalResponseMessageID?: string;
        targetMessageID?: string;
        targetUser?: JSONUser;
        triggeringInteractionMetadata?: {
            authorizingIntegrationOwners: Types.Interactions.AuthorizingIntegrationOwners;
            id: string;
            interactedMessageID?: string;
            originalResponseMessageID?: string;
            targetMessageID?: string;
            targetUser?: JSONUser;
            type: InteractionTypes;
            user: JSONUser;
        };
        type: InteractionTypes;
        user: JSONUser;
    };
    mentionChannels?: Array<Types.Channels.ChannelMention>;
    mentions: {
        channels: Array<string>;
        everyone: boolean;
        members: Array<JSONMember>;
        roles: Array<string>;
        users: Array<JSONUser>;
    };
    messageReference?: Types.Channels.MessageReference;
    messageSnapshots?: Array<{
        message: {
            attachments: Array<JSONAttachment>;
            content: string;
            editedTimestamp: number | null;
            embeds: Array<Types.Channels.Embed>;
            flags: number;
            mentions: {
                channels: Array<string>;
                roles: Array<string>;
                users: Array<JSONUser>;
            };
            timestamp: number;
            type: MessageTypes;
        };
    }>;
    nonce?: number | string;
    pinned: boolean;
    poll?: JSONPoll;
    pollResults?: Types.Channels.MessagePollResults;
    position?: number;
    reactions: Array<Types.Channels.MessageReaction>;
    referencedMessage?: JSONMessage | null;
    stickerItems?: Array<Types.Channels.StickerItem>;
    thread?: JSONAnnouncementThreadChannel | JSONPublicThreadChannel | JSONPrivateThreadChannel;
    timestamp: number;
    tts: boolean;
    type: MessageTypes;
    webhook?: string;
}
export interface JSONModalSubmitInteraction extends JSONInteraction {
    appPermissions: JSONPermission;
    attachmentSizeLimit: number;
    authorizingIntegrationOwners: Types.Interactions.AuthorizingIntegrationOwners;
    channelID: string;
    context?: InteractionContextTypes;
    data: Types.Interactions.ModalSubmitInteractionData;
    guildID?: string;
    guildLocale?: string;
    locale: string;
    member?: JSONMember;
    type: InteractionTypes.MODAL_SUBMIT;
    user: JSONUser;
}
export interface JSONOAuthApplication extends JSONBase {
    botPublic: boolean;
    botRequireCodeGrant: boolean;
    coverImage: string | null;
    customInstallURL?: string;
    description: string;
    flags: number;
    guildID: string | null;
    icon: string | null;
    installParams?: Types.OAuth.InstallParams;
    integrationTypes: Array<ApplicationIntegrationTypes>;
    integrationTypesConfig?: Types.Applications.IntegrationTypesConfig;
    name: string;
    owner: JSONUser;
    ownerID: string;
    primarySKUID?: string;
    privacyPolicyURL?: string;
    roleConnectionsVerificationURL?: string;
    rpcOrigins: Array<string>;
    slug?: string;
    tags?: Array<string>;
    team: JSONTeam | null;
    termsOfServiceURL?: string;
    type: number | null;
    verifyKey: string;
}
export interface JSONOAuthGuild extends JSONBase {
    approximateMemberCount?: number;
    approximatePresenceCount?: number;
    banner: string | null;
    features: Array<GuildFeature>;
    icon: string | null;
    name: string;
    owner: boolean;
    permissions: JSONPermission;
}
export interface JSONPartialApplication extends JSONBase {
    botPublic?: boolean;
    botRequireCodeGrant?: boolean;
    description: string;
    icon: string | null;
    name: string;
    verifyKey?: string;
}
export interface JSONPermission {
    allow: string;
    deny: string;
}
export interface JSONPermissionOverwrite extends JSONBase {
    permission: JSONPermission;
    type: OverwriteTypes;
}
export interface JSONPingInteraction extends JSONInteraction {
    type: InteractionTypes.PING;
}
export interface JSONPoll {
    allowMultiselect: boolean;
    answers: Array<Types.Channels.PollAnswer>;
    expiry: string;
    layoutType: PollLayoutType;
    question: Types.Channels.PollQuestion;
    results: Types.Channels.PollResults;
}
export interface JSONPrimaryGuild {
    badge: string | null;
    identityEnabled: boolean | null;
    identityGuildID: string | null;
    tag: string | null;
}
export interface JSONPrivateChannel extends JSONChannel {
    lastMessageID: string | null;
    lastPinTimestamp: string | null;
    messages: Array<string>;
    recipient: JSONUser;
    type: ChannelTypes.DM;
}
export interface JSONPrivateThreadChannel extends JSONThreadChannel {
    threadMetadata: Types.Channels.PrivateThreadMetadata;
    type: ChannelTypes.PRIVATE_THREAD;
}
export interface JSONPublicThreadChannel extends JSONThreadChannel {
    appliedTags: Array<string>;
    threadMetadata: Types.Channels.ThreadMetadata;
    type: ChannelTypes.PUBLIC_THREAD;
}
export interface JSONRole extends JSONBase {
    /** @deprecated */
    color: number;
    colors: Types.Guilds.RoleColors;
    guildID: string;
    hoist: boolean;
    icon: string | null;
    managed: boolean;
    mentionable: boolean;
    name: string;
    permissions: JSONPermission;
    position: number;
    tags: Types.Guilds.RoleTags;
    unicodeEmoji: string | null;
}
export interface JSONScheduledEvent extends JSONBase {
    channelID: string | null;
    creator?: JSONUser;
    description?: string | null;
    entityID: string | null;
    entityMetadata: Types.ScheduledEvents.ScheduledEventEntityMetadata | null;
    entityType: GuildScheduledEventEntityTypes;
    guildID: string;
    image?: string | null;
    name: string;
    privacyLevel: GuildScheduledEventPrivacyLevels;
    scheduledEndTime: number | null;
    scheduledStartTime: number;
    status: GuildScheduledEventStatuses;
    userCount?: number;
}
export interface JSONSKU extends JSONBase {
    accessType: SKUAccessTypes;
    applicationID: string;
    dependentSKUID: string | null;
    features: [];
    flags: number;
    manifestLabels: null;
    name: string;
    releaseDate: null;
    showAgeGate: boolean;
    slug: string;
    type: SKUTypes;
}
export interface JSONSoundboard extends JSONBase {
    available: boolean;
    emojiID: string | null;
    emojiName: string | null;
    guildID?: string;
    name: string;
    soundID: string;
    user?: JSONUser;
    volume: number;
}
export interface JSONStageChannel extends JSONTextableVoiceChannel {
    type: ChannelTypes.GUILD_STAGE_VOICE;
}
export interface JSONStageInstance extends JSONBase {
    channelID: string;
    discoverableDisabled: boolean;
    guildID: string;
    privacyLevel: StageInstancePrivacyLevels;
    scheduledEventID: string | null;
    topic: string;
}
export interface JSONSubscription extends JSONBase {
    canceledAt: string | null;
    country?: string;
    currentPeriodEnd: string;
    currentPeriodStart: string;
    entitlementIDs: Array<string>;
    renewalSKUIDs: Array<string>;
    skuIDs: Array<string>;
    status: SubscriptionStatuses;
    userID: string;
}
export interface JSONTeam extends JSONBase {
    icon: string | null;
    members: Array<Types.Applications.TeamMember>;
    name: string;
    ownerID: string;
}
export interface JSONTestEntitlement extends JSONBaseEntitlement {}
export interface JSONTextableChannel extends JSONGuildChannel {
    lastMessageID: string | null;
    lastPinTimestamp: string | null;
    messages: Array<string>;
    nsfw: boolean;
    permissionOverwrites: Array<JSONPermissionOverwrite>;
    position: number;
    rateLimitPerUser: number;
    topic: string | null;
    type: Types.Channels.TextableGuildChannels;
}

export interface JSONTextableVoiceChannel extends JSONTextableChannel {
    bitrate: number;
    rtcRegion: string | null;
    type: Types.Channels.VoiceChannels;
    userLimit: number;
    videoQualityMode: VideoQualityModes;
    voiceMembers: Array<string>;
}

export interface JSONTextChannel extends JSONThreadableChannel {
    type: ChannelTypes.GUILD_TEXT;
}
export interface JSONThreadableChannel extends JSONTextableChannel {
    defaultAutoArchiveDuration: ThreadAutoArchiveDuration;
    threads: Array<string>;
    type: ChannelTypes.GUILD_TEXT | ChannelTypes.GUILD_ANNOUNCEMENT;
}
export interface JSONThreadChannel extends JSONGuildChannel {
    flags: number;
    lastMessageID: string | null;
    memberCount: number;
    messageCount: number;
    messages: Array<string>;
    ownerID: string;
    rateLimitPerUser: number;
    threadMetadata: Types.Channels.ThreadMetadata | Types.Channels.PrivateThreadMetadata;
    totalMessageSent: number;
    type: Types.Channels.ThreadChannels;
}
export interface JSONThreadOnlyChannel extends JSONGuildChannel {
    availableTags: Array<Types.Channels.ForumTag>;
    defaultAutoArchiveDuration: ThreadAutoArchiveDuration;
    defaultForumLayout: ForumLayoutTypes;
    defaultReactionEmoji: Types.Channels.ForumEmoji | null;
    defaultSortOrder: SortOrderTypes | null;
    defaultThreadRateLimitPerUser: number;
    flags: number;
    lastThreadID: string | null;
    permissionOverwrites: Array<JSONPermissionOverwrite>;
    position: number;
    rateLimitPerUser: number;
    threads: Array<string>;
    topic: string | null;
    type: Types.Channels.ThreadOnlyChannels;
}
export interface JSONUnavailableGuild extends JSONBase {
    unavailable: true;
}
export interface JSONUser extends JSONBase {
    accentColor?: number | null;
    avatar: string | null;
    avatarDecorationData: Types.Users.AvatarDecorationData | null;
    banner?: string | null;
    bot: boolean;
    collectibles: Types.Users.Collectibles | null;
    discriminator: string;
    globalName: string | null;
    publicFlags: number;
    system: boolean;
    username: string;
}
export interface JSONVoiceChannel extends JSONTextableVoiceChannel {
    status: string | null;
    type: ChannelTypes.GUILD_VOICE;
}
export interface JSONVoiceState extends JSONBase {
    channelID: string | null;
    deaf: boolean;
    guildID?: string;
    member?: JSONMember;
    mute: boolean;
    requestToSpeakTimestamp: number | null;
    selfDeaf: boolean;
    selfMute: boolean;
    selfStream: boolean;
    selfVideo: boolean;
    sessionID: string;
    suppress: boolean;
    user?: JSONUser;
}
export interface JSONWebhook extends JSONBase {
    applicationID: string | null;
    avatar: string | null;
    channelID: string | null;
    guildID: string | null;
    name: string | null;
    sourceChannel?: Pick<Types.Channels.RawChannel, "id" | "name">;
    sourceGuild?: Pick<Types.Guilds.RawGuild, "id" | "name" | "icon">;
    token?: string;
    type: WebhookTypes;
    user?: JSONUser;
}
