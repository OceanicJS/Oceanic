/// <reference types="node" />
import BaseRoute from "./BaseRoute";
import type { CreateEmojiOptions, CreateGuildOptions, EditEmojiOptions, EditGuildOptions, GuildEmoji, ModifyChannelPositionsEntry, RawGuild, GetActiveThreadsResponse, GetMembersOptions, SearchMembersOptions, AddMemberOptions, EditMemberOptions, EditCurrentMemberOptions, GetBansOptions, Ban, CreateBanOptions, CreateRoleOptions, EditRolePositionsEntry, EditRoleOptions, GetPruneCountOptions, BeginPruneOptions, WidgetSettings, RawWidget, Widget, WidgetImageStyle, WelcomeScreen, EditWelcomeScreenOptions, GetVanityURLResponse, EditUserVoiceStateOptions, EditCurrentUserVoiceStateOptions, CreateChannelReturn, CreateChannelOptions } from "../types/guilds";
import type { CreateAutoModerationRuleOptions, EditAutoModerationRuleOptions } from "../types/auto-moderation";
import type { GuildChannelTypesWithoutThreads, MFALevels } from "../Constants";
import type { AuditLog, GetAuditLogOptions } from "../types/audit-log";
import GuildScheduledEvent from "../structures/GuildScheduledEvent";
import type { CreateScheduledEventOptions, EditScheduledEventOptions, GetScheduledEventUsersOptions, ScheduledEventUser } from "../types/scheduled-events";
import GuildTemplate from "../structures/GuildTemplate";
import type { CreateGuildFromTemplateOptions, CreateTemplateOptions, EditGuildTemplateOptions } from "../types/guild-template";
import GuildPreview from "../structures/GuildPreview";
import type { AnyGuildChannelWithoutThreads } from "../types/channels";
import Role from "../structures/Role";
import type { VoiceRegion } from "../types/voice";
import Invite from "../structures/Invite";
import Integration from "../structures/Integration";
import AutoModerationRule from "../structures/AutoModerationRule";
export default class Guilds extends BaseRoute {
    /**
     * Add a member to a guild. Requires an access token with the `guilds.join` scope.
     *
     * Returns the newly added member upon success, or void if the member is already in the guild.
     * @param id The ID of the guild.
     * @param userID The ID of the user to add.
     * @param options The options for adding the member.
     */
    addMember(id: string, userID: string, options: AddMemberOptions): Promise<void | import("..").Member>;
    /**
     * Add a role to a member.
     * @param id The ID of the guild.
     * @param memberID The ID of the member.
     * @param roleID The ID of the role to add.
     * @param reason The reason for adding the role.
     */
    addMemberRole(id: string, memberID: string, roleID: string, reason?: string): Promise<void>;
    /**
     * Begine a prune.
     * @param id The ID of the guild.
     * @param options The options for the prune.
     */
    beginPrune(id: string, options?: BeginPruneOptions): Promise<number | null>;
    /**
     * Create a guild. This can only be used by bots in under 10 guilds.
     * @param options The options for creating the guild.
     */
    create(options: CreateGuildOptions): Promise<RawGuild>;
    /**
     * Create an auto moderation rule for a guild.
     * @param id The ID of the guild.
     * @param options The options for creating the rule.
     */
    createAutoModerationRule(id: string, options: CreateAutoModerationRuleOptions): Promise<AutoModerationRule | undefined>;
    /**
     * Create a bon for a user.
     * @param guildID The ID of the guild.
     * @param userID The ID of the user to ban.
     * @param options The options for creating the bon.
     */
    createBan(guildID: string, userID: string, options?: CreateBanOptions): Promise<void>;
    /**
     * Create a channel in a guild.
     * @param id The ID of the guild.
     * @param options The options for creating the channel.
     */
    createChannel<T extends GuildChannelTypesWithoutThreads>(id: string, type: T, options: Omit<CreateChannelOptions, "type">): Promise<CreateChannelReturn<T>>;
    /**
     * Create an emoji in a guild.
     * @param id The ID of the guild.
     * @param options The options for creating the emoji.
     */
    createEmoji(id: string, options: CreateEmojiOptions): Promise<GuildEmoji>;
    /**
     * Create a guild from a template. This can only be used by bots in less than 10 guilds.
     * @param code The code of the template to use.
     * @param options The options for creating the guild.
     */
    createFromTemplate(code: string, options: CreateGuildFromTemplateOptions): Promise<import("..").Guild>;
    /**
     * Create a role.
     * @param id The ID of the guild.
     * @param options The options for creating the role.
     */
    createRole(id: string, options?: CreateRoleOptions): Promise<Role>;
    /**
     * Create a scheduled event in a guild.
     * @param id The ID of the guild.
     * @param options The options for creating the scheduled event.
     */
    createScheduledEvent(id: string, options: CreateScheduledEventOptions): Promise<GuildScheduledEvent>;
    /**
     * Create a guild template.
     * @param id The ID of the guild to create a template from.
     * @param options The options for creating the template.
     */
    createTemplate(id: string, options: CreateTemplateOptions): Promise<GuildTemplate>;
    /**
     * Delete a guild.
     * @param id The ID of the guild.
     */
    delete(id: string): Promise<void>;
    /**
     * Delete an auto moderation rule.
     * @param id The ID of the guild.
     * @param ruleID The ID of the rule to delete.
     * @param reason The reason for deleting the rule.
     */
    deleteAutoModerationRule(id: string, ruleID: string, reason?: string): Promise<void>;
    /**
     * Delete an emoji.
     * @param id The ID of the guild.
     * @param emojiID The ID of the emoji.
     * @param reason The reason for deleting the emoji.
     */
    deleteEmoji(id: string, emojiID: string, reason?: string): Promise<void>;
    /**
     * Delete an integration.
     * @param id The ID of the guild.
     * @param integrationID The ID of the integration.
     * @param reason The reason for deleting the integration.
     */
    deleteIntegration(id: string, integrationID: string, reason?: string): Promise<void>;
    /**
     * Delete a role.
     * @param id The ID of the guild.
     * @param roleID The ID of the role to delete.
     * @param reason The reason for deleting the role.
     */
    deleteRole(id: string, roleID: string, reason?: string): Promise<void>;
    /**
     * Delete a scheduled event.
     * @param id The ID of the guild.
     * @param eventID The ID of the scheduled event.
     * @param reason The reason for deleting the scheduled event. Discord's docs do not explicitly state a reason can be provided, so it may not be used.
     */
    deleteScheduledEvent(id: string, eventID: string, reason?: string): Promise<void>;
    /**
     * Delete a template.
     * @param id The ID of the guild.
     * @param code The code of the template.
     */
    deleteTemplate(id: string, code: string): Promise<void>;
    /**
     * Edit a guild.
     * @param id The ID of the guild.
     * @param options The options for editing the guild.
     */
    edit(id: string, options: EditGuildOptions): Promise<import("..").Guild>;
    /**
     * Edit an existing auto moderation rule.
     * @param id The ID of the guild.
     * @param ruleID The ID of the rule to edit.
     * @param options The options for editing the rule.
     */
    editAutoModerationRule(id: string, ruleID: string, options: EditAutoModerationRuleOptions): Promise<AutoModerationRule | undefined>;
    /**
     * Edit the positions of channels in a guild.
     * @param id The ID of the guild.
     * @param options The channels to move. Unedited channels do not need to be specifed.
     */
    editChannelPositions(id: string, options: Array<ModifyChannelPositionsEntry>): Promise<void>;
    /**
     * Modify the current member in a guild.
     * @param id The ID of the guild.
     * @param options The options for editing the member.
     */
    editCurrentMember(id: string, options: EditCurrentMemberOptions): Promise<import("..").Member>;
    /**
     * Edit the current member's voice state in a guild. `channelID` is required, and the current member must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-current-user-voice-state-caveats) for more information.
     * @param id The ID of the guild.
     * @param options The options for editing the voice state.
     */
    editCurrentUserVoiceState(id: string, options: EditCurrentUserVoiceStateOptions): Promise<void>;
    /**
     * Edit an existing emoji.
     * @param id The ID of the guild the emoji is in.
     * @param options The options for editing the emoji.
     */
    editEmoji(id: string, emojiID: string, options: EditEmojiOptions): Promise<{
        user: import("..").User | undefined;
        name: string;
        roles: string[];
        managed: boolean;
        animated: boolean;
        available: boolean;
        require_colons: boolean;
        id: string;
    }>;
    /**
     * Edit the [mfa level](https://discord.com/developers/docs/resources/guild#guild-object-mfa-level) of a guild. This can only be used by the guild owner.
     * @param id The ID of the guild.
     * @param level The new MFA level.
     */
    editMFALevel(id: string, level: MFALevels): Promise<MFALevels>;
    /**
     * Edit a guild member.
     * @param id The ID of the guild.
     * @param memberID The ID of the member.
     * @param options The options for editing the member.
     */
    editMember(id: string, memberID: string, options: EditMemberOptions): Promise<import("..").Member>;
    /**
     * Edit an existing role.
     * @param id The ID of the guild.
     * @param options The options for editing the role.
     */
    editRole(id: string, roleID: string, options: EditRoleOptions): Promise<Role>;
    /**
     * Edit the position of roles in a guild.
     * @param id The ID of the guild.
     * @param options The roles to move.
     */
    editRolePositions(id: string, options: Array<EditRolePositionsEntry>, reason?: string): Promise<Role[]>;
    /**
     * Edit an existing scheduled event in a guild.
     * @param id The ID of the guild.
     * @param options The options for editing the scheduled event.
     */
    editScheduledEvent(id: string, options: EditScheduledEventOptions): Promise<GuildScheduledEvent>;
    /**
     * Edit a guild template.
     * @param id The ID of the guild.
     * @param code The code of the template.
     * @param options The options for editing the template.
     */
    editTemplate(id: string, code: string, options: EditGuildTemplateOptions): Promise<GuildTemplate>;
    /**
     * Edit a guild member's voice state. `channelID` is required, and the user must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-user-voice-state) for more information.
     * @param id The ID of the guild.
     * @param memberID The ID of the member.
     * @param options The options for editing the voice state.
     */
    editUserVoiceState(id: string, memberID: string, options: EditUserVoiceStateOptions): Promise<void>;
    /**
     * Edit the welcome screen in a guild.
     * @param id The ID of the guild.
     * @param options The options for editing the welcome screen.
     */
    editWelcomeScreen(id: string, options: EditWelcomeScreenOptions): Promise<WelcomeScreen>;
    /**
     * Edit the widget of a guild.
     * @param id The ID of the guild.
     * @param options The options for editing the widget.
     */
    editWidget(id: string, options: WidgetSettings): Promise<Widget>;
    /**
     * Get a guild.
     * @param id The ID of the guild.
     * @param withCounts If the approximate number of members and online members should be included.
     */
    get(id: string, withCounts?: number): Promise<import("..").Guild>;
    /**
     * Get the active threads in a guild.
     * @param id The ID of the guild.
     */
    getActiveThreads(id: string): Promise<GetActiveThreadsResponse>;
    /**
     * Get a guild's audit log.
     * @param id The ID of the guild.
     * @param options The options for getting the audit logs.
     */
    getAuditLog(id: string, options?: GetAuditLogOptions): Promise<AuditLog>;
    /**
     * Get an auto moderation rule for a guild.
     * @param id The ID of the guild.
     * @param ruleID The ID of the rule to get.
     */
    getAutoModerationRule(id: string, ruleID: string): Promise<AutoModerationRule>;
    /**
     * Get the auto moderation rules for a guild.
     * @param id The ID of the guild.
     */
    getAutoModerationRules(id: string): Promise<AutoModerationRule[]>;
    /**
     * Get a ban.
     * @param id The ID of the guild.
     * @param userID The ID of the user to get the ban of.
     */
    getBan(id: string, userID: string): Promise<Ban>;
    /**
     * Get the bans in a guild.
     * @param id The ID of the guild.
     * @param options The options for getting the bans.
     */
    getBans(id: string, options?: GetBansOptions): Promise<Ban[]>;
    /**
     * Get the channels in a guild. Does not include threads.
     * @param id The ID of the guild.
     */
    getChannels(id: string): Promise<AnyGuildChannelWithoutThreads[]>;
    /**
     * Get an emoji in a guild.
     * @param id The ID of the guild.
     * @param emojiID The ID of the emoji to get.
     */
    getEmoji(id: string, emojiID: string): Promise<GuildEmoji>;
    /**
     * Get the emojis in a guild.
     * @param id The ID of the guild.
     */
    getEmojis(id: string): Promise<GuildEmoji[]>;
    /**
     * Get the integrations in a guild.
     * @param id The ID of the guild.
     */
    getIntegrations(id: string): Promise<Integration[]>;
    /**
     * Get the invites of a guild.
     * @param id The ID of the guild to get the invites of.
     */
    getInvites(id: string): Promise<Invite<"withMetadata", import("../types/channels").InviteChannel>[]>;
    /**
     * Get a guild member.
     * @param id The ID of the guild.
     * @param memberID The ID of the member.
     */
    getMember(id: string, memberID: string): Promise<import("..").Member>;
    /**
     * Get a guild's members. This requires the `GUILD_MEMBERS` intent.
     * @param id The ID of the guild.
     * @param options The options for getting the members.
     */
    getMembers(id: string, options?: GetMembersOptions): Promise<import("..").Member[]>;
    /**
     * Get a preview of a guild. If the client is not already in this guild, the guild must be lurkable.
     * @param id The ID of the guild.
     */
    getPreview(id: string): Promise<GuildPreview>;
    /**
     * Get the prune count of a guild.
     * @param id The ID of the guild.
     * @param options The options for getting the prune count.
     */
    getPruneCount(id: string, options?: GetPruneCountOptions): Promise<number>;
    /**
     * Get the roles in a guild.
     * @param id The ID of the guild.
     */
    getRoles(id: string): Promise<Role[]>;
    /**
     * Get a scheduled event.
     * @param id The ID of the guild.
     * @param eventID The ID of the scheduled event to get.
     * @param withUserCount If the number of users subscribed to the event should be included.
     */
    getScheduledEvent(id: string, eventID: string, withUserCount?: number): Promise<GuildScheduledEvent>;
    /**
     * Get the users subscribed to a scheduled event.
     * @param id The ID of the guild.
     * @param eventID The ID of the scheduled event.
     * @param options The options for getting the users.
     */
    getScheduledEventUsers(id: string, eventID: string, options?: GetScheduledEventUsersOptions): Promise<ScheduledEventUser[]>;
    /**
     * Get a guild's scheduled events
     * @param id The ID of the guild.
     * @param withUserCount If the number of users subscribed to the event should be included.
     */
    getScheduledEvents(id: string, withUserCount?: number): Promise<GuildScheduledEvent[]>;
    /**
     * Get a guild template.
     * @param code The code of the template to get.
     */
    getTemplate(code: string): Promise<GuildTemplate>;
    /**
     * Get a guild's templates.
     * @param id The ID of the guild.
     */
    getTemplates(id: string): Promise<GuildTemplate[]>;
    /**
     * Get the vanity url of a guild.
     * @param id The ID of the guild.
     */
    getVanityURL(id: string): Promise<GetVanityURLResponse>;
    /**
     * Get the list of usable voice regions for a guild. This will return VIP servers when the guild is VIP-enabled.
     * @param id The ID of the guild.
     */
    getVoiceRegions(id: string): Promise<VoiceRegion[]>;
    /**
     * Get the welcome screen for a guild.
     * @param id The ID of the guild.
     */
    getWelcomeScreen(id: string): Promise<WelcomeScreen>;
    /**
     * Get the widget of a guild.
     * @param id The ID of the guild.
     */
    getWidget(id: string): Promise<Widget>;
    /**
     * Get the widget image of a guild.
     * @param id The ID of the guild.
     * @param style The style of the image.
     */
    getWidgetImage(id: string, style?: WidgetImageStyle): Promise<Buffer>;
    /**
     * Get the raw JSON widget of a guild.
     * @param id The ID of the guild.
     */
    getWidgetJSON(id: string): Promise<RawWidget>;
    /**
     * Get a guild's widget settings.
     * @param id The ID of the guild.
     */
    getWidgetSettings(id: string): Promise<WidgetSettings>;
    /**
     * Remove a ban.
     * @param id The ID of the guild.
     * @param userID The ID of the user to remove the ban from.
     * @param reason The reason for removing the ban.
     */
    removeBan(id: string, userID: string, reason?: string): Promise<void>;
    /**
     * Remove a member from a guild.
     * @param id The ID of the guild.
     * @param memberID The ID of the user to remove.
     * @param reason The reason for the removal.
     */
    removeMember(id: string, memberID: string, reason?: string): Promise<void>;
    /**
     * remove a role from a member.
     * @param id The ID of the guild.
     * @param memberID The ID of the member.
     * @param roleID The ID of the role to remove.
     * @param reason The reason for removing the role.
     */
    removeMemberRole(id: string, memberID: string, roleID: string, reason?: string): Promise<void>;
    /**
     * Search the username & nicknames of members in a guild.
     * @param id The ID of the guild.
     * @param options The options to search with.
     */
    searchMembers(id: string, options: SearchMembersOptions): Promise<import("..").Member[]>;
    /**
     * Sync a guild template.
     * @param id The ID of the guild.
     * @param code The code of the template to sync.
     */
    syncTemplate(id: string, code: string): Promise<GuildTemplate>;
}
