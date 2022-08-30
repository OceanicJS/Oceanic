"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Channel_1 = __importDefault(require("./Channel"));
const Message_1 = __importDefault(require("./Message"));
const Collection_1 = __importDefault(require("../util/Collection"));
/** Represents a direct message with a user. */
class PrivateChannel extends Channel_1.default {
    /** The last message sent in this channel, if any. This can be a partial object with only an `id` property. */
    lastMessage;
    /** The cached messages in this channel. */
    messages;
    /** The other user in this direct message. */
    recipient;
    constructor(data, client) {
        super(data, client);
        this.messages = new Collection_1.default(Message_1.default, client);
        this.lastMessage = null;
        this.recipient = this._client.users.update(data.recipients[0]);
    }
    update(data) {
        if (data.last_message_id !== undefined)
            this.lastMessage = data.last_message_id === null ? null : this.messages.get(data.last_message_id) || { id: data.last_message_id };
    }
    /**
     * Create a message in this channel.
     * @param options - The options for creating the message.
     */
    async createMessage(options) {
        return this._client.rest.channels.createMessage(this.id, options);
    }
    /**
     * Add a reaction to a message in this channel.
     * @param messageID - The ID of the message to add a reaction to.
     * @param emoji - The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    async createReaction(messageID, emoji) {
        return this._client.rest.channels.createReaction(this.id, messageID, emoji);
    }
    /**
     * Delete a message in this channel.
     * @param messageID - The ID of the message to delete.
     * @param reason - The reason for deleting the message.
     */
    async deleteMessage(messageID, reason) {
        return this._client.rest.channels.deleteMessage(this.id, messageID, reason);
    }
    /**
     * Remove a reaction from a message in this channel.
     * @param messageID - The ID of the message to remove a reaction from.
     * @param emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    async deleteReaction(messageID, emoji) {
        return this._client.rest.channels.deleteReaction(this.id, messageID, emoji);
    }
    /**
     * Edit a message in this channel.
     * @param messageID - The ID of the message to edit.
     * @param options - The options for editing the message.
     */
    async editMessage(messageID, options) {
        return this._client.rest.channels.editMessage(this.id, messageID, options);
    }
    /**
     * Get a message in this channel.
     * @param messageID - The ID of the message to get.
     */
    async getMessage(messageID) {
        return this._client.rest.channels.getMessage(this.id, messageID);
    }
    /**
     * Get messages in this channel.
     * @param options - The options for getting the messages. All options are mutually exclusive.
     */
    async getMessages(options) {
        return this._client.rest.channels.getMessages(this.id, options);
    }
    /**
     * Get the pinned messages in this channel.
     */
    async getPinnedMessages() {
        return this._client.rest.channels.getPinnedMessages(this.id);
    }
    /**
     * Get the users who reacted with a specific emoji on a message.
     * @param messageID - The iIDd of the message to get reactions from.
     * @param emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param options - The options for getting the reactions.
     */
    async getReactions(messageID, emoji, options) {
        return this._client.rest.channels.getReactions(this.id, messageID, emoji, options);
    }
    /**
     * Pin a message in this channel.
     * @param messageID - The ID of the message to pin.
     * @param reason - The reason for pinning the message.
     */
    async pinMessage(messageID, reason) {
        return this._client.rest.channels.pinMessage(this.id, messageID, reason);
    }
    /**
     * Show a typing indicator in this channel.
     */
    async sendTyping() {
        return this._client.rest.channels.sendTyping(this.id);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            lastMessage: this.lastMessage?.id,
            messages: this.messages.map(message => message.id),
            recipient: this.recipient?.toJSON(),
            type: this.type
        };
    }
    /**
     * Unpin a message in this channel.
     * @param messageID - The ID of the message to unpin.
     * @param reason - The ID for unpinning the message.
     */
    async unpinMessage(messageID, reason) {
        return this._client.rest.channels.unpinMessage(this.id, messageID, reason);
    }
}
exports.default = PrivateChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJpdmF0ZUNoYW5uZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3RydWN0dXJlcy9Qcml2YXRlQ2hhbm5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHdEQUFnQztBQUVoQyx3REFBZ0M7QUFZaEMsb0VBQTRDO0FBRzVDLCtDQUErQztBQUMvQyxNQUFxQixjQUFlLFNBQVEsaUJBQU87SUFDL0MsOEdBQThHO0lBQzlHLFdBQVcsQ0FBNEI7SUFDdkMsMkNBQTJDO0lBQzNDLFFBQVEsQ0FBMEM7SUFDbEQsNkNBQTZDO0lBQzdDLFNBQVMsQ0FBTztJQUVoQixZQUFZLElBQXVCLEVBQUUsTUFBYztRQUMvQyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxvQkFBVSxDQUFDLGlCQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFUyxNQUFNLENBQUMsSUFBZ0M7UUFDN0MsSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDOUssQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBNkI7UUFDN0MsT0FBTyxJ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