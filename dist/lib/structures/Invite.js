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
    /** The approximate number of total members in the guild this invite leads to. */
    approximateMemberCount;
    /** The approximate number of online members in the guild this invite leads to. */
    approximatePresenceCount;
    /** The channel this invite leads to. */
    channel;
    client;
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
            if (this.client.guilds.has(data.guild.id))
                guild = this.client.guilds.update(data.guild);
            else
                guild = new Guild_1.default(data.guild, this.client);
            this.guild = guild;
        }
        let channel;
        if (data.channel) {
            channel = this.client.getChannel(data.channel.id);
            if (channel && channel instanceof Channel_1.default)
                channel["update"](data.channel);
            else if (data.channel.type === Constants_1.ChannelTypes.GROUP_DM)
                channel = data.channel;
            else
                channel = Channel_1.default.from(data.channel, this.client);
            this.channel = channel;
        }
        if (data.inviter)
            this.inviter = this.client.users.update(data.inviter);
        if (data.stage_instance)
            this.stageInstance = {
                members: data.stage_instance.members.map(member => guild.members.update(member, guild.id)),
                participantCount: data.stage_instance.participant_count,
                speakerCount: data.stage_instance.speaker_count,
                topic: data.stage_instance.topic
            };
        if (data.target_application !== undefined)
            this.targetApplication = new PartialApplication_1.default(data.target_application, this.client);
        if (data.guild_scheduled_event !== undefined)
            this.guildScheduledEvent = guild.scheduledEvents.update(data.guild_scheduled_event);
        if (data.target_user !== undefined)
            this.targetUser = this.client.users.update(data.target_user);
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
     * @param reason The reason for deleting this invite.
     */
    async deleteInvite(reason) {
        return this.client.rest.channels.deleteInvite(this.code, reason);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52aXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvSW52aXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQWdDO0FBQ2hDLG9EQUE0QjtBQUc1Qiw4RUFBc0Q7QUFjdEQsNENBQTRDO0FBRTVDLG9FQUE0QztBQUc1Qyw0QkFBNEI7QUFDNUIsTUFBcUIsTUFBTTtJQUN2QixpRkFBaUY7SUFDakYsc0JBQXNCLENBQVU7SUFDaEMsa0ZBQWtGO0lBQ2xGLHdCQUF3QixDQUFVO0lBQ2xDLHdDQUF3QztJQUN4QyxPQUFPLENBQTZCO0lBQ3BDLE1BQU0sQ0FBVTtJQUNoQiwrQkFBK0I7SUFDL0IsSUFBSSxDQUFTO0lBQ2Isb0NBQW9DO0lBQ3BDLFNBQVMsQ0FBK0M7SUFDeEQsNkNBQTZDO0lBQzdDLFNBQVMsQ0FBaUU7SUFDMUUsc0NBQXNDO0lBQ3RDLEtBQUssQ0FBUztJQUNkLHVEQUF1RDtJQUN2RCxtQkFBbUIsQ0FBdUI7SUFDMUMseUNBQXlDO0lBQ3pDLE9BQU8sQ0FBUTtJQUNmLGdEQUFnRDtJQUNoRCxNQUFNLENBQTZDO0lBQ25ELDJEQUEyRDtJQUMzRCxPQUFPLENBQTZDO0lBQ3BELHFGQUFxRjtJQUNyRixhQUFhLENBQXVCO0lBQ3BDLHNEQUFzRDtJQUN0RCxpQkFBaUIsQ0FBc0I7SUFDdkMsZ0lBQWdJO0lBQ2hJLFVBQVUsQ0FBcUI7SUFDL0IsNkVBQTZFO0lBQzdFLFVBQVUsQ0FBUTtJQUNsQix1REFBdUQ7SUFDdkQsU0FBUyxDQUE4QztJQUN2RCxxREFBcUQ7SUFDckQsSUFBSSxDQUE2QztJQUNqRCxZQUFZLElBQXVDLEVBQUUsTUFBYztRQUMvRCxvQkFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsU0FBUyxH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