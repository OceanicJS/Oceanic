import Properties from "./util/Properties";
import type { ImageFormat } from "./Constants";
import { MAX_IMAGE_SIZE, MIN_IMAGE_SIZE, ImageFormats } from "./Constants";
import { CDN_URL } from "./util/Routes";
import RESTManager from "./rest/RESTManager";
import Collection from "./util/Collection";
import PrivateChannel from "./structures/PrivateChannel";
import GroupChannel from "./structures/GroupChannel";
import User from "./structures/User";
import Guild from "./structures/Guild";
import type {
	AllowedMentions,
	AnyChannel,
	RawAllowedMentions,
	RawGroupChannel,
	RawPrivateChannel
} from "./types/channels";
import type { RawGuild } from "./types/guilds";
import type { RawUser } from "./types/users";
import type { ClientEvents, ClientInstanceOptions, ClientOptions } from "./types/client";
import TypedEmitter from "./util/TypedEmitter";

const BASE64URL_REGEX = /^data:image\/(?:jpeg|png|gif);base64,(?:[A-Za-z0-9+/]{2}[A-Za-z0-9+/]{2})*(?:[A-Za-z0-9+/]{2}(==)?|[A-Za-z0-9+/]{3}=?)?$/;
/** The primary class for interfacing with Discord. */
export default class Client extends TypedEmitter<ClientEvents> {
	channelGuildMap: Map<string, string>;
	groupChannels: Collection<string, RawGroupChannel, GroupChannel>;
	guilds: Collection<string, RawGuild, Guild>;
	options: ClientInstanceOptions;
	privateChannelMap: Map<string, string>;
	privateChannels: Collection<string, RawPrivateChannel, PrivateChannel>;
	rest: RESTManager;
	threadGuildMap: Map<string, string>;
	users: Collection<string, RawUser, User>;
	constructor(options?: ClientOptions) {
		super();
		Properties.new(this)
			.define("options", {
				allowedMentions: options?.allowedMentions || {
					users: true,
					roles: true
				},
				auth:               options?.auth || null,
				defaultImageFormat: options?.defaultImageFormat || "png",
				defaultImageSize:   options?.defaultImageSize || 4096
			})
			.define("channelGuildMap", new Map())
			.define("groupChannels", new Collection(GroupChannel, this))
			.define("guilds", new Collection(Guild, this))
			.define("privateChannelMap", new Map())
			.define("privateChannels", new Collection(PrivateChannel, this))
			.define("rest", new RESTManager(this, options?.rest))
			.define("threadGuildMap", new Map())
			.define("users", new Collection(User, this));
	}

	/** @hidden intentionally not documented - this is an internal function */
	_convertImage(img: Buffer | string) {
		if (Buffer.isBuffer(img)) {
			const b64 = img.toString("base64");
			let mime: string | undefined;
			const magic = [...new Uint8Array(img.subarray(0, 4))].map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
			switch (magic) {
				case "47494638": mime = "image/gif"; break;
				case "89504E47": mime = "image/png"; break;
				case "FFD8FFDB": case "FFD8FFE0": case "49460001": case "FFD8FFEE": case "69660000": mime = "image/jpeg"; break;
			}
			if (!mime) throw new Error(`Failed to determine image format. (magic: ${magic})`);
			img = `data:${mime};base64,${b64}`;
		}
		if (!BASE64URL_REGEX.test(img)) throw new Error("Invalid image provided. Ensure you are providing a valid, fully-qualified base64 url.");
		return img;
	}

	/** @hidden intentionally not documented - this is an internal function */
	_formatAllowedMentions(allowed?: AllowedMentions): RawAllowedMentions {
		const result: RawAllowedMentions = {
			parse: []
		};

		if (!allowed) return this._formatAllowedMentions(this.options.allowedMentions);

		if (allowed.everyone === true) result.parse.push("everyone");

		if (allowed.roles === true) result.parse.push("roles");
		else if (Array.isArray(allowed.roles)) result.roles = allowed.roles;

		if (allowed.users === true) result.parse.push("users");
		else if (Array.isArray(allowed.users)) result.users = allowed.users;

		if (allowed.repliedUser === true) result.replied_user = true;

		return result;
	}

	/** @hidden intentionally not documented - this is an internal function */
	_formatImage(url: string, format?: ImageFormat, size?: number) {
		if (!format || !ImageFormats.includes(format.toLowerCase() as ImageFormat)) format = url.includes("/a_") ? "gif" : this.options.defaultImageFormat;
		if (!size || size < MIN_IMAGE_SIZE || size > MAX_IMAGE_SIZE) size = this.options.defaultImageSize;
		return `${CDN_URL}${url}.${format}?size=${size}`;
	}

	/* _showDeprecation(type: Deprecations, detail?: string) {
		let name: string;
		switch (type) {
			default: name = "UnknownDeprecation";
		}

		process.emitWarning(name, {
			type,
			detail
		});
	} */

	getChannel<T extends AnyChannel = AnyChannel>(id: string): T | undefined {
		if (this.channelGuildMap.has(id)) return this.guilds.get(this.channelGuildMap.get(id)!)?.channels.get(id) as T;
		return (this.privateChannels.get(id) || this.groupChannels.get(id)) as T;
	}
}
