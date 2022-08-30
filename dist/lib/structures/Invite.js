"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Channel_1 = __importDefault(require("./Channel"));
const Guild_1 = __importDefault(require("./Guild"));
const PartialApplication_1 = __importDefault(require("./PartialApplication"));
const Constants_1 = require("../Constants");
const Properties_1 = __importDefault(require("../util/Properties"));
/** Represents an invite. */
class Invite {
    _client;
    /** The approximate number of total members in the guild this invite leads to. */
    approximateMemberCount;
    /** The approximate number of online members in the guild this invite leads to. */
    approximatePresenceCount;
    /** The channel this invite leads to. */
    channel;
    /** The code of this invite. */
    code;
    /** When this invite was created. */
    createdAt;
    /** The date at which this invite expires. */
    expiresAt;
    /** The guild this invite leads to. */
    guild;
    /** The scheduled event associated with this invite. */
    guildScheduledEvent;
    /** The user that created this invite. */
    inviter;
    /** The time after which this invite expires. */
    maxAge;
    /** The maximum number of times this invite can be used, */
    maxUses;
    /** @deprecated The stage instance in the invite this channel is for (deprecated). */
    stageInstance;
    /** The embedded application this invite will open. */
    targetApplication;
    /** The [target type](https://discord.com/developers/docs/resources/invite#invite-object-invite-target-types) of this invite. */
    targetType;
    /** The user whose stream to display for this voice channel stream invite. */
    targetUser;
    /** If this invite only grants temporary membership. */
    temporary;
    /** The number of times this invite has been used. */
    uses;
    constructor(data, client) {
        Properties_1.default.looseDefine(this, "_client", client);
        this.code = data.code;
        this.expiresAt = (!data.expires_at ? undefined : new Date(data.expires_at));
        this.targetType = data.target_type;
        this.update(data);
    }
    update(data) {
        if (data.approximate_member_count !== undefined)
            this.approximateMemberCount = data.approximate_member_count;
        if (data.approximate_presence_count !== undefined)
            this.approximatePresenceCount = data.approximate_presence_count;
        let guild;
        if (data.guild) {
            if (this._client.guilds.has(data.guild.id))
                guild = this._client.guilds.update(data.guild);
            else
                guild = new Guild_1.default(data.guild, this._client);
            this.guild = guild;
        }
        let channel;
        if (data.channel) {
            channel = this._client.getChannel(data.channel.id);
            if (channel && channel instanceof Channel_1.default)
                channel["update"](data.channel);
            else if (data.channel.type === Constants_1.ChannelTypes.GROUP_DM)
                channel = data.channel;
            else
                channel = Channel_1.default.from(data.channel, this._client);
            this.channel = channel;
        }
        if (data.inviter)
            this.inviter = this._client.users.update(data.inviter);
        if (data.stage_instance)
            this.stageInstance = {
                members: data.stage_instance.members.map(member => guild.members.update(member, guild.id)),
                participantCount: data.stage_instance.participant_count,
                speakerCount: data.stage_instance.speaker_count,
                topic: data.stage_instance.topic
            };
        if (data.target_application !== undefined)
            this.targetApplication = new PartialApplication_1.default(data.target_application, this._client);
        if (data.guild_scheduled_event !== undefined)
            this.guildScheduledEvent = guild.scheduledEvents.update(data.guild_scheduled_event);
        if (data.target_user !== undefined)
            this.targetUser = this._client.users.update(data.target_user);
        if ("created_at" in data) {
            if (data.created_at !== undefined)
                this.createdAt = new Date(data.created_at);
            if (data.uses !== undefined)
                this.uses = data.uses;
            if (data.max_uses !== undefined)
                this.maxUses = data.max_uses;
            if (data.max_age !== undefined)
                this.maxAge = data.max_age;
            if (data.temporary !== undefined)
                this.temporary = data.temporary;
        }
    }
    /**
     * Delete this invite.
     * @param reason - The reason for deleting this invite.
     */
    async deleteInvite(reason) {
        return this._client.rest.channels.deleteInvite(this.code, reason);
    }
    toJSON() {
        return {
            approximateMemberCount: this.approximateMemberCount,
            approximatePresenceCount: this.approximatePresenceCount,
            channel: this.channel?.id,
            code: this.code,
            createdAt: this.createdAt?.getTime(),
            expiresAt: this.expiresAt?.getTime(),
            guild: this.guild?.id,
            guildScheduledEvent: this.guildScheduledEvent?.toJSON(),
            inviter: this.inviter?.id,
            maxAge: this.maxAge,
            maxUses: this.maxUses,
            stageInstance: !this.stageInstance ? undefined : {
                members: this.stageInstance.members.map(member => member.id),
                participantCount: this.stageInstance.participantCount,
                speakerCount: this.stageInstance.speakerCount,
                topic: this.stageInstance.topic
            },
            targetApplication: this.targetApplication?.toJSON(),
            targetType: this.targetType,
            targetUser: this.targetUser?.id,
            temporary: this.temporary,
            uses: this.uses
        };
    }
}
exports.default = Invite;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52aXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvSW52aXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQWdDO0FBQ2hDLG9EQUE0QjtBQUc1Qiw4RUFBc0Q7QUFjdEQsNENBQTRDO0FBRTVDLG9FQUE0QztBQUc1Qyw0QkFBNEI7QUFDNUIsTUFBcUIsTUFBTTtJQUNiLE9BQU8sQ0FBUztJQUMxQixpRkFBaUY7SUFDakYsc0JBQXNCLENBQVU7SUFDaEMsa0ZBQWtGO0lBQ2xGLHdCQUF3QixDQUFVO0lBQ2xDLHdDQUF3QztJQUN4QyxPQUFPLENBQTZCO0lBQ3BDLCtCQUErQjtJQUMvQixJQUFJLENBQVM7SUFDYixvQ0FBb0M7SUFDcEMsU0FBUyxDQUE4QztJQUN2RCw2Q0FBNkM7SUFDN0MsU0FBUyxDQUFpRTtJQUMxRSxzQ0FBc0M7SUFDdEMsS0FBSyxDQUFTO0lBQ2QsdURBQXVEO0lBQ3ZELG1CQUFtQixDQUF1QjtJQUMxQyx5Q0FBeUM7SUFDekMsT0FBTyxDQUFRO0lBQ2YsZ0RBQWdEO0lBQ2hELE1BQU0sQ0FBNEM7SUFDbEQsMkRBQTJEO0lBQzNELE9BQU8sQ0FBNEM7SUFDbkQscUZBQXFGO0lBQ3JGLGFBQWEsQ0FBdUI7SUFDcEMsc0RBQXNEO0lBQ3RELGlCQUFpQixDQUFzQjtJQUN2QyxnSUFBZ0k7SUFDaEksVUFBVSxDQUFxQjtJQUMvQiw2RUFBNkU7SUFDN0UsVUFBVSxDQUFRO0lBQ2xCLHVEQUF1RDtJQUN2RCxTQUFTLENBQTZDO0lBQ3RELHFEQUFxRDtJQUNyRCxJQUFJLENBQTRDO0lBQ2hELFlBQVksSUFBdUMsRUFBRSxNQUFjO1FBQy9ELG9CQUFVLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdB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