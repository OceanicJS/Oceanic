import Base from "./Base";
import type User from "./User";
import type Client from "../Client";
import type { TeamMembershipState } from "../Constants";
import type { RawTeam } from "../types/oauth";
import type { Uncached } from "../types/shared";

export default class Team extends Base {
	/** The icon hash of this team. */
	icon: string | null;
	/** The members of this team. */
	members: Array<TeamMember>;
	/** The name of this team. */
	name: string;
	/** The owner of this team. This can be a partial object with just an `id` property. */
	ownerUser: User | Uncached;
	constructor(data: RawTeam, client: Client) {
		super(data.id, client);
		this.members = [];
		this.update(data);
	}

	protected update(data: Partial<RawTeam>) {
		if (data.icon !== undefined) this.icon = data.icon;
		if (data.name !== undefined) this.name = data.name;
		if (data.owner_user_id !== undefined) this.ownerUser = this._client.users.get(data.owner_user_id) || { id: data.owner_user_id };
		if (data.members !== undefined) {
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

	override toJSON(props: Array<string> = []) {
		return super.toJSON([
			"icon",
			"members",
			"name",
			"ownerUser",
			...props
		]);
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
