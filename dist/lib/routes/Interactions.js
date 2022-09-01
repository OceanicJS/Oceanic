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
Object.defineProperty(exports, "__esModule", { value: true });
const Routes = __importStar(require("../util/Routes"));
const Constants_1 = require("../Constants");
class Interactions {
    #manager;
    constructor(manager) {
        this.#manager = manager;
    }
    /**
     * Create a followup message.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     * @param options The options for creating the followup message.
     */
    async createFollowupMessage(applicationID, interactionToken, options) {
        return this.#manager.webhooks.execute(applicationID, interactionToken, options);
    }
    /**
     * Create an initial interaction response.
     * @param interactionID The ID of the interaction.
     * @param interactionToken The token of the interaction.
     * @param options The options for creating the interaction response.
     */
    async createInteractionResponse(interactionID, interactionToken, options) {
        let data;
        switch (options.type) {
            case Constants_1.InteractionResponseTypes.PONG: break;
            case Constants_1.InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE:
            case Constants_1.InteractionResponseTypes.UPDATE_MESSAGE: {
                data = {
                    allowed_mentions: this.#manager.client.util.formatAllowedMentions(options.data.allowedMentions),
                    attachments: options.data.attachments,
                    content: options.data.content,
                    components: options.data.components ? this.#manager.client.util.componentsToRaw(options.data.components) : undefined,
                    embeds: options.data.embeds,
                    flags: options.data.flags
                };
                break;
            }
            case Constants_1.InteractionResponseTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT: {
                data = {
                    choices: options.data.choices.map(d => ({
                        name: d.name,
                        name_localizations: d.nameLocalizations,
                        value: d.value
                    }))
                };
                break;
            }
            case Constants_1.InteractionResponseTypes.MODAL: {
                data = {
                    custom_id: options.data.customID,
                    components: this.#manager.client.util.componentsToRaw(options.data.components),
                    title: options.data.title
                };
                break;
            }
            default: {
                data = options.data;
                break;
            }
        }
        await this.#manager.authRequest({
            method: "POST",
            path: Routes.INTERACTION_CALLBACK(interactionID, interactionToken),
            route: "/interactions/:id/:token/callback",
            json: {
                data,
                type: options.type
            }
        });
    }
    /**
     * Delete a follow up message.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     * @param messageID The ID of the message.
     */
    async deleteFollowupMessage(applicationID, interactionToken, messageID) {
        await this.#manager.webhooks.deleteMessage(applicationID, interactionToken, messageID);
    }
    /**
     * Delete the original interaction response. Does not work with ephemeral messages.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     */
    async deleteOriginalMessage(applicationID, interactionToken) {
        await this.#manager.webhooks.deleteMessage(applicationID, interactionToken, "@original");
    }
    /**
     * Edit a followup message.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     * @param messageID The ID of the message.
     * @param options The options for editing the followup message.
     */
    async editFollowupMessage(applicationID, interactionToken, messageID, options) {
        return this.#manager.webhooks.editMessage(applicationID, interactionToken, messageID, options);
    }
    /**
     * Edit an original interaction response.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     * @param options The options for editing the original message.
     */
    async editOriginalMessage(applicationID, interactionToken, options) {
        return this.#manager.webhooks.editMessage(applicationID, interactionToken, "@original", options);
    }
    /**
     * Get a followup message.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     * @param messageID The ID of the message.
     */
    async getFollowupMessage(applicationID, interactionToken, messageID) {
        return this.#manager.webhooks.getMessage(applicationID, interactionToken, messageID);
    }
    /**
     * Get an original interaction response.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     */
    async getOriginalMessage(applicationID, interactionToken) {
        return this.#manager.webhooks.getMessage(applicationID, interactionToken, "@original");
    }
}
exports.default = Interactions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZXJhY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3JvdXRlcy9JbnRlcmFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLHVEQUF5QztBQUN6Qyw0Q0FBd0Q7QUFJeEQsTUFBcUIsWUFBWTtJQUM3QixRQUFRLENBQWM7SUFDdEIsWUFBWSxPQUFvQjtRQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUM1QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMscUJBQXFCLENBQWdDLGFBQXFCLEVBQUUsZ0JBQXdCLEVBQUUsT0FBMkI7UUFDbkksT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUksYUFBYSxFQUFFLGdCQUFnQixFQUFFLE9BQW9DLENBQUMsQ0FBQztJQUNwSCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMseUJBQXlCLENBQUMsYUFBcUIsRUFBRSxnQkFBd0IsRUFBRSxPQUE0QjtRQUN6RyxJQUFJLElBQXlCLENBQUM7UUFDOUIsUUFBUSxPQUFPLENBQUMsSUFBSSxFQUFFO1lBQ2xCLEtBQUssb0NBQXdCLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTTtZQUMxQyxLQUFLLG9DQUF3QixDQUFDLDJCQUEyQixDQUFDO1lBQzFELEtBQUssb0NBQXdCLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQzFDLElBQUksR0FBRztvQkFDSCxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUM7b0JBQy9GLFdBQVcsRUFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVc7b0JBQzFDLE9BQU8sRUFBVyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU87b0JBQ3RDLFVBQVUsRUFB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