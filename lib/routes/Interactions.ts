import BaseRoute from "./BaseRoute";
import type { InteractionContent, InteractionResponse } from "../types/interactions";
import type { ExecuteWebhookWaitOptions } from "../types/webhooks";
import * as Routes from "../util/Routes";
import { InteractionResponseTypes } from "../Constants";
import type { AnyGuildTextChannel } from "../types/channels";
import Message from "../structures/Message";
import { File } from "../types/request-handler";
import Util from "../util/Util";

export default class Interactions extends BaseRoute {
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
    async createFollowupMessage<T extends AnyGuildTextChannel>(applicationID: string, interactionToken: string, options: InteractionContent) {
        return this._manager.webhooks.execute<T>(applicationID, interactionToken, options as ExecuteWebhookWaitOptions);
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
    async createInteractionResponse(interactionID: string, interactionToken: string, options: InteractionResponse) {
        let data: unknown | undefined;
        switch (options.type) {
            case InteractionResponseTypes.PONG: break;
            case InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE:
            case InteractionResponseTypes.UPDATE_MESSAGE: {
                data = {
                    allowed_mentions: this._client._formatAllowedMentions(options.data.allowedMentions),
                    attachments:      options.data.attachments,
                    content:          options.data.content,
                    components:       options.data.components ? Util.formatComponents(options.data.components) : [],
                    embeds:           options.data.embeds,
                    flags:            options.data.flags
                };
                break;
            }

            case InteractionResponseTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT: {
                data = options.data.map(d => ({
                    name:               d.name,
                    name_localizations: d.nameLocalizations,
                    value:              d.value
                }));
                break;
            }

            case InteractionResponseTypes.MODAL: {
                data = {
                    custom_id:  options.data.customID,
                    components: Util.formatComponents(options.data.components),
                    title:      options.data.title
                };
                break;
            }

            default: {
                data = options.data;
                break;
            }
        }
        await this._manager.authRequest<null>({
            method: "POST",
            path:   Routes.INTERACTION_CALLBACK(interactionID, interactionToken),
            json:   {
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
    async deleteFollowupMessage(applicationID: string, interactionToken: string, messageID: string) {
        await this._manager.webhooks.deleteMessage(applicationID, interactionToken, messageID);
    }

    /**
     * Delete the original interaction response. Does not work with ephemeral messages.
     *
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @returns {Promise<void>}
     */
    async deleteOriginalMessage(applicationID: string, interactionToken: string) {
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
    async editFollowupMessage<T extends AnyGuildTextChannel>(applicationID: string, interactionToken: string, messageID: string, options: InteractionContent) {
        return this._manager.webhooks.editMessage<T>(applicationID, interactionToken, messageID, options);
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
    async editOriginalMessage<T extends AnyGuildTextChannel>(applicationID: string, interactionToken: string, options: InteractionContent) {
        return this._manager.webhooks.editMessage<T>(applicationID, interactionToken, "@original", options);
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
    async getFollowupMessage<T extends AnyGuildTextChannel>(applicationID: string, interactionToken: string, messageID: string) {
        return this._manager.webhooks.getMessage<T>(applicationID, interactionToken, messageID);
    }

    /**
     * Get an original interaction response.
     *
     * @template {AnyGuildTextChannel} T
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @returns {Promise<Message<T>>}
     */
    async getOriginalMessage<T extends AnyGuildTextChannel>(applicationID: string, interactionToken: string) {
        return this._manager.webhooks.getMessage<T>(applicationID, interactionToken, "@original");
    }
}
