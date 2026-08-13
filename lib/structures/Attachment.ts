/** @module Attachment */
import Base from "./Base";
import type User from "./User";
import Application from "./Application";
import type * as Types from "../types/namespaced";
import type Client from "../Client";

/** Represents a file attachment. */
export default class Attachment extends Base {
    /** For Clips, the application in the stream, if recognized. */
    application?: Application;
    /** For Clips, when the clip was created. */
    clipCreatedAt?: Date;
    /** For Clips, array of users who were in the stream. */
    clipParticipants?: Array<User>;
    /** The mime type of this attachment. */
    contentType?: string;
    /** The description of this attachment. */
    description?: string;
    /** The duration of the attached audio file, if voice message. */
    durationSecs?: number;
    /** If this attachment is ephemeral. Ephemeral attachments will be removed after a set period of time. */
    ephemeral?: boolean;
    /** The filename of this attachment. */
    filename: string;
    /** The {@link Constants~AttachmentFlags | Attachment Flags } of this image. */
    flags: number;
    /** The height of this attachment, if an image. */
    height?: number;
    placeholder?: string;
    placeholderVersion?: number;
    /** A proxied url of this attachment. */
    proxyURL: string;
    /** The size of this attachment. */
    size: number;
    /** The title of this attachment. */
    title?: string;
    /** The source url of this attachment. */
    url: string;
    /** Base64 encoded bytearray representing a sampled waveform for voice messages. */
    waveform?: string;
    /** The width of this attachment, if an image. */
    width?: number;
    constructor(data: Types.Channels.RawAttachment, client: Client) {
        super(data.id, client);
        this.application = data.application ? new Application(data.application, client) : undefined;
        this.clipCreatedAt = data.clip_created_at ? new Date(data.clip_created_at) : undefined;
        this.clipParticipants = data.clip_participants ? data.clip_participants.map(user => client.users.update(user)) : undefined;
        this.contentType = data.content_type;
        this.description = data.description;
        this.durationSecs = data.duration_secs;
        this.ephemeral = data.ephemeral;
        this.filename = data.filename;
        this.flags = data.flags ?? 0;
        this.height = data.height;
        this.placeholder = data.placeholder;
        this.placeholderVersion = data.placeholder_version;
        this.proxyURL = data.proxy_url;
        this.size = data.size;
        this.url = data.url;
        this.waveform = data.waveform;
        this.width = data.width;
    }

    override toJSON(): Types.JSON.JSONAttachment {
        return {
            ...super.toJSON(),
            application:        this.application?.toJSON(),
            clipCreatedAt:      this.clipCreatedAt?.toISOString(),
            clipParticipants:   this.clipParticipants?.map(user => user.toJSON()),
            contentType:        this.contentType,
            description:        this.description,
            durationSecs:       this.durationSecs,
            ephemeral:          this.ephemeral,
            filename:           this.filename,
            flags:              this.flags,
            height:             this.height,
            placeholder:        this.placeholder,
            placeholderVersion: this.placeholderVersion,
            proxyURL:           this.proxyURL,
            size:               this.size,
            title:              this.title,
            url:                this.url,
            waveform:           this.waveform,
            width:              this.width
        };
    }
}
