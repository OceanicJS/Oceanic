"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
const PartialApplication_1 = __importDefault(require("./PartialApplication"));
const User_1 = __importDefault(require("./User"));
/** Represents a guild integration. */
class Integration extends Base_1.default {
    /** The account information associated with this integration. */
    account;
    /** The application associated with this integration. */
    application;
    /** If emoticons should be synced for this integration. */
    enableEmoticons;
    /** If this integration is enabled. */
    enabled;
    /** The [behavior](https://discord.com/developers/docs/resources/guild#integration-object-integration-expire-behaviors) of expiring subscribers. */
    expireBehavior;
    /** The grace period (in days) before expiring subscribers. */
    expireGracePeriod;
    /** The name of the integration. */
    name;
    /** If this integration has been revoked. */
    revoked;
    /** The id of the role this integration uses for subscribers. */
    roleID;
    /** The number of subscribers this integration has. */
    subscriberCount;
    /** The last date at which this integration was synced at. */
    syncedAt;
    /** If this integration is syncing. */
    syncing;
    /** The type of integration. */
    type;
    /** The user associated with this integration. */
    user;
    constructor(data, client) {
        super(data.id, client);
        this.account = data.account;
        this.application = null;
        this.enableEmoticons = !!data.enable_emoticons;
        this.enabled = !!data.enabled;
        this.name = data.name;
        this.revoked = !!data.revoked;
        this.syncing = !!data.syncing;
        this.type = data.type;
        this.update(data);
    }
    update(data) {
        if (data.account !== undefined)
            this.account = data.account;
        if (data.application !== undefined)
            this.application = new PartialApplication_1.default(data.application, this._client);
        if (data.enable_emoticons !== undefined)
            this.enableEmoticons = data.enable_emoticons;
        if (data.enabled !== undefined)
            this.enabled = data.enabled;
        if (data.expire_behavior !== undefined)
            this.expireBehavior = data.expire_behavior;
        if (data.expire_grace_period !== undefined)
            this.expireGracePeriod = data.expire_grace_period;
        if (data.name !== undefined)
            this.name = data.name;
        if (data.revoked !== undefined)
            this.revoked = data.revoked;
        if (data.role_id !== undefined)
            this.roleID = data.role_id;
        if (data.subscriber_count !== undefined)
            this.subscriberCount = data.subscriber_count;
        if (data.synced_at !== undefined)
            this.syncedAt = new Date(data.synced_at);
        if (data.syncing !== undefined)
            this.syncing = data.syncing;
        if (data.type !== undefined)
            this.type = data.type;
        if (data.user !== undefined)
            this.user = new User_1.default(data.user, this._client);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            account: this.account,
            application: this.application?.toJSON(),
            enableEmoticons: this.enableEmoticons,
            enabled: this.enabled,
            expireBehavior: this.expireBehavior,
            expireGracePeriod: this.expireGracePeriod,
            name: this.name,
            revoked: this.revoked,
            roleID: this.roleID,
            subscriberCount: this.subscriberCount,
            syncedAt: this.syncedAt?.getTime(),
            syncing: this.syncing,
            type: this.type,
            user: this.user?.toJSON()
        };
    }
}
exports.default = Integration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZWdyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3RydWN0dXJlcy9JbnRlZ3JhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQiw4RUFBc0Q7QUFDdEQsa0RBQTBCO0FBTTFCLHNDQUFzQztBQUN0QyxNQUFxQixXQUFZLFNBQVEsY0FBSTtJQUN6QyxnRUFBZ0U7SUFDaEUsT0FBTyxDQUFxQjtJQUM1Qix3REFBd0Q7SUFDeEQsV0FBVyxDQUE0QjtJQUN2QywwREFBMEQ7SUFDMUQsZUFBZSxDQUFVO0lBQ3pCLHNDQUFzQztJQUN0QyxPQUFPLENBQVU7SUFDakIsbUpBQW1KO0lBQ25KLGNBQWMsQ0FBOEI7SUFDNUMsOERBQThEO0lBQzlELGlCQUFpQixDQUFVO0lBQzNCLG1DQUFtQztJQUNuQyxJQUFJLENBQVM7SUFDYiw0Q0FBNEM7SUFDNUMsT0FBTyxDQUFVO0lBQ2pCLGdFQUFnRTtJQUNoRSxNQUFNLENBQVU7SUFDaEIsc0RBQXNEO0lBQ3RELGVBQWUsQ0FBVTtJQUN6Qiw2REFBNkQ7SUFDN0QsUUFBUSxDQUFRO0lBQ2hCLHNDQUFzQztJQUN0QyxPQUFPLENBQVU7SUFDakIsK0JBQStCO0lBQy9CLElBQUksQ0FBa0I7SUFDdEIsaURBQWlEO0lBQ2pELElBQUksQ0FBUTtJQUNaLFlBQVksSUFBb0IsRUFBRSxNQUFjO1FBQzVDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM1QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDL0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM5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