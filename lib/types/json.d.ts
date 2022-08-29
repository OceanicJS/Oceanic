/* eslint-disable @typescript-eslint/no-empty-interface */
import type { InstallParams, TeamMember } from "./oauth";
import type { ApplicationCommandOptions } from "./application-commands";
import type {
    ApplicationCommandInteractionData,
    AutocompleteInteractionData,
    MessageComponentButtonInteractionData,
    MessageComponentSelectMenuInteractionData,
    ModalSubmitInteractionData
} from "./interactions";
import type { AutoModerationAction, TriggerMetadata } from "./auto-moderation";
import type {
    GuildEmoji,
    IntegrationAccount,
    RawGuild,
    RoleTags,
    Sticker,
    WelcomeScreen
} from "./guilds";
import type {
    ChannelMention,
    Embed,
    MessageActivity,
    MessageReference,
    RawChannel,
    StickerItem,
    MessageReaction,
    ThreadMetadata,
    PrivateThreadmetadata,
    MessageActionRow
} from "./channels";
import type { ScheduledEventEntityMetadata } from "./scheduled-events";
import type { Presence } from "./gateway";
import type {
    ApplicationCommandTypes,
    AutoModerationEventTypes,
    AutoModerationTriggerTypes,
    ChannelTypes,
    DefaultMessageNotificationLevels,
    ExplicitContentFilterLevels,
    GuildChannelTypes,
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
    PrivateChannelTypes,
    RESTMethod,
    GuildScheduledEventEntityTypes,
    GuildScheduledEventPrivacyLevels,
    GuildScheduledEventStatuses,
    TextChannelTypes,
    ThreadAutoArchiveDuration,
    ThreadChannelTypes,
    VerificationLevels,
    VideoQualityModes,
    WebhookTypes
} from "../Constants";

export interface JSONAnnouncementChannel extends JSONTextableChannel {
    rateLimitPerUser: 0;
    type: ChannelTypes.GUILD_ANNOUNCEMENT;
}
export interface JSONAnnouncementThreadChannel extends JSONThreadChannel {
    threadMetadata: ThreadMetadata;
    type: ChannelTypes.ANNOUNCEMENT_THREAD;
}
export interface JSONApplication extends JSONClientApplication {
    botPublic: boolean;
    botRequireCodeGrant: boolean;
    coverImage: string | null;
    customInstallURL?: string;
    description: string;
    guild?: string;
    icon: string | null;
    installParams?: InstallParams;
    name: string;
    owner: string;
    primarySKUID?: string;
    privacyPolicyURL?: string;
    rpcOrigins: Array<string>;
    slug?: string;
    tags?: Array<string>;
    team: JSONTeam | null;
    termsOfServiceURL?: string;
    verifyKey: string;
}
export interface JSONApplicationCommand extends JSONBase {
    application: string;
    defaultMemberPermissions?: JSONPermission;
    description: string;
    descriptionLocalizations?: Record<string, string> | null;
    dmPermission?: boolean;
    guild?: string;
    name: string;
    nameLocalizations?: Record<string, string> | null;
    options?: Array<ApplicationCommandOptions>;
    type: ApplicationCommandTypes;
    version: string;
}
export interface JSONAttachment extends JSONBase {
    contentType?: string;
    description?: string;
    ephemeral?: boolean;
    filename: string;
    height?: number;
    proxyURL: string;
    size: number;
    url: string;
    width?: number;
}
export interface JSONAutocompleteInteraction extends JSONInteraction {
    appPermissions?: JSONPermission;
    channel: string;
    data: AutocompleteInteractionData;
    guild?: string;
    guildLocale?: string;
    locale: string;
    member?: JSONMember;
    type: InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE;
    user: JSONUser;
}
export interface JSONAutoModerationRule extends JSONBase {
    actions: Array<AutoModerationAction>;
    creator: JSONUser | string;
    enabled: boolean;
    eventType: AutoModerationEventTypes;
    exemptChannels: Array<string>;
    exemptRoles: Array<string>;
    guild: string;
    name: string;
    triggerMetadata: TriggerMetadata;
    triggerType: AutoModerationTriggerTypes;
}
export interface JSONBase {
    createdAt: number;
    id: string;
}
export interface JSONCategoryChannel extends JSONGuildChannel {
    channels: Array<string>;
    permissionOverwrites: Array<JSONPermissionOverwrite>;
    position: number;
    type: ChannelTypes.GUILD_CATEGORY;
}
export interface JSONChannel extends JSONBase {
    type: ChannelTypes;
}
export interface JSONClientApplication extends JSONBase {
    flags: number;
}
export interface JSONClientUser extends JSONUser {
    email: string | null;
    flags: number;
    locale: string;
    mfaEnabled: boolean;
    verified: boolean;
}
export interface JSONCommandInteraction extends JSONInteraction {
    appPermissions?: JSONPermission;
    channel: string;
    data: ApplicationCommandInteractionData;
    guild?: string;
    guildLocale?: string;
    locale: string;
    member?: JSONMember;
    type: InteractionTypes.APPLICATION_COMMAND;
    user: JSONUser;
}
export interface JSONComponentInteraction extends JSONInteraction {
    appPermissions?: JSONPermission;
    channel: string;
    data: MessageComponentButtonInteractionData | MessageComponentSelectMenuInteractionData;
    guild?: string;
    guildLocale?: string;
    locale: string;
    member?: JSONMember;
    type: InteractionTypes.MESSAGE_COMPONENT;
    user: JSONUser;
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
export interface JSONGroupChannel extends JSONChannel {
    application: string;
    icon: string | null;
    managed: boolean;
    name: string | null;
    nicks?: Record<"id" | "nick", string>;
    owner: string | JSONUser;
    recipients: Array<JSONUser>;
    type: ChannelTypes.GROUP_DM;
}
export interface JSONGuild extends JSONBase {
    afkChannel: string | null;
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
    emojis: Array<GuildEmoji>;
    explicitContentFilter: ExplicitContentFilterLevels;
    features: Array<GuildFeature>;
    icon: string | null;
    joinedAt: number;
    large: boolean;
    maxMembers?: number;
    maxPresences?: number;
    maxVideoChannelUsers?: number;
    memberCount: number;
    members: Array<string>;
    mfaLevel: MFALevels;
    name: string;
    nsfwLevel: GuildNSFWLevels;
    owner: string;
    permissions?: JSONPermission;
    preferredLocale: string;
    premiumProgressBarEnabled: boolean;
    premiumSubscriptionCount?: number;
    premiumTier: PremiumTiers;
    publicUpdatesChannel: string | null;
    region?: string | null;
    roles: Array<JSONRole>;
    rulesChannel: string | null;
    scheduledEvents: Array<JSONScheduledEvent>;
    splash: string | null;
    stageInstances: Array<JSONStageInstance>;
    stickers?: Array<Sticker>;
    systemChannel: string | null;
    systemChannelFlags: number;
    threads: Array<string>;
    unavailable: boolean;
    vanityURLCode: string | null;
    verificationLevel: VerificationLevels;
    voiceStates: Array<JSONVoiceState>;
    welcomeScreen?: WelcomeScreen;
    widgetChannel?: string | null;
    widgetEnabled?: boolean;
}
export interface JSONGuildChannel extends JSONChannel {
    guild: string;
    name: string;
    parent: string | null;
    type: GuildChannelTypes;
}
export interface JSONGuildPreview extends JSONBase {
    approximateMemberCount: number;
    approximatePresenceCount: number;
    description: string | null;
    discoverySplash: string | null;
    emojis: Array<GuildEmoji>;
    features: Array<GuildFeature>;
    icon: string | null;
    name: string;
    splash: string | null;
    stickers: Array<Sticker>;
}
export interface JSONGuildTemplate {
    code: string;
    createdAt: number;
    creator: JSONUser;
    description: string | null;
    isDirty: boolean | null;
    name: string;
    serializedSourceGuild: Partial<RawGuild>;
    sourceGuild: string;
    updatedAt: number;
    usageCount: number;
}
export interface JSONIntegration extends JSONBase {
    account: IntegrationAccount;
    application?: JSONPartialApplication;
    enableEmoticons?: boolean;
    enabled?: boolean;
    expireBehavior?: IntegrationExpireBehaviors;
    expireGracePeriod?: number;
    name: string;
    revoked?: boolean;
    roleID?: string;
    subscriberCount?: number;
    syncedAt?: number;
    syncing?: boolean;
    type: IntegrationType;
    user?: JSONUser;
}
export interface JSONInteraction extends JSONBase {
    application: string;
    token: string;
    type: InteractionTypes;
    version: 1;
}
export interface JSONInvite {
    approximateMemberCount?: number;
    approximatePresenceCount?: number;
    channel?: string;
    code: string;
    createdAt?: number;
    expiresAt?: number;
    guild?: string;
    guildScheduledEvent?: JSONScheduledEvent;
    inviter?: string;
    maxAge?: number;
    maxUses?: number;
    stageInstance?: {
        members: Array<string>;
        participantCount: number;
        speakerCount: number;
        topic: string;
    };
    targetApplication?: JSONPartialApplication;
    targetType?: InviteTargetTypes;
    targetUser?: string;
    temporary?: boolean;
    uses?: number;
}
export interface JSONMember extends JSONBase {
    avatar: string | null;
    communicationDisabledUntil: number | null;
    deaf: boolean;
    flags?: number;
    guild: string;
    isPending?: boolean;
    joinedAt: number | null;
    mute: boolean;
    nick: string | null;
    pending: boolean;
    premiumSince: number | null;
    presence?: Presence;
    roles: Array<string>;
    user: JSONUser;
}
export interface JSONMessage extends JSONBase {
    activity?: MessageActivity;
    application?: JSONPartialApplication | string;
    attachments: Array<JSONAttachment>;
    author: JSONUser;
    channel: string;
    components?: Array<MessageActionRow>;
    content: string;
    editedTimestamp: number | null;
    embeds: Array<Embed>;
    flags?: number;
    guild?: string;
    interaction?: {
        id: string;
        member?: JSONMember;
        name: string;
        type: InteractionTypes;
        user: JSONUser;
    };
    mentionChannels?: Array<ChannelMention>;
    mentions: {
        channels: Array<string>;
        everyone: boolean;
        members: Array<JSONMember>;
        roles: Array<string>;
        users: Array<JSONUser>;
    };
    messageReference?: MessageReference;
    nonce?: number | string;
    pinned: boolean;
    position?: number;
    reactions: Record<string, MessageReaction>;
    referencedMessage?: JSONMessage | null;
    stickerItems?: Array<StickerItem>;
    thread?: JSONAnnouncementThreadChannel | JSONPublicThreadChannel;
    timestamp: number;
    tts: boolean;
    type: MessageTypes;
    webhook?: string;
}
export interface JSONModalSubmitInteraction extends JSONInteraction {
    appPermissions?: JSONPermission;
    channel: string;
    data: ModalSubmitInteractionData;
    guild?: string;
    guildLocale?: string;
    locale: string;
    member?: JSONMember;
    type: InteractionTypes.MODAL_SUBMIT;
    user: JSONUser;
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
export interface JSONPrivateChannel extends JSONChannel {
    lastMessage?: string;
    messages: Array<string>;
    recipient: JSONUser;
    type: ChannelTypes.DM;
}
export interface JSONPrivateThreadChannel extends JSONThreadChannel {
    threadMetadata: PrivateThreadmetadata;
    type: ChannelTypes.PRIVATE_THREAD;
}
export interface JSONPublicThreadChannel extends JSONThreadChannel {
    threadMetadata: ThreadMetadata;
    type: ChannelTypes.PUBLIC_THREAD;
}
export interface JSONRole extends JSONBase {
    color: number;
    guild: string;
    hoist: boolean;
    icon: string | null;
    managed: boolean;
    mentionable: boolean;
    name: string;
    permissions: JSONPermission;
    position: number;
    tags: RoleTags;
    unicodeEmoji: string | null;
}
export interface JSONScheduledEvent extends JSONBase {
    channel: string | null;
    creator?: JSONUser;
    description?: string | null;
    entityID: string | null;
    entityMetadata: ScheduledEventEntityMetadata | null;
    entityType: GuildScheduledEventEntityTypes;
    guild: string;
    image?: string | null;
    name: string;
    privacyLevel: GuildScheduledEventPrivacyLevels;
    scheduledEndTime: number | null;
    scheduledStartTime: number;
    status: GuildScheduledEventStatuses;
    userCount?: number;
}
export interface JSONStageChannel extends JSONGuildChannel {
    bitrate: number;
    permissionOverwrites: Array<JSONPermissionOverwrite>;
    position: number;
    rtcRegion: string | null;
    topic: string | null;
    type: ChannelTypes.GUILD_STAGE_VOICE;
}
export interface JSONStageInstance extends JSONBase {
    channel: string;
    discoverableDisabled: boolean;
    guild: string;
    scheduledEvent?: string | JSONScheduledEvent;
    topic: string;
}
export interface JSONTeam extends JSONBase {
    icon: string | null;
    members: Array<TeamMember>;
    name: string;
    owner: string | JSONUser;
}
export interface JSONTextableChannel extends JSONGuildChannel {
    defaultAutoArchiveDuration: ThreadAutoArchiveDuration;
    lastMessage: string | null;
    messages: Array<string>;
    nsfw: boolean;
    permissionOverwrites: Array<JSONPermissionOverwrite>;
    position: number;
    rateLimitPerUser: number;
    threads: Array<string>;
    topic: string | null;
    type: Exclude<TextChannelTypes, PrivateChannelTypes>;
}
export interface JSONTextChannel extends JSONTextableChannel {
    type: ChannelTypes.GUILD_TEXT;
}
export interface JSONThreadChannel extends JSONGuildChannel {
    flags: number;
    lastMessage: string | null;
    memberCount: number;
    messageCount: number;
    messages: Array<string>;
    owner: string | JSONUser;
    rateLimitPerUser: number;
    threadMetadata: ThreadMetadata | PrivateThreadmetadata;
    totalMessageSent: number;
    type: ThreadChannelTypes;
}
export interface JSONUnavailableGuild extends JSONBase {
    unavailable: true;
}
export interface JSONUser extends JSONBase {
    accentColor?: number | null;
    avatar: string | null;
    banner?: string | null;
    bot: boolean;
    discriminator: string;
    publicFlags: number;
    system: boolean;
    username: string;
}
export interface JSONVoiceChannel extends JSONGuildChannel {
    bitrate: number;
    messages: Array<string>;
    nsfw: boolean;
    permissionOverwrites: Array<JSONPermissionOverwrite>;
    position: number;
    rtcRegion: string | null;
    topic: string | null;
    type: ChannelTypes.GUILD_VOICE;
    videoQualityMode: VideoQualityModes;
    voiceMembers: Array<string>;
}
export interface JSONVoiceState extends JSONBase {
    channel: string | null;
    deaf: boolean;
    guild: string;
    member: JSONMember;
    mute: boolean;
    requestToSpeakTimestamp: number | null;
    selfDeaf: boolean;
    selfMute: boolean;
    selfStream: boolean;
    selfVideo: boolean;
    sessionID: string;
    suppress: boolean;
    user: JSONUser;
}
export interface JSONWebhook extends JSONBase {
    application: string | null;
    avatar: string | null;
    channel: string | null;
    guild: string | null;
    name: string | null;
    sourceChannel?: Pick<RawChannel, "id" | "name">;
    sourceGuild?: Pick<RawGuild, "id" | "name" | "icon">;
    token?: string;
    type: WebhookTypes;
    user?: JSONUser;
}
