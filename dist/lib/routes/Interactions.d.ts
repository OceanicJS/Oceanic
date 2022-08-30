import BaseRoute from "./BaseRoute";
import type { InteractionContent, InteractionResponse } from "../types/interactions";
import type { AnyGuildTextChannel } from "../types/channels";
import Message from "../structures/Message";
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
    createFollowupMessage<T extends AnyGuildTextChannel>(applicationID: string, interactionToken: string, options: InteractionContent): Promise<Message<T>>;
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
    createInteractionResponse(interactionID: string, interactionToken: string, options: InteractionResponse): Promise<void>;
    /**
     * Delete a follow up message.
     *
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @param {String} messageID - The ID of the message.
     * @returns {Promise<void>}
     */
    deleteFollowupMessage(applicationID: string, interactionToken: string, messageID: string): Promise<void>;
    /**
     * Delete the original interaction response. Does not work with ephemeral messages.
     *
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @returns {Promise<void>}
     */
    deleteOriginalMessage(applicationID: string, interactionToken: string): Promise<void>;
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
    editFollowupMessage<T extends AnyGuildTextChannel>(applicationID: string, interactionToken: string, messageID: string, options: InteractionContent): Promise<Message<T>>;
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
    editOriginalMessage<T extends AnyGuildTextChannel>(applicationID: string, interactionToken: string, options: InteractionContent): Promise<Message<T>>;
    /**
     * Get a followup message.
     *
     * @template {AnyGuildTextChannel} T
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @param {String} messageID - The ID of the message.
     * @returns {Promise<Message<T>>}
     */
    getFollowupMessage<T extends AnyGuildTextChannel>(applicationID: string, interactionToken: string, messageID: string): Promise<Message<T>>;
    /**
     * Get an original interaction response.
     *
     * @template {AnyGuildTextChannel} T
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @returns {Promise<Message<T>>}
     */
    getOriginalMessage<T extends AnyGuildTextChannel>(applicationID: string, interactionToken: string): Promise<Message<T>>;
}
