import Base from "./Base";
import type User from "./User";
import type Client from "../Client";
import type { TeamMembershipState } from "../Constants";
import type { RawTeam } from "../types/oauth";

export default class Team extends Base {
	icon: string | null;
	members: Array<TeamMember>;
	name: string;
	ownerUserID: string;
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
	membershipState: TeamMembershipState;
	permissions: ["*"];
	teamID: string;
	user: User;
}
