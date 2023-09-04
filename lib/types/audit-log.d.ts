/** @module Types/AuditLog */
import type { RawAutoModerationRule } from "./auto-moderation";
import type { RawAnnouncementThreadChannel, RawPrivateThreadChannel, RawPublicThreadChannel } from "./channels";
import type { RawIntegration } from "./guilds";
import type { RawScheduledEvent } from "./scheduled-events";
import type { RawUser } from "./users";
import type { RawWebhook } from "./webhooks";
import type { RawApplicationCommand } from "./application-commands";
import type { AuditLogActionTypes } from "../Constants";
import type GuildScheduledEvent from "../structures/GuildScheduledEvent";
import type AnnouncementThreadChannel from "../structures/AnnouncementThreadChannel";
import type PublicThreadChannel from "../structures/PublicThreadChannel";
import type PrivateThreadChannel from "../structures/PrivateThreadChannel";
import type User from "../structures/User";
import type Webhook from "../structures/Webhook";
import type Integration from "../structures/Integration";
import type AutoModerationRule from "../structures/AutoModerationRule";
import type AuditLogEntry from "../structures/AuditLogEntry";
import type ApplicationCommand from "../structures/ApplicationCommand";

export interface RawAuditLog {
    application_commands: Array<RawApplicationCommand>;
    audit_log_entries: Array<RawAuditLogEntry>;
    auto_moderation_rules: Array<RawAutoModerationRule>;
    guild_scheduled_events: Array<RawScheduledEvent>;
    integrations: Array<RawIntegration>;
    threads: Array<RawAnnouncementThreadChannel | RawPublicThreadChannel | RawPrivateThreadChannel>;
    users: Array<RawUser>;
    webhooks: Array<RawWebhook>;
}

export interface AuditLog {
    applicationCommands: Array<ApplicationCommand>;
    autoModerationRules: Array<AutoModerationRule>;
    entries: Array<AuditLogEntry>;
    guildScheduledEvents: Array<GuildScheduledEvent>;
    integrations: Array<Integration>;
    threads: Array<AnnouncementThreadChannel | PublicThreadChannel | PrivateThreadChannel>;
    users: Array<User>;
    webhooks: Array<Webhook>;
}

export interface RawAuditLogEntry {
    action_type: AuditLogActionTypes;
    /** See the [audit log documentation](https://discord.com/developers/docs/resources/audit-log#audit-log-change-object) for more information. */
    changes?: Array<StandardAuditLogChange | RoleAuditLogChange>;
    id: string;
    options?: RawAuditLogEntryOptions;
    reason?: string;
    target_id: string | null;
    user_id: string | null;
}
export interface RawAuditLogEntryOptions {
    application_id?: string;
    auto_moderation_rule_name?: string;
    auto_moderation_rule_trigger_type?: string;
    channel_id?: string;
    count?: number;
    delete_member_days?: number;
    id?: string;
    integration_type?: string;
    members_removed?: number;
    message_id?: string;
    role_name?: string;
    status?: string;
    type?: "0" | "1";
}
export interface AuditLogEntryOptions {
    /** ID of the app whose permissions were targeted - valid for: `APPLICATION_COMMAND_PERMISSION_UPDATE` */
    applicationID?: string;
    /** Name of the auto moderation rule that was triggered - valid for: `AUTO_MODERATION_BLOCK_MESSAGE`, `AUTO_MODERATION_FLAG_TO_CHANNEL`, `AUTO_MODERATION_USER_COMMUNICATION_DISABLED` */
    autoModerationRuleName?: string;
    /** Trigger type of the auto moderation rule that was triggered - valid for: `AUTO_MODERATION_BLOCK_MESSAGE`, `AUTO_MODERATION_FLAG_TO_CHANNEL`, `AUTO_MODERATION_USER_COMMUNICATION_DISABLED` */
    autoModerationRuleTriggerType?: string;
    /** Channel in which the entities were targeted - valid for: `MEMBER_MOVE`,  `MESSAGE_PIN`, `MESSAGE_UNPIN`, `MESSAGE_DELETE`, `STAGE_INSTANCE_CREATE`, `STAGE_INSTANCE_UPDATE`, `STAGE_INSTANCE_DELETE` */
    channelID?: string;
    /** Number of entities that were targeted - valid for: `MESSAGE_DELETE`, `MESSAGE_BULK_DELETE`, `MEMBER_DISCONNECT`, `MEMBER_MOVE` */
    count?: number;
    /** Number of days after which inactive members were kicked - valid for: `MEMBER_PRUNE` */
    deleteMemberDays?: number;
    /** ID of the overwritten entity - valid for: `CHANNEL_OVERWRITE_CREATE`, `CHANNEL_OVERWRITE_UPDATE`, `CHANNEL_OVERWRITE_DELETE` */
    id?: string;
    /** The type of interaction - valid for: `MEMBER_KICK`, `MEMBER_ROLE_UPDATE` */
    integrationType?: string;
    /** Number of members removed by the prune - valid for: `MEMBER_PRUNE` */
    membersRemoved?: number;
    /** ID of the message that was targeted - valid for: `MESSAGE_PIN`, `MESSAGE_UNPIN` */
    messageID?: string;
    /** Name of the role if type is "0" (not present if type is "1") - valid for: `CHANNEL_OVERWRITE_CREATE`, `CHANNEL_OVERWRITE_UPDATE`, `CHANNEL_OVERWRITE_DELETE` */
    roleName?: string;
    /** The status set in a voice channel - valid for: `VOICE_CHANNEL_STATUS_CREATE` */
    status?: string;
    /** Type of overwritten entity - role ("0") or member ("1") - valid for: `CHANNEL_OVERWRITE_CREATE`, `CHANNEL_OVERWRITE_UPDATE`, `CHANNEL_OVERWRITE_DELETE` */
    type?: "0" | "1";
}

export interface RawAuditLogIntegration extends Pick<RawIntegration, "id" | "name" | "type" | "account"> {
    application_id?: string;
}

export interface StandardAuditLogChange {
    key: string;
    new_value?: unknown;
    old_value?: unknown;
}

export interface RoleAuditLogChange {
    key: "$add" | "$remove";
    new_value: Array<{ id: string; name: string; }>;
}

export interface GetAuditLogOptions {
    /** The action type to filter by. */
    actionType?: AuditLogActionTypes;
    /** The ID of the entry to get entries before. */
    before?: string;
    /** The maximum number of entries to get. */
    limit?: number;
    /** The ID of the user to filter by. */
    userID?: string;
}
