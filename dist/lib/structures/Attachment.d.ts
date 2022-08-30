import Base from "./Base";
import type Client from "../Client";
import type { RawAttachment } from "../types/channels";
import type { JSONAttachment } from "../types/json";
/** Represents a file attachment. */
export default class Attachment extends Base {
    /** The mime type of this attachment. */
    contentType?: string;
    /** The description of this attachment. */
    description?: string;
    /** If this attachment is ephemeral. Ephemeral attachments will be removed after a set period of time. */
    ephemeral?: boolean;
    /** The filename of this attachment. */
    filename: string;
    /** The height of this attachment, if an image. */
    height?: number;
    /** A proxied url of this attachment. */
    proxyURL: string;
    /** The size of this attachment. */
    size: number;
    /** The source url of this attachment. */
    url: string;
    /** The width of this attachment, if an image. */
    width?: number;
    constructor(data: RawAttachment, client: Client);
    toJSON(): JSONAttachment;
}
