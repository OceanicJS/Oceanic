import BaseRoute from "./BaseRoute";
import type { RawGuild } from "../types/guilds";
import * as Routes from "../util/Routes";
import Guild from "../structures/Guild";

export default class Guilds extends BaseRoute {
	async get(id: string) {
		return this._manager.authRequest<RawGuild>({
			method: "GET",
			path:   Routes.GUILD(id)
		}).then(data => new Guild(data, this._client));
	}
}
