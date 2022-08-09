import type { RequestOptions } from "./RequestHandler";
import RequestHandler from "./RequestHandler";
import type Client from "../Client";
import Channels from "../routes/Channels";
import Guilds from "../routes/Guilds";
import Users from "../routes/Users";
import Properties from "../util/Properties";
import OAuth from "../routes/OAuth";
import type { RESTOptions } from "../Client";

export default class RESTManager {
	private _client: Client;
	private _handler: RequestHandler;
	channels: Channels;
	guilds: Guilds;
	oauth: OAuth;
	users: Users;
	constructor(client: Client, options?: RESTOptions) {
		Properties.new(this)
			.define("_client", client)
			.define("_handler", new RequestHandler(this, options))
			.define("channels", new Channels(this))
			.define("guilds", new Guilds(this))
			.define("oauth", new OAuth(this))
			.define("users", new Users(this));
	}

	get client() { return this._client; }

	/** Alias for {@link RequestHandler#authRequest} */
	async authRequest<T = unknown>(options: Omit<RequestOptions, "auth">) {
		return this._handler.authRequest<T>(options);
	}

	/** Alias for {@link RequestHandler#request} */
	async request<T = unknown>(options: RequestOptions) {
		return this._handler.request<T>(options);
	}
}
