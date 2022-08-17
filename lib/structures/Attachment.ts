import Base from "./Base";
import type Client from "../Client";
import type { RawAttachment } from "../routes/Channels";

export default class Attachment extends Base {
	contentType?: string;
	description?: string;
	ephemeral?: boolean;
	filename: string;
	height?: number;
	proxyURL: string;
	size: number;
	url: string;
	width?: number;
	constructor(data: RawAttachment, client: Client) {
		super(data.id, client);
		this.update(data);
	}

	protected update(data: RawAttachment) {
		this.contentType = data.content_type;
		this.description = data.description;
		this.ephemeral   = data.ephemeral;
		this.filename    = data.filename;
		this.height      = data.height;
		this.proxyURL    = data.proxy_url;
		this.size        = data.size;
		this.url         = data.url;
		this.width       = data.width;
	}

	toJSON(props = []) {
		return super.toJSON([
			"contentType",
			"description",
			"ephemeral",
			"filename",
			"height",
			"proxyURL",
			"size",
			"url",
			"width",
			...props
		]);
	}
}
