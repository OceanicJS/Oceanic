/** @module MessageInteractionResponse */
import type CommandInteraction from "../../structures/CommandInteraction";
import type Message from "../../structures/Message";
import type ComponentInteraction from "../../structures/ComponentInteraction";
import type ModalSubmitInteraction from "../../structures/ModalSubmitInteraction";

export type AnyResponseInteraction = CommandInteraction | ComponentInteraction | ModalSubmitInteraction;
export type ResponseInteractionChannelType<I extends AnyResponseInteraction> =
I extends CommandInteraction<infer T> ? T :
    I extends ModalSubmitInteraction<infer T> ? T :
        I extends ComponentInteraction<never, infer T> ? T :
            never;
export default class MessageInteractionResponse<I extends AnyResponseInteraction> {
    declare interaction: I;
    message: Message<ResponseInteractionChannelType<I>> | null;
    type: "initial" | "followup";
    constructor(interaction: I, message: Message<ResponseInteractionChannelType<I>> | null, type: "initial" | "followup") {
        this.interaction = interaction;
        this.message = message;
        this.type = type;
    }

    async deleteMessage(): Promise<void> {
        if (this.hasMessage()) {
            return this.interaction.deleteFollowup(this.message.id);
        }

        return this.interaction.deleteOriginal();
    }

    async getMessage(): Promise<Message<ResponseInteractionChannelType<I>>> {
        if (this.hasMessage()) {
            return this.message;
        }

        return this.interaction.getOriginal() as Promise<Message<ResponseInteractionChannelType<I>>>;
    }

    hasMessage(): this is FollowupMessageInteractionResponse<I> {
        return this.message !== null;
    }
}

export interface InitialMessagedInteractionResponse<I extends AnyResponseInteraction> extends MessageInteractionResponse<I> {
    message: null;
    type: "initial";
}

export interface FollowupMessageInteractionResponse<I extends AnyResponseInteraction> extends MessageInteractionResponse<I> {
    message: Message<ResponseInteractionChannelType<I>>;
    type: "followup";
}
