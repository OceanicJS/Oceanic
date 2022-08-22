import type { ExecuteWebhookOptions } from "./webhooks";
import type {
	AnyChannel,
	ModalActionRow,
	RawAttachment,
	RawChannel,
	RawMessage
} from "./channels";
import type { InteractionMember, RawMember, RawRole } from "./guilds";
import type { RawUser } from "./users";
import type {
	ApplicationCommandOptionTypes,
	ApplicationCommandTypes,
	ComponentTypes,
	InteractionResponseTypes,
	InteractionTypes,
	MessageComponentTypes
} from "../Constants";
import type Collection from "../util/Collection";
import type Attachment from "../structures/Attachment";
import type Member from "../structures/Member";
import type Message from "../structures/Message";
import type Role from "../structures/Role";
import type User from "../structures/User";
import type PingInteraction from "../structures/PingInteraction";
import type CommandInteraction from "../structures/CommandInteraction";
import type ComponentInteraction from "../structures/ComponentInteraction";
import type AutocompleteInteraction from "../structures/AutocompleteInteraction";
import type ModalSubmitInteraction from "../structures/ModalSubmitInteraction";

export type InteractionContent = Pick<ExecuteWebhookOptions, "tts" | "content" | "embeds" | "allowedMentions" | "flags" | "components" | "attachments" | "files">;

export type InteractionResponse = PingInteractionResponse | MessageInteractionResponse | DeferredInteractionResponse | AutocompleteInteractionResponse | ModalInteractionResponse;
export interface PingInteractionResponse {
	type: InteractionResponseTypes.PONG;
}

export interface MessageInteractionResponse {
	data: InteractionContent;
	type: InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE | InteractionResponseTypes.UPDATE_MESSAGE;
}

export interface DeferredInteractionResponse {
	data?: number;
	type: InteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE | InteractionResponseTypes.DEFERRED_UPDATE_MESAGE;
}

export interface AutocompleteInteractionResponse {
	data: Array<AutocompleteChoice>;
	type: InteractionResponseTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT;
}

export interface ModalInteractionResponse {
	data: ModalData;
	type: InteractionResponseTypes.MODAL;
}


export interface ModalData {
	components: Array<ModalActionRow>;
	customID: string;
	title: string;
}

export interface RawInteraction {
	app_permissions?: string;
	application_id: string;
	channel_id?: string;
	data?: RawInteractionData;
	guild_id?: string;
	guild_locale?: string;
	id: string;
	locale?: string;
	member?: InteractionMember;
	message?: RawMessage;
	token: string;
	type: InteractionTypes;
	user?: RawUser;
	version: 1;
}

export type AnyRawInteraction = RawPingInteraction | AnyRawGatewayInteraction;
export type AnyRawGatewayInteraction = RawApplicationCommandInteraction | RawMessageComponentInteraction | RawAutocompleteInteraction | RawModalSubmitInteraction;
export type RawPingInteraction = Pick<RawInteraction, "application_id" | "id" | "token" | "type" | "version">;
export type RawApplicationCommandInteraction = Omit<RawInteraction, "data" | "message"> & { data: RawApplicationCommandInteractionData; };
export type RawMessageComponentInteraction = Omit<RawInteraction, "data" | "message"> & { data: RawMessageComponentInteractionData; message: RawMessage; };
export type RawAutocompleteInteraction = Omit<RawInteraction, "data" | "message"> & { data: RawAutocompleteInteractionData; };
export type RawModalSubmitInteraction = Omit<RawInteraction, "data" | "message"> & { data: RawModalSubmitInteractionData; };

export type RawInteractionData = RawApplicationCommandInteractionData | RawMessageComponentInteractionData | RawAutocompleteInteractionData | RawModalSubmitInteractionData;
export type InteractionData = ApplicationCommandInteractionData | MessageComponentInteractionData | AutocompleteInteractionData | ModalSubmitInteractionData;
export interface RawApplicationCommandInteractionData {
	guild_id?: string;
	id: string;
	name: string;
	options?: Array<InteractionOptions>;
	resolved?: RawApplicationCommandInteractionResolvedData;
	target_id?: string;
	type: ApplicationCommandTypes;
}
export interface ApplicationCommandInteractionData {
	guildID?: string;
	id: string;
	name: string;
	options: Array<InteractionOptions>;
	resolved: ApplicationCommandInteractionResolvedData;
	targetID?: string;
	type: ApplicationCommandTypes;
}
export type RawAutocompleteInteractionData = Omit<RawApplicationCommandInteractionData, "resolved" | "target_id">;
export type AutocompleteInteractionData = Omit<ApplicationCommandInteractionData, "resolved" | "targetID">;

export interface RawMessageComponentInteractionData {
	component_type: MessageComponentTypes;
	custom_id: string;
	values?: Array<string>;
}

export type MessageComponentInteractionData = MessageComponentButtonInteractionData | MessageComponentSelectMenuInteractionData;
export interface MessageComponentButtonInteractionData {
	componentType: ComponentTypes.BUTTON;
	customID: string;
}

