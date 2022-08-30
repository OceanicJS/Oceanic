"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
const User_1 = __importDefault(require("./User"));
/** Represents an auto moderation rule. */
class AutoModerationRule extends Base_1.default {
    /** The actions that will execute when this rule is triggered. */
    actions;
    /** The creator of this rule. This can be a partial object with just an `id` property. */
    creator;
    /** If this rule is enabled. */
    enabled;
    /** The [event type](https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-event-types) of this rule. */
    eventType;
    /** The channels that are exempt from this rule. */
    exemptChannels;
    /** The roles that are exempt from this rule. */
    exemptRoles;
    /** The guild this rule is in. */
    guild;
    /** The id of the guild this rule is in. */
    guildID;
    /** The name of this rule */
    name;
    /** The metadata of this rule's trigger.  */
    triggerMetadata;
    /** This rule's [trigger type](https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-types). */
    triggerType;
    constructor(data, client) {
        super(data.id, client);
        if (data.creator_id !== undefined)
            this.creator = this._client.users.get(data.creator_id) || { id: data.creator_id };
        if (data.guild_id !== undefined) {
            this.guild = this._client.guilds.get(data.guild_id);
            this.guildID = data.guild_id;
        }
        this.update(data);
    }
    update(data) {
        if (data.actions !== undefined)
            this.actions = data.actions.map(a => ({
                metadata: {
                    channelID: a.metadata.channel_id,
                    durationSeconds: a.metadata.duration_seconds
                },
                type: a.type
            }));
        if (data.enabled !== undefined)
            this.enabled = data.enabled;
        if (data.event_type !== undefined)
            this.eventType = data.event_type;
        if (data.exempt_channels !== undefined)
            this.exemptChannels = data.exempt_channels;
        if (data.exempt_roles !== undefined)
            this.exemptRoles = data.exempt_roles;
        if (data.name !== undefined)
            this.name = data.name;
        if (data.trigger_metadata !== undefined)
            this.triggerMetadata = {
                allowList: data.trigger_metadata.allow_list,
                keywordFilter: data.trigger_metadata.keyword_filter,
                mentionTotalLimit: data.trigger_metadata.mention_total_limit,
                presets: data.trigger_metadata.presets
            };
        if (data.trigger_type !== undefined)
            this.triggerType = data.trigger_type;
    }
    /**
     * Delete this auto moderation rule.
     * @param reason The reason for deleting this rule.
     */
    async deleteAutoModerationRule(reason) {
        return this._client.rest.guilds.deleteAutoModerationRule(this.guildID, this.id, reason);
    }
    /**
     * Edit this auto moderation rule.
     * @param options The options for editing the rule.
     */
    async edit(options) {
        return this._client.rest.guilds.editAutoModerationRule(this.guildID, this.id, options);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            actions: this.actions,
            creator: this.creator instanceof User_1.default ? this.creator.toJSON() : this.creator.id,
            enabled: this.enabled,
            eventType: this.eventType,
            exemptChannels: this.exemptChannels,
            exemptRoles: this.exemptRoles,
            guild: this.guildID,
            name: this.name,
            triggerMetadata: this.triggerMetadata,
            triggerType: this.triggerType
        };
    }
}
exports.default = AutoModerationRule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0b01vZGVyYXRpb25SdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvQXV0b01vZGVyYXRpb25SdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLGtEQUEwQjtBQVExQiwwQ0FBMEM7QUFDMUMsTUFBcUIsa0JBQW1CLFNBQVEsY0FBSTtJQUNoRCxpRUFBaUU7SUFDakUsT0FBTyxDQUE4QjtJQUNyQyx5RkFBeUY7SUFDekYsT0FBTyxDQUFrQjtJQUN6QiwrQkFBK0I7SUFDL0IsT0FBTyxDQUFVO0lBQ2pCLDRJQUE0STtJQUM1SSxTQUFTLENBQTJCO0lBQ3BDLG1EQUFtRDtJQUNuRCxjQUFjLENBQWdCO0lBQzlCLGdEQUFnRDtJQUNoRCxXQUFXLENBQWdCO0lBQzNCLGlDQUFpQztJQUNqQyxLQUFLLENBQVE7SUFDYiwyQ0FBMkM7SUFDM0MsT0FBTyxDQUFTO0lBQ2hCLDRCQUE0QjtJQUM1QixJQUFJLENBQVM7SUFDYiw0Q0FBNEM7SUFDNUMsZUFBZSxDQUFrQjtJQUNqQywySUFBMkk7SUFDM0ksV0FBVyxDQUE2QjtJQUN4QyxZQUFZLElBQTJCLEVBQUUsTUFBYztRQUNuRCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QixJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDckgsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMs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