import type { File } from "./RequestHandler";
import RequestHandler from "./RequestHandler";
import type Client from "../Client";
import Channels from "../routes/Channels";
import Guilds from "../routes/Guilds";
import Users from "../routes/Users";
import Properties from "../util/Properties";
import type { RESTMethod } from "../Constants";

export default class RESTManager {
	private _client: Client;
	private _handler: RequestHandler;
	channels: Channels;
	guilds: Guilds;
	users: Users;
	constructor(client: Client) {
		Properties.new(this)
			.define("_client", client)
			.define("_handler", new RequestHandler(this))
			.define("channels", new Channels(this))
			.define("guilds", new Guilds(this))
			.define("users", new Users(this));
	}

	/** Alias for {@link RequestHandler#authRequest} */
	async authRequest<T = unknown>(method: RESTMethod, path: string, body?: unknown, files?: Array<File>, reason?: string, priority = false, route?: string) {
		return this._handler.authRequest<T>(method, path, body, files, reason, priority, route);
	}

	/** Alias for {@link RequestHandler#request} */
	async request<T = unknown>(method: RESTMethod, path: string, body?: unknown, files?: Array<File>, reason?: string, auth: boolean | string = false, priority = false, route?: string) {
		return this._handler.request<T>(method, path, body, files, reason, auth, priority, route);
	}
}
