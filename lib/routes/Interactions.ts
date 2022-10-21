/** @module Routes/Interactions */
import type { InteractionContent, InteractionResponse } from "../types/interactions";
import type { ExecuteWebhookWaitOptions } from "../types/webhooks";
import * as Routes from "../util/Routes";
import { InteractionResponseTypes } from "../Constants";
import type RESTManager from "../rest/RESTManager";
import type Message from "../structures/Message";
import type { AnyTextChannelWithoutGroup } from "../types/channels";
import type { Uncached } from "../types/shared";

/** Various methods for interacting with interactions. */
export default class Interactions {
    #manager: RESTManager;
    constructor(manager: RESTManager) {
        this.#manager = manager;
    }

    /**
     * Create a followup message.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     * @param options The options for creating the followup message.
     */
    async createFollowupMessage<T extends AnyTextChannelWithoutGroup | Uncached>(applicationID: string, interactionToken: string, options: InteractionContent): Promise<Message<T>> {
        return this.#manager.webhooks.execute<T>(applicationID, interactionToken, options as ExecuteWebhookWaitOptions);
    }

    /**
     * Create an initial interaction response.
     * @param interactionID The ID of the interaction.
     * @param interactionToken The token of the interaction.
     * @param options The options for creating the interaction response.
     */
    async createInteractionResponse(interactionID: string, interactionToken: string, options: InteractionResponse): Promise<void> {
        let data: unknown | undefined;
        switch (options.type) {
            case InteractionResponseTypes.PONG: {
                break;
            }
            case InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE:
            case InteractionResponseTypes.UPDATE_MESSAGE: {
                data = {
                    allowed_mentions: this.#manager.client.util.formatAllowedMentions(options.data.allowedMentions),
                    attachments:      options.data.attachments,
                    content:          options.data.content,
                    components:       options.data.components ? this.#manager.client.util.componentsToRaw(options.data.components) : undefined,
                    embeds:           options.data.embeds ? this.#manager.client.util.embedsToRaw(options.data.embeds) : undefined,
                    flags:            options.data.flags
                };
                break;
            }

            case InteractionResponseTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT: {
                data = {
                    choices: options.data.choices.map(d => ({
                        name:               d.name,
                        name_localizations: d.nameLocalizations,
                        value:              d.value
                    }))
                };
                break;
            }

            case InteractionResponseTypes.MODAL: {
                data = {
                    custom_id:  options.data.customID,
                    components: this.#manager.client.util.componentsToRaw(options.data.components),
                    title:      options.data.title
                };
                break;
            }

            default: {
                data = options.data;
                break;
            }
        }
        await this.#manager.authRequest<null>({
            method: "POST",
            path:   Routes.INTERACTION_CALLBACK(interactionID, interactionToken),
            route:  "/interactions/:id/:token/callback",
            json:   {
                data,
                type: options.type
            }
        });
    }

    /**
     * Delete a follow-up message.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     * @param messageID The ID of the message.
     */
    async deleteFollowupMessage(applicationID: string, interactionToken: string, messageID: string): Promise<void> {
        await this.#manager.webhooks.deleteMessage(applicationID, interactionToken, messageID);
    }

    /**
     * Delete the original interaction response.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     */
    async deleteOriginalMessage(applicationID: string, interactionToken: string): Promise<void> {
        await this.deleteFollowupMessage(applicationID, interactionToken, "@original");
    }

    /**
     * Edit a followup message.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     * @param messageID The ID of the message.
     * @param options The options for editing the followup message.
     */
    async editFollowupMessage<T extends AnyTextChannelWithoutGroup | Uncached>(applicationID: string, interactionToken: string, messageID: string, options: InteractionContent): Promise<Message<T>> {
        return this.#manager.webhooks.editMessage<T>(applicationID, interactionToken, messageID, options);
    }

    /**
     * Edit an original interaction response.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     * @param options The options for editing the original message.
     */
    async editOriginalMessage<T extends AnyTextChannelWithoutGroup | Uncached>(applicationID: string, interactionToken: string, options: InteractionContent): Promise<Message<T>> {
        return this.editFollowupMessage<T>(applicationID, interactionToken, "@original", options);
    }

    /**
     * Get a followup message.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     * @param messageID The ID of the message.
     */
    async getFollowupMessage<T extends AnyTextChannelWithoutGroup | Uncached>(applicationID: string, interactionToken: string, messageID: string): Promise<Message<T>> {
        return this.#manager.webhooks.getMessage<T>(applicationID, interactionToken, messageID);
    }

    /**
     * Get an original interaction response.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     */
    async getOriginalMessage<T extends AnyTextChannelWithoutGroup | Uncached>(applicationID: string, interactionToken: string): Promise<Message<T>> {
        return this.getFollowupMessage(applicationID, interactionToken, "@original");
    }
}
