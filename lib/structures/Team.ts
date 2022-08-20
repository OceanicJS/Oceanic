import Base from "./Base";
import type User from "./User";
import type Client from "../Client";
import type { TeamMembershipState } from "../Constants";
import type { RawTeam } from "../types/oauth";

export default class Team extends Base {
	/** The icon hash of this team. */
	icon: string | null;
	/** The members of this team. */
	members: Array<TeamMember>;
	/** The name of this team. */
	name: string;
	/** The id of the owner of this team. */
	ownerUserID: string;
	/** @hideconstructor */
	constructor(data: RawTeam, client: Client) {
		super(data.id, client);
		this.members = [];
		this.update(data);
	}

	protected update(data: RawTeam) {
		this.icon = data.icon;
		this.name = data.name;
		this.ownerUserID = data.owner_user_id;
		for (const member of this.members) {
			if (!data.members.find(m => m.user.id === member.user.id)) this.members.splice(this.members.indexOf(member), 1);
		}
		for (const member of data.members) {
			if (!this.members.find(m => m.user.id === member.user.id)) {
				this.members.push({
					membershipState: member.membership_state,
					permissions:     member.permissions,
					teamID:          member.team_id,
					user:            this._client.users.update(member.user)
				});
			}
		}
	}
}

export interface TeamMember {
	/** This member's [membership state](https://discord.com/developers/docs/topics/teams#data-models-membership-state-enum) on this team. */
	membershipState: TeamMembershipState;
	/** An array of permissions this member has for this team. Currently always only has one entry: `*`.  */
	permissions: ["*"];
	/** The id of the team this member is associated with. */
	teamID: string;
	/** The user associated with this team member. */
	user: User;
}
