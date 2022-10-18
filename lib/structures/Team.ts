/** @module Team */
import Base from "./Base";
import type User from "./User";
import type Client from "../Client";
import type { RawTeam, TeamMember } from "../types/oauth";
import type { JSONTeam } from "../types/json";

/** Represents an OAuth team. */
export default class Team extends Base {
    /** The icon hash of this team. */
    icon: string | null;
    /** The members of this team. */
    members: Array<TeamMember>;
    /** The name of this team. */
    name: string;
    /** The owner of this team. */
    owner?: User;
    /** The ID of the owner of this team. */
    ownerID: string;
    constructor(data: RawTeam, client: Client) {
        super(data.id, client);
        this.icon = null;
        this.members = [];
        this.name = data.name;
        this.owner = this.client.users.get(data.owner_user_id);
        this.ownerID = data.owner_user_id;
        this.update(data);
    }

    protected override update(data: Partial<RawTeam>): void {
        if (data.icon !== undefined) {
            this.icon = data.icon;
        }
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.owner_user_id !== undefined) {
            this.owner = this.client.users.get(data.owner_user_id);
            this.ownerID = data.owner_user_id;
        }
        if (data.members !== undefined) {
            for (const member of this.members) {
                if (!data.members.some(m => m.user.id === member.user.id)) {
                    this.members.splice(this.members.indexOf(member), 1);
                }
            }

            for (const member of data.members) {
                if (!this.members.some(m => m.user.id === member.user.id)) {
                    this.members.push({
                        membershipState: member.membership_state,
                        permissions:     member.permissions,
                        teamID:          member.team_id,
                        user:            this.client.users.update(member.user)
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
            ownerID: this.ownerID
        };
    }
}
