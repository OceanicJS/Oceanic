import Permission from "./Permission";
import Base from "./Base";
import type { RawOverwrite } from "../routes/Channels";
import type { OverwriteTypes } from "../Constants";

export default class PermissionOverwrite extends Permission {
	id: string;
	type: OverwriteTypes;
	constructor(data: RawOverwrite) {
		super(data.allow, data.deny);
		this.id = data.id;
		this.type = data.type;
	}

	override toJSON(props: Array<string> = []) {
		return super.toJSON(["type", ...props]);
	}

	toString() {
		return Base.prototype.toString.call(this);
	}
}
