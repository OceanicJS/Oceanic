import BaseRoute from "./BaseRoute";
import type { InteractionContent, InteractionResponse } from "../types/interactions";
import type { AnyGuildTextChannel } from "../types/channels";
export default class Interactions extends BaseRoute {
    /**
     * Create a followup message.
     * @param applicationID - The ID of the application.
     * @param interactionToken - The token of the interaction.
     * @param options - The options for creating the followup message.
     */
    createFollowupMessage<T extends AnyGuildTextChannel>(applicationID: string, interactionToken: string, options: InteractionContent): Promise<import("..").Message<T>>;
    /**
     * Create an initial interaction response.
     * @param interactionID - The ID of the interaction.
     * @param interactionToken - The token of the interaction.
     * @param options - The options for creating the interaction response.
     */
    createInteractionResponse(interactionID: string, interactionToken: string, options: InteractionResponse): Promise<void>;
    /**
     * Delete a follow up message.
     * @param applicationID - The ID of the application.
     * @param interactionToken - The token of the interaction.
     * @param messageID - The ID of the message.
     */
    deleteFollowupMessage(applicationID: string, interactionToken: string, messageID: string): Promise<void>;
    /**
     * Delete the original interaction response. Does not work with ephemeral messages.
     * @param applicationID - The ID of the application.
     * @param interactionToken - The token of the interaction.
     */
    deleteOriginalMessage(applicationID: string, interactionToken: string): Promise<void>;
    /**
     * Edit a followup message.
     * @param applicationID - The ID of the application.
     * @param interactionToken - The token of the interaction.
     * @param messageID - The ID of the message.
     * @param options - The options for editing the followup message.
     */
    editFollowupMessage<T extends AnyGuildTextChannel>(applicationID: string, interactionToken: string, messageID: string, options: InteractionContent): Promise<import("..").Message<T>>;
    /**
     * Edit an original interaction response.
     * @param applicationID - The ID of the application.
     * @param interactionToken - The token of the interaction.
     * @param options - The options for editing the original message.
     */
    editOriginalMessage<T extends AnyGuildTextChannel>(applicationID: string, interactionToken: string, options: InteractionContent): Promise<import("..").Message<T>>;
    /**
     * Get a followup message.
     * @param applicationID - The ID of the application.
     * @param interactionToken - The token of the interaction.
     * @param messageID - The ID of the message.
     */
    getFollowupMessage<T extends AnyGuildTextChannel>(applicationID: string, interactionToken: string, messageID: string): Promise<import("..").Message<T>>;
    /**
     * Get an original interaction response.
     * @param applicationID - The ID of the application.
     * @param interactionToken - The token of the interaction.
     */
    getOriginalMessage<T extends AnyGuildTextChannel>(applicationID: string, interactionToken: string): Promise<import("..").Message<T>>;
}
