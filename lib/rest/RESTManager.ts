import type { RequestOptions } from "./RequestHandler";
import RequestHandler from "./RequestHandler";
import type Client from "../Client";
import Channels from "../routes/Channels";
import Guilds from "../routes/Guilds";
import Users from "../routes/Users";
import Properties from "../util/Properties";
import OAuth from "../routes/OAuth";
import type { RESTOptions } from "../Client";
import Webhooks from "../routes/Webhooks";

export default class RESTManager {
	private _client: Client;
	private _handler: RequestHandler;
	channels: Channels;
	guilds: Guilds;
	oauth: OAuth;
	users: Users;
	webhooks: Webhooks;
	constructor(client: Client, options?: RESTOptions) {
		Properties.new(this)
			.looseDefine("_client", client)
			.looseDefine("_handler", new RequestHandler(this, options))
			.define("channels", new Channels(this))
			.define("guilds", new Guilds(this))
			.define("oauth", new OAuth(this))
			.define("users", new Users(this))
			.define("webhooks", new Webhooks(this));
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
