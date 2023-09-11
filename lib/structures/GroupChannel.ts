/** @module GroupChannel */
import Channel from "./Channel.js";
import User from "./User.js";
import type ClientApplication from "./ClientApplication.js";
import type { ChannelTypes, ImageFormat } from "../Constants.js";
import type Client from "../Client.js";
import * as Routes from "../util/Routes.js";
import type { AddGroupRecipientOptions, EditGroupDMOptions, RawGroupChannel } from "../types/channels.js";
import type { RawUser } from "../types/users.js";
import TypedCollection from "../util/TypedCollection.js";
import type { JSONGroupChannel } from "../types/json.js";

/** Represents a group direct message. */
export default class GroupChannel extends Channel {
    /** The application that made this group channel. */
    application?: ClientApplication;
    /** The ID of the application that made this group channel. */
    applicationID: string;
    /** The icon hash of this group, if any. */
    icon: string | null;
    /** The ID of last message sent in this channel. */
    lastMessageID: string | null;
    /** If this group channel is managed by an application. */
    managed: boolean;
    /** The name of this group channel. */
    name: string | null;
    /** The nicknames used when creating this group channel. */
    nicks: Array<Record<"id" | "nick", string>>;
    /** The owner of this group channel. */
    owner?: User;
    /** The ID of the owner of this group channel. */
    ownerID: string;
    /** The other recipients in this group channel. */
    recipients: TypedCollection<RawUser, User>;
    declare type: ChannelTypes.GROUP_DM;
    constructor(data: RawGroupChannel, client: Client) {
        super(data, client);
        this.applicationID = data.application_id;
        this.icon = null;
        this.lastMessageID = data.last_message_id;
        this.managed = false;
        this.name = data.name;
        this.nicks = [];
        this.owner = this.client.users.get(data.owner_id);
        this.ownerID = data.owner_id;
        this.recipients = new TypedCollection(User, client, Infinity, {
            construct: (user): User => client.users.update(user)
        });
        for (const r of data.recipients) this.recipients.update(r);
        this.update(data);
    }

    protected override update(data: Partial<RawGroupChannel>): void {
        super.update(data);
        if (data.application_id !== undefined) {
            this.application = this.client["_application"] && this.client.application.id === data.application_id ? this.client.application : undefined;
            this.applicationID = data.application_id;
        }
        if (data.icon !== undefined) {
            this.icon = data.icon;
        }
        if (data.last_message_id !== undefined) {
            this.lastMessageID = data.last_message_id;
        }
        if (data.managed !== undefined) {
            this.managed = data.managed;
        }
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.nicks !== undefined) {
            this.nicks = data.nicks;
        }
        if (data.owner_id !== undefined) {
            this.owner = this.client.users.get(data.owner_id);
            this.ownerID = data.owner_id;
        }
        if (data.type !== undefined) {
            this.type = data.type;
        }
        if (data.recipients !== undefined) {
            this.recipients.clear();
            for (const r of data.recipients) {
                this.recipients.update(r);
            }

        }
    }

    /**
     * Add a user to this channel.
     * @param options The options for adding the user.
     */
    async addRecipient(options: AddGroupRecipientOptions): Promise<void> {
        return this.client.rest.channels.addGroupRecipient(this.id, options);
    }

    /**
     * Edit this channel.
     * @param options The options for editing the channel.
     */
    async edit(options: EditGroupDMOptions): Promise<this> {
        return this.client.rest.channels.edit<this>(this.id, options);
    }

    /**
     * The url of this application's icon.
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    iconURL(format?: ImageFormat, size?: number): string | null {
        return this.icon === null ? null : this.client.util.formatImage(Routes.APPLICATION_ICON(this.applicationID, this.icon), format, size);
    }

    /**
     * Remove a user from this channel.
     * @param userID The ID of the user to remove.
     */
    async removeRecipient(userID: string): Promise<void> {
        return this.client.rest.channels.removeGroupRecipient(this.id, userID);
    }

    /**
     * Show a typing indicator in this channel.
     */
    async sendTyping(): Promise<void> {
        return this.client.rest.channels.sendTyping(this.id);
    }

    override toJSON(): JSONGroupChannel {
        return {
            ...super.toJSON(),
            applicationID: this.applicationID,
            icon:          this.icon,
            managed:       this.managed,
            name:          this.name,
            nicks:         this.nicks,
            ownerID:       this.ownerID,
            recipients:    this.recipients.map(user => user.toJSON()),
            type:          this.type
        };
    }
}
