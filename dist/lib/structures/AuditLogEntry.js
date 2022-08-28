"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
/** Represents a guild audit log entry. */
class AuditLogEntry extends Base_1.default {
    /** The [type](https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-audit-log-events) of this action. */
    actionType;
    /** See the [audit log documentation](https://discord.com/developers/docs/resources/audit-log#audit-log-change-object) for more information. */
    changes;
    /** Additional info for specific event types */
    options;
    /** The reason for the change. */
    reason;
    /** The ID of what was targeted (webhook, user, role, etc). */
    targetID;
    /** The ID of the user or application that made the changes. */
    userID;
    constructor(data, client) {
        super(data.id, client);
        this.actionType = data.action_type;
        this.changes = data.changes;
        this.options = {
            applicationID: data.options?.application_id,
            channelID: data.options?.channel_id,
            count: data.options?.count,
            deleteMemberDays: data.options?.delete_member_days,
            id: data.options?.id,
            membersRemoved: data.options?.members_removed,
            messageID: data.options?.message_id,
            roleName: data.options?.role_name,
            type: data.options?.type
        };
        this.reason = data.reason;
        this.targetID = data.target_id;
        this.userID = data.user_id;
    }
}
exports.default = AuditLogEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVkaXRMb2dFbnRyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL0F1ZGl0TG9nRW50cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFLMUIsMENBQTBDO0FBQzFDLE1BQXFCLGFBQWMsU0FBUSxjQUFJO0lBQzlDLGtJQUFrSTtJQUNsSSxVQUFVLENBQXNCO0lBQ2hDLCtJQUErSTtJQUMvSSxPQUFPLENBQXNEO0lBQzdELCtDQUErQztJQUMvQyxPQUFPLENBQXdCO0lBQy9CLGlDQUFpQztJQUNqQyxNQUFNLENBQVU7SUFDaEIsOERBQThEO0lBQzlELFFBQVEsQ0FBZ0I7SUFDeEIsK0RBQStEO0lBQy9ELE1BQU0sQ0FBZ0I7SUFDdEIsWUFBWSxJQUFzQixFQUFFLE1BQWM7UUFDakQsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ2QsYUFBYSxFQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsY0FBYztZQUM5QyxTQUFTLEVBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVO1lBQzFDLEtBQUssRUFBYSxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUs7WUFDckMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxrQkFBa0I7WUFDbEQsRUFBRSxFQUFnQixJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDbEMsY0FBYyxFQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsZUFBZTtZQUMvQyxTQUFTLEVBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVO1lBQzFDLFFBQVEsRUFBVSxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVM7WUFDekMsSUFBSSxFQUFjLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSTtTQUNwQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDNUIsQ0FBQztDQUNEO0FBaENELGdDQWdDQyJ9