"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = __importDefault(require("./BaseRoute"));
const Routes = __importStar(require("../util/Routes"));
const Constants_1 = require("../Constants");
class Interactions extends BaseRoute_1.default {
    /**
     * Create a followup message.
     *
     * @template {AnyGuildTextChannel} T
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @param {Object} options
     * @param {Object} [options.allowedMentions] - An object that specifies the allowed mentions in this message.
     * @param {Boolean} [options.allowedMentions.everyone] - If `@everyone`/`@here` mentions should be allowed.
     * @param {Boolean} [options.allowedMentions.repliedUser] - If the replied user (`messageReference`) should be mentioned.
     * @param {(Boolean | String[])} [options.allowedMentions.roles] - An array of role ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {(Boolean | String[])} [options.allowedMentions.users] - An array of user ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {Object[]} [options.attachments] - An array of [attachment information](https://discord.com/developers/docs/resources/channel#attachment-object) related to the sent files.
     * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send.
     * @param {String} [options.content] - The content of the message.
     * @param {Object[]} [options.embeds] - An array of [embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send.
     * @param {File[]} [options.files] - The files to send.
     * @param {Number} [options.flags] - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to send with the message.
     * @param {Boolean} [options.tts] - If the message should be spoken aloud.
     * @returns {Promise<Message<T>>}
     */
    async createFollowupMessage(applicationID, interactionToken, options) {
        return this._manager.webhooks.execute(applicationID, interactionToken, options);
    }
    /**
     * Create an initial interaction response.
     *
     * @param {String} interactionID - The ID of the interaction.
     * @param {String} interactionToken - The token of the interaction.
     * @param {Object} options
     * @param {unknown} [options.data] - The [response data](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure). Convert any `snake_case` keys to `camelCase`.
     * @param {InteractionResponseTypes} options.type - The [type](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type) of response.
     * @return {Promise<void>}
     */
    async createInteractionResponse(interactionID, interactionToken, options) {
        let data;
        switch (options.type) {
            case Constants_1.InteractionResponseTypes.PONG: break;
            case Constants_1.InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE:
            case Constants_1.InteractionResponseTypes.UPDATE_MESSAGE: {
                data = {
                    allowed_mentions: this._client.util.formatAllowedMentions(options.data.allowedMentions),
                    attachments: options.data.attachments,
                    content: options.data.content,
                    components: options.data.components ? this._client.util.componentsToRaw(options.data.components) : [],
                    embeds: options.data.embeds,
                    flags: options.data.flags
                };
                break;
            }
            case Constants_1.InteractionResponseTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT: {
                data = options.data.map(d => ({
                    name: d.name,
                    name_localizations: d.nameLocalizations,
                    value: d.value
                }));
                break;
            }
            case Constants_1.InteractionResponseTypes.MODAL: {
                data = {
                    custom_id: options.data.customID,
                    components: this._client.util.componentsToRaw(options.data.components),
                    title: options.data.title
                };
                break;
            }
            default: {
                data = options.data;
                break;
            }
        }
        await this._manager.authRequest({
            method: "POST",
            path: Routes.INTERACTION_CALLBACK(interactionID, interactionToken),
            json: {
                data,
                type: options.type
            }
        });
    }
    /**
     * Delete a follow up message.
     *
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @param {String} messageID - The ID of the message.
     * @returns {Promise<void>}
     */
    async deleteFollowupMessage(applicationID, interactionToken, messageID) {
        await this._manager.webhooks.deleteMessage(applicationID, interactionToken, messageID);
    }
    /**
     * Delete the original interaction response. Does not work with ephemeral messages.
     *
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @returns {Promise<void>}
     */
    async deleteOriginalMessage(applicationID, interactionToken) {
        await this._manager.webhooks.deleteMessage(applicationID, interactionToken, "@original");
    }
    /**
     * Edit a followup message.
     *
     * @template {AnyGuildTextChannel} T
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @param {String} messageID - The ID of the message.
     * @param {Object} options
     * @param {Object} [options.allowedMentions] - An object that specifies the allowed mentions in this message.
     * @param {Boolean} [options.allowedMentions.everyone] - If `@everyone`/`@here` mentions should be allowed.
     * @param {Boolean} [options.allowedMentions.repliedUser] - If the replied user (`messageReference`) should be mentioned.
     * @param {(Boolean | String[])} [options.allowedMentions.roles] - An array of role ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {(Boolean | String[])} [options.allowedMentions.users] - An array of user ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {Object[]} [options.attachments] - An array of [attachment information](https://discord.com/developers/docs/resources/channel#attachment-object) related to the sent files.
     * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send.
     * @param {String} [options.content] - The content of the message.
     * @param {Object[]} [options.embeds] - An array of [embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send.
     * @param {File[]} [options.files] - The files to send.
     * @param {Number} [options.flags] - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to send with the message.
     * @param {Boolean} [options.tts] - If the message should be spoken aloud.
     * @returns {Promise<Message<T>>}
     */
    async editFollowupMessage(applicationID, interactionToken, messageID, options) {
        return this._manager.webhooks.editMessage(applicationID, interactionToken, messageID, options);
    }
    /**
     * Edit an original interaction response.
     *
     * @template {AnyGuildTextChannel} T
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @param {Object} options
     * @param {Object} [options.allowedMentions] - An object that specifies the allowed mentions in this message.
     * @param {Boolean} [options.allowedMentions.everyone] - If `@everyone`/`@here` mentions should be allowed.
     * @param {Boolean} [options.allowedMentions.repliedUser] - If the replied user (`messageReference`) should be mentioned.
     * @param {(Boolean | String[])} [options.allowedMentions.roles] - An array of role ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {(Boolean | String[])} [options.allowedMentions.users] - An array of user ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {Object[]} [options.attachments] - An array of [attachment information](https://discord.com/developers/docs/resources/channel#attachment-object) related to the sent files.
     * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send.
     * @param {String} [options.content] - The content of the message.
     * @param {Object[]} [options.embeds] - An array of [embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send.
     * @param {File[]} [options.files] - The files to send.
     * @param {Number} [options.flags] - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to send with the message.
     * @param {Boolean} [options.tts] - If the message should be spoken aloud.
     * @returns {Promise<Message<T>>}
     */
    async editOriginalMessage(applicationID, interactionToken, options) {
        return this._manager.webhooks.editMessage(applicationID, interactionToken, "@original", options);
    }
    /**
     * Get a followup message.
     *
     * @template {AnyGuildTextChannel} T
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @param {String} messageID - The ID of the message.
     * @returns {Promise<Message<T>>}
     */
    async getFollowupMessage(applicationID, interactionToken, messageID) {
        return this._manager.webhooks.getMessage(applicationID, interactionToken, messageID);
    }
    /**
     * Get an original interaction response.
     *
     * @template {AnyGuildTextChannel} T
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @returns {Promise<Message<T>>}
     */
    async getOriginalMessage(applicationID, interactionToken) {
        return this._manager.webhooks.getMessage(applicationID, interactionToken, "@original");
    }
}
exports.default = Interactions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZXJhY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3JvdXRlcy9JbnRlcmFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDREQUFvQztBQUdwQyx1REFBeUM7QUFDekMsNENBQXdEO0FBS3hELE1BQXFCLFlBQWEsU0FBUSxtQkFBUztJQUMvQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FvQkc7SUFDSCxLQUFLLENBQUMscUJBQXFCLENBQWdDLGFBQXFCLEVBQUUsZ0JBQXdCLEVBQUUsT0FBMkI7UUFDbkksT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUksYUFBYSxFQUFFLGdCQUFnQixFQUFFLE9BQW9DLENBQUMsQ0FBQztJQUNwSCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsS0FBSyxDQUFDLHlCQUF5QixDQUFDLGFBQXFCLEVBQUUsZ0JBQXdCLEVBQUUsT0FBNEI7UUFDekcsSUFBSSxJQUF5QixDQUFDO1FBQzlCLFFBQVEsT0FBTyxDQUFDLElBQUksRUFBRTtZQUNsQixLQUFLLG9DQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU07WUFDMUMsS0FBSyxvQ0FBd0IsQ0FBQywyQkFBMkIsQ0FBQztZQUMxRCxLQUFLLG9DQUF3QixDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUMxQyxJQUFJLEdBQUc7b0JBQ0gsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUM7b0JBQ3ZGLFdBQVcsRUFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVc7b0JBQzFDLE9BQU8sRUFBVyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU87b0JBQ3RDLFVBQVUsRUFBUSxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMs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