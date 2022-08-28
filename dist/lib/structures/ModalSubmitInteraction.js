"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Interaction_1 = __importDefault(require("./Interaction"));
const Member_1 = __importDefault(require("./Member"));
const Guild_1 = __importDefault(require("./Guild"));
const Permission_1 = __importDefault(require("./Permission"));
class ModalSubmitInteraction extends Interaction_1.default {
    /** The permissions the bot has in the channel this interaction was sent from. */
    appPermissions;
    /** The channel this interaction was sent from. This can be a partial object with only an `id`. */
    channel;
    /** The data associated with the interaction. */
    data;
    /** The guild this interaction was sent from, if applicable. This can be a partial object with only an `id`. */
    guild;
    /** The preferred [locale](https://discord.com/developers/docs/reference#locales) of the guild this interaction was sent from, if applicable. */
    guildLocale;
    /** The [locale](https://discord.com/developers/docs/reference#locales) of the invoking user. */
    locale;
    /** The member associated with the invoking user. */
    member;
    /** The user that invoked this interaction. */
    user;
    constructor(data, client) {
        super(data, client);
        this.appPermissions = !data.app_permissions ? undefined : new Permission_1.default(data.app_permissions);
        this.channel = this._client.getChannel(data.channel_id);
        this.data = {
            components: data.data.components,
            customID: data.data.custom_id
        };
        this.guild = !data.guild_id ? undefined : this._client.guilds.get(data.guild_id);
        this.guildLocale = data.guild_locale;
        this.locale = data.locale;
        this.member = data.member ? this.guild instanceof Guild_1.default ? this.guild.members.update({ ...data.member, id: data.member.user.id }, this.guild.id) : new Member_1.default(data.member, this._client, this.guild.id) : undefined;
        this.user = this._client.users.update((data.user || data.member.user));
    }
    toJSON() {
        return {
            ...super.toJSON(),
            appPermissions: this.appPermissions?.toJSON(),
            channel: this.channel.id,
            data: this.data,
            guild: this.guild?.id,
            guildLocale: this.guildLocale,
            locale: this.locale,
            member: this.member?.toJSON(),
            type: this.type,
            user: this.user.toJSON()
        };
    }
}
exports.default = ModalSubmitInteraction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kYWxTdWJtaXRJbnRlcmFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL01vZGFsU3VibWl0SW50ZXJhY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnRUFBd0M7QUFDeEMsc0RBQThCO0FBRTlCLG9EQUE0QjtBQUM1Qiw4REFBc0M7QUFPdEMsTUFBcUIsc0JBQXVCLFNBQVEscUJBQVc7SUFDOUQsaUZBQWlGO0lBQ2pGLGNBQWMsQ0FBYztJQUM1QixrR0FBa0c7SUFDbEcsT0FBTyxDQUFpQjtJQUN4QixnREFBZ0Q7SUFDaEQsSUFBSSxDQUE2QjtJQUNqQywrR0FBK0c7SUFDL0csS0FBSyxDQUFTO0lBQ2QsZ0pBQWdKO0lBQ2hKLFdBQVcsQ0FBVTtJQUNyQixnR0FBZ0c7SUFDaEcsTUFBTSxDQUFTO0lBQ2Ysb0RBQW9EO0lBQ3BELE1BQU0sQ0FBVTtJQUVoQiw4Q0FBOEM7SUFDOUMsSUFBSSxDQUFPO0lBQ1gsWUFBWSxJQUErQixFQUFFLE1BQWM7UUFDMUQsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLG9CQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQy9GLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQWlCLElBQUksQ0FBQyxVQUFXLENBQUUsQ0FBQztRQUMxRSxJQUFJLENBQUMsSUFBSSxHQUFHO1lBQ1gsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVTtZQUNoQyxRQUFRLEVBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTO1NBQy9CLENBQUM7UUFDRixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pGLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUNyQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFPLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxZQUFZLGVBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNwTixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU8sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFUSxNQUFNO1FBQ2QsT0FBTztZQUNOLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNqQixjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxNQUFNLEVBQUU7WUFDN0MsT0FBTyxFQUFTLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUMvQixJQUFJLEVBQVksSUFBSSxDQUFDLElBQUk7WUFDekIsS0FBSyxFQUFXLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUM5QixXQUFXLEVBQUssSUFBSSxDQUFDLFdBQVc7WUFDaEMsTUFBTSxFQUFVLElBQUksQ0FBQyxNQUFNO1lBQzNCLE1BQU0sRUFBVSxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtZQUNyQyxJQUFJLEVBQVksSUFBSSxDQUFDLElBQUk7WUFDekIsSUFBSSxFQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1NBQ2xDLENBQUM7SUFDSCxDQUFDO0NBQ0Q7QUEvQ0QseUNBK0NDIn0=