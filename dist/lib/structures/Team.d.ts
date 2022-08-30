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
    constructor(data: RawTeam, client: Client);
    protected update(data: Partial<RawTeam>): void;
    toJSON(): JSONTeam;
}
