import Base from "./Base";
import type { AuditLogActionTypes } from "../Constants";
import type { AuditLogEntryOptions, RawAuditLogEntry, RoleAuditLogChange, StandardAuditLogChange } from "../types";
import type Client from "../Client";
/** Represents a guild audit log entry. */
export default class AuditLogEntry extends Base {
    /** The [type](https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-audit-log-events) of this action. */
    actionType: AuditLogActionTypes;
    /** See the [audit log documentation](https://discord.com/developers/docs/resources/audit-log#audit-log-change-object) for more information. */
    changes?: Array<StandardAuditLogChange | RoleAuditLogChange>;
    /** Additional info for specific event types */
    options?: AuditLogEntryOptions;
    /** The reason for the change. */
    reason?: string;
    /** The ID of what was targeted (webhook, user, role, etc). */
    targetID: string | null;
    /** The ID of the user or application that made the changes. */
    userID: string | null;
    constructor(data: RawAuditLogEntry, client: Client);
}
