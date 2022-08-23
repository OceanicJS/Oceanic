import RequestHandler from "./RequestHandler";
import type Client from "../Client";
import Channels from "../routes/Channels";
import Guilds from "../routes/Guilds";
import Users from "../routes/Users";
import Properties from "../util/Properties";
import OAuth from "../routes/OAuth";
import Webhooks from "../routes/Webhooks";
import type { RESTOptions } from "../types/client";
import type { RequestOptions } from "../types/request-handler";
import ApplicationCommands from "../routes/ApplicationCommands";
import Interactions from "../routes/Interactions";

export default class RESTManager {
	private _client: Client;
	private _handler: RequestHandler;
	applicationCommands: ApplicationCommands;
	channels: Channels;
	guilds: Guilds;
	interactions: Interactions;
	oauth: OAuth;
	users: Users;
	webhooks: Webhooks;
	constructor(client: Client, options?: RESTOptions) {
		Properties.new(this)
			.looseDefine("_client", client)
			.looseDefine("_handler", new RequestHandler(this, options))
			.define("applicationCommands", new ApplicationCommands(this))
			.define("channels", new Channels(this))
			.define("guilds", new Guilds(this))
			.define("interactions", new Interactions(this))
			.define("oauth", new OAuth(this))
			.define("users", new Users(this))
			.define("webhooks", new Webhooks(this));
	}

	get client() { return this._client; }

	/** @hidden intentionally not documented - this is an internal function */
	_convertImage(image: Buffer | string, name: string) {
		try {
			return this._client._convertImage(image);
		} catch (err) {
			throw new Error(`Invalid ${name} provided. Ensure you are providing a valid, fully-qualified base64 url.`, { cause: err as Error });
		}
	}

	/** Alias for {@link RequestHandler#authRequest} */
	async authRequest<T = unknown>(options: Omit<RequestOptions, "auth">) {
		return this._handler.authRequest<T>(options);
	}

	/** Alias for {@link RequestHandler#request} */
	async request<T = unknown>(options: RequestOptions) {
		return this._handler.request<T>(options);
	}
}