export interface MessageComponentSelectMenuInteractionData {
	componentType: ComponentTypes.SELECT_MENU;
	customID: string;
	values: Array<string>;
}

export interface RawModalSubmitInteractionData {
	components: Array<ModalActionRow>;
	custom_id: string;
}

export interface ModalSubmitInteractionData {
	components: Array<ModalActionRow>;
	customID: string;
}

export interface RawApplicationCommandInteractionResolvedData {
	attachments?: Record<string, RawAttachment>;
	channels?: Record<string, Pick<RawChannel, "id" | "name" | "type" | "permissions" | "thread_metadata" | "parent_id">>;
	members?: Record<string, Omit<RawMember, "user" | "deaf" | "mute">>;
	messages?: Record<string, RawMessage>;
	roles?: Record<string, RawRole>;
	users?: Record<string, RawUser>;
}

export interface ApplicationCommandInteractionResolvedData {
	attachments: Collection<string, RawAttachment, Attachment>;
	channels: Collection<string, RawChannel, AnyChannel>;
	members: Collection<string, RawMember & { id: string; }, Member, [guildID: string]>;
	messages: Collection<string, RawMessage, Message>;
	roles: Collection<string, RawRole, Role, [guildID: string]>;
	users: Collection<string, RawUser, User>;
}

export type InteractionOptions = InteractionOptionsWithOptions | InteractionOptionsWithValue;
export type InteractionOptionsWithOptions = InteractionOptionsSubCommand | InteractionOptionsSubCommandGroup;
export type InteractionOptionsWithValue = InteractionOptionsString | InteractionOptionsInteger | InteractionOptionsBoolean | InteractionOptionsUser | InteractionOptionsChannel | InteractionOptionsRole | InteractionOptionsMentionable | InteractionOptionsNumber | InteractionOptionsAttachment;
export interface InteractionOptionsBase {
	focused?: boolean;
	name: string;
	type: ApplicationCommandOptionTypes;
}

export interface InteractionOptionsSubCommand extends InteractionOptionsBase {
	options?: Array<InteractionOptionsSubCommandGroup | InteractionOptionsWithValue>;
	type: ApplicationCommandOptionTypes.SUB_COMMAND;
}

export interface InteractionOptionsSubCommandGroup extends InteractionOptionsBase {
	options?: Array<InteractionOptionsWithValue>;
	type: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP;
}

export interface InteractionOptionsStringValue<T extends InteractionOptionsStringTypes = InteractionOptionsStringTypes> extends InteractionOptionsBase {
	type: T;
	value: string;
}

export interface InteractionOptionsNumberValue<T extends InteractionOptionsNumberTypes = InteractionOptionsNumberTypes> extends InteractionOptionsBase {
	type: T;
	value: string;
}

export interface InteractionOptionsBooleanValue<T extends InteractionOptionsBooleanTypes = InteractionOptionsBooleanTypes> extends InteractionOptionsBase {
	type: T;
	value: string;
}

type InteractionOptionsStringTypes = ApplicationCommandOptionTypes.STRING | ApplicationCommandOptionTypes.USER | ApplicationCommandOptionTypes.CHANNEL | ApplicationCommandOptionTypes.ROLE | ApplicationCommandOptionTypes.MENTIONABLE | ApplicationCommandOptionTypes.ATTACHMENT;
type InteractionOptionsNumberTypes = ApplicationCommandOptionTypes.NUMBER | ApplicationCommandOptionTypes.INTEGER;
type InteractionOptionsBooleanTypes = ApplicationCommandOptionTypes.BOOLEAN;

export type InteractionOptionsString = InteractionOptionsStringValue<ApplicationCommandOptionTypes.STRING>;
export type InteractionOptionsInteger = InteractionOptionsNumberValue<ApplicationCommandOptionTypes.INTEGER>;
export type InteractionOptionsBoolean = InteractionOptionsBooleanValue<ApplicationCommandOptionTypes.BOOLEAN>;
export type InteractionOptionsUser = InteractionOptionsStringValue<ApplicationCommandOptionTypes.USER>;
export type InteractionOptionsChannel = InteractionOptionsStringValue<ApplicationCommandOptionTypes.CHANNEL>;
export type InteractionOptionsRole = InteractionOptionsStringValue<ApplicationCommandOptionTypes.ROLE>;
export type InteractionOptionsMentionable = InteractionOptionsStringValue<ApplicationCommandOptionTypes.MENTIONABLE>;
export type InteractionOptionsNumber = InteractionOptionsNumberValue<ApplicationCommandOptionTypes.NUMBER>;
export type InteractionOptionsAttachment = InteractionOptionsStringValue<ApplicationCommandOptionTypes.ATTACHMENT>;

export type AnyInteraction = PingInteraction | AnyGatewayInteraction;
export type AnyGatewayInteraction = CommandInteraction | ComponentInteraction | AutocompleteInteraction | ModalSubmitInteraction;


export interface AutocompleteChoice {
	name: string;
	nameLocalizations?: Record<string, string>;
	value: string;
}
