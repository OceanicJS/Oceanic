import Base from "./Base";
import Permission from "./Permission";
import type { OverwriteTypes, Permission as PermissionNames } from "../Constants";
import type Client from "../Client";
import Properties from "../util/Properties";
import type { RawOverwrite } from "../types/channels";
import type { JSONPermissionOverwrite } from "../types/json";

export default class PermissionOverwrite extends Base {
    /** The permissions of this overwrite. */
    permission: Permission;
    /** The type of this overwrite. `0` for role, `1` for user. */
    type: OverwriteTypes;
    constructor(data: RawOverwrite, client: Client) {
        super(data.id, client);
        Properties.looseDefine(this, "_client", client);
        this.permission = new Permission(data.allow, data.deny);
        this.type = data.type;
    }

    get allow() { return this.permission.allow; }
    get deny() { return this.permission.deny; }

    /** A key-value map of permission to if it's been allowed or denied (not present if neither) */
    get json() { return this.permission.json; }

    /**
     *Check if this permissions instance has the given permissions allowed
     * @param permissions - The permissions to check for.
     */
    has(...permissions: Array<PermissionNames>) {
        return this.permission.has(...permissions);
    }

    override toJSON(): JSONPermissionOverwrite {
        return {
            ...super.toJSON(),
            permission: this.permission.toJSON(),
            type:       this.type
        };
    }
}
