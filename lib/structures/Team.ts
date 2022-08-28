import Base from "./Base";
import User from "./User";
import type Client from "../Client";
import type { RawTeam, TeamMember } from "../types/oauth";
import type { Uncached } from "../types/shared";
import type { JSONTeam } from "../types/json";

export default class Team extends Base {
    /** The icon hash of this team. */
    icon: string | null;
    /** The members of this team. */
    members: Array<TeamMember>;
    /** The name of this team. */
    name: string;
    /** The owner of this team. This can be a partial object with just an `id` property. */
    owner: User | Uncached;
    constructor(data: RawTeam, client: Client) {
        super(data.id, client);
        this.members = [];
        this.update(data);
    }

    protected update(data: Partial<RawTeam>) {
        if (data.icon !== undefined) this.icon = data.icon;
        if (data.name !== undefined) this.name = data.name;
        if (data.owner_user_id !== undefined) this.owner = this._client.users.get(data.owner_user_id) || { id: data.owner_user_id };
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

    override toJSON(): JSONTeam {
        return {
            ...super.toJSON(),
            icon:    this.icon,
            members: this.members,
            name:    this.name,
            owner:   this.owner instanceof User ? this.owner.toJSON() : this.owner.id
        };
    }
}
