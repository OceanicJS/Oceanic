import Base from "./Base";
import Permission from "./Permission";
import type { OverwriteTypes, Permission as PermissionNames } from "../Constants";
import type Client from "../Client";
import Properties from "../util/Properties";
import type { RawOverwrite } from "../types/channels";

export default class PermissionOverwrite extends Base {
	permission: Permission;
	type: OverwriteTypes;
	constructor(data: RawOverwrite, client: Client) {
		super(data.id, client);
		Properties.looseDefine(this, "_client", client);
		this.permission = new Permission(data.allow, data.deny);
		this.type = data.type;
		this.update(data);
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function,, @typescript-eslint/no-unused-vars
	protected update(data: RawOverwrite) { }

	/** A key-value map of permission to if it's been allowed or denied (not present if neither) */
	get json() { return this.permission.json; }

	/**
	 *Check if this permissions instance has the given permissions allowed
	 *
	 * @param {...PermissionNames} permissions - The permissions to check for.
	 * @returns {Boolean}
	 */
	has(...permissions: Array<PermissionNames>) {
		return this.permission.has(...permissions);
	}

	override toJSON(props: Array<string> = []) {
		return super.toJSON(["type", ...props]);
	}
}
