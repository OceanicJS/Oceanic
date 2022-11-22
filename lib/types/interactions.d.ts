/** @module Types/Interactions */
import type { ExecuteWebhookOptions } from "./webhooks";
import type {
    AnyGuildTextChannel,
    ModalActionRow,
    RawAttachment,
    RawInteractionResolvedChannel,
    RawMessage,
    RawModalActionRow
} from "./channels";
import type { InteractionMember, RawMember, RawRole } from "./guilds";
import type { RawUser } from "./users";
import type { Uncached } from "./shared";
import type { LocaleMap } from "./application-commands";
import type {
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
    ComponentTypes,
    InteractionResponseTypes,
    InteractionTypes,
    MessageComponentTypes,
    SelectMenuTypes
} from "../Constants";
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
import type InteractionOptionsWrapper from "../util/InteractionOptionsWrapper";
import type PrivateChannel from "../structures/PrivateChannel";
import TypedCollection from "../util/TypedCollection";
import type InteractionResolvedChannel from "../structures/InteractionResolvedChannel";
import SelectMenuValuesWrapper from "../util/SelectMenuValuesWrapper";

export type InteractionContent = Pick<ExecuteWebhookOptions, "tts" | "content" | "embeds" | "allowedMentions" | "flags" | "components" | "attachments" | "files">;

export type InteractionResponse = PingInteractionResponse | MessageInteractionResponse | DeferredInteractionResponse | AutocompleteInteractionResponse | ModalInteractionResponse;
export interface PingInteractionResponse {
    type: InteractionResponseTypes.PONG;
}

export interface MessageInteractionResponse {
    /** The [response data](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-messages). Convert any `snake_case` keys to `camelCase`. */
    data: InteractionContent;
    type: InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE | InteractionResponseTypes.UPDATE_MESSAGE;
}

export interface DeferredInteractionResponse {
    /** The response data. Only [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) can be sent. */
    data?: { flags?: number; };
    type: InteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE | InteractionResponseTypes.DEFERRED_UPDATE_MESSAGE;
}

export interface AutocompleteInteractionResponse {
    /** The [response data](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-autocomplete). */
    data: { choices: Array<AutocompleteChoice>; };
    type: InteractionResponseTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT;
}

export interface ModalInteractionResponse {
    /** The [response data](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-modal). Convert any `snake_case` keys to `camelCase`. */
    data: ModalData;
    type: InteractionResponseTypes.MODAL;
}


export interface ModalData {
    components: Array<ModalActionRow>;
    /** The custom ID of the modal. */
    customID: string;
    /** The title of the modal. */
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
    options: InteractionOptionsWrapper;
    resolved: ApplicationCommandInteractionResolvedData;
    target?: User | Message;
    targetID?: string;
    type: ApplicationCommandTypes;
}
export type RawAutocompleteInteractionData = Omit<RawApplicationCommandInteractionData, "resolved" | "target_id">;
export type AutocompleteInteractionData = Omit<ApplicationCommandInteractionData, "resolved" | "targetID">;

export interface RawMessageComponentInteractionResolvedData {
    channels?: Record<string, RawInteractionResolvedChannel>;
    members?: Record<string, Omit<RawMember, "user" | "deaf" | "mute">>;
    roles?: Record<string, RawRole>;
    users?: Record<string, RawUser>;
}

export interface MessageComponentInteractionResolvedData {
    channels: TypedCollection<string, RawInteractionResolvedChannel, InteractionResolvedChannel>;
    members: TypedCollection<string, RawMember, Member, [guildID: string]>;
    roles: TypedCollection<string, RawRole, Role, [guildID: string]>;
    users: TypedCollection<string, RawUser, User>;
}

export interface RawMessageComponentInteractionData {
    component_type: MessageComponentTypes;
    custom_id: string;
    resolved?: RawMessageComponentInteractionResolvedData;
    values?: Array<string>;
}

export type MessageComponentInteractionData = MessageComponentButtonInteractionData | MessageComponentSelectMenuInteractionData;
export interface MessageComponentButtonInteractionData {
    componentType: ComponentTypes.BUTTON;
    customID: string;
}

export interface MessageComponentSelectMenuInteractionData {
    componentType: SelectMenuTypes;
    customID: string;
    resolved: MessageComponentInteractionResolvedData;
    values: SelectMenuValuesWrapper;
}

export interface RawModalSubmitInteractionData {
    components: Array<RawModalActionRow>;
    custom_id: string;
}

export interface ModalSubmitInteractionData {
    components: Array<ModalActionRow>;
    customID: string;
}

export interface RawApplicationCommandInteractionResolvedData {
    attachments?: Record<string, RawAttachment>;
    channels?: Record<string, RawInteractionResolvedChannel>;
    members?: Record<string, Omit<RawMember, "user" | "deaf" | "mute">>;
    messages?: Record<string, RawMessage>;
    roles?: Record<string, RawRole>;
    users?: Record<string, RawUser>;
}

export interface ApplicationCommandInteractionResolvedData {
    attachments: TypedCollection<string, RawAttachment, Attachment>;
    channels: TypedCollection<string, RawInteractionResolvedChannel, InteractionResolvedChannel>;
    members: TypedCollection<string, RawMember, Member, [guildID: string]>;
    messages: TypedCollection<string, RawMessage, Message>;
    roles: TypedCollection<string, RawRole, Role, [guildID: string]>;
    users: TypedCollection<string, RawUser, User>;
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
    options?: Array<InteractionOptionsWithValue>;
    type: ApplicationCommandOptionTypes.SUB_COMMAND;
}

export interface InteractionOptionsSubCommandGroup extends InteractionOptionsBase {
    options?: Array<InteractionOptionsSubCommand | InteractionOptionsWithValue>;
    type: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP;
}

export interface InteractionOptionsStringValue<T extends InteractionOptionsStringTypes = InteractionOptionsStringTypes> extends InteractionOptionsBase {
    type: T;
    value: string;
}

export interface InteractionOptionsNumberValue<T extends InteractionOptionsNumberTypes = InteractionOptionsNumberTypes> extends InteractionOptionsBase {
    type: T;
    value: number;
}

export interface InteractionOptionsBooleanValue<T extends InteractionOptionsBooleanTypes = InteractionOptionsBooleanTypes> extends InteractionOptionsBase {
    type: T;
    value: boolean;
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

export type AnyInteraction = PingInteraction | AnyInteractionGateway;
export type AnyInteractionGateway = AutocompleteInteraction | CommandInteraction | ComponentInteraction | ModalSubmitInteraction;


export interface AutocompleteChoice {
    /** The name of the choice. */
    name: string;
    /** A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names. */
    nameLocalizations?: LocaleMap;
    /** The value of the choice. */
    value: string;
}


export type GuildAutocompleteInteraction = AutocompleteInteraction<AnyGuildTextChannel>;
export type PrivateAutocompleteInteraction = Omit<AutocompleteInteraction<PrivateChannel | Uncached>, | "appPermissions" | "guild" | "guildID" | "guildLocale" | "member" | "memberPermissions">;
export type AnyAutocompleteInteraction = GuildAutocompleteInteraction | PrivateAutocompleteInteraction;

export type GuildCommandInteraction = CommandInteraction<AnyGuildTextChannel>;
export type PrivateCommandInteraction = Omit<CommandInteraction<PrivateChannel | Uncached>, "appPermissions" | "guild" | "guildID" | "guildLocale" | "member" | "memberPermissions">;
export type AnyCommandInteraction = GuildCommandInteraction | PrivateCommandInteraction;

export type GuildComponentButtonInteraction = Omit<ComponentInteraction<ComponentTypes.BUTTON, AnyGuildTextChannel>, "data"> & { data: MessageComponentButtonInteractionData; };
export type GuildComponentSelectMenuInteraction = Omit<ComponentInteraction<SelectMenuTypes, AnyGuildTextChannel>, "data"> & { data: MessageComponentSelectMenuInteractionData; };
export type GuildComponentInteraction = GuildComponentButtonInteraction | GuildComponentSelectMenuInteraction;
export type PrivateComponentButtonInteraction = Omit<ComponentInteraction<ComponentTypes.BUTTON, PrivateChannel | Uncached>, "appPermissions" | "guild" | "guildID" | "guildLocale" | "member" | "memberPermissions" | "data"> & { data: MessageComponentButtonInteractionData; };
export type PrivateComponentSelectMenuInteraction = Omit<ComponentInteraction<SelectMenuTypes, PrivateChannel | Uncached>, "appPermissions" | "guild" | "guildID" | "guildLocale" | "member" | "memberPermissions" | "data"> & { data: MessageComponentSelectMenuInteractionData; };
export type PrivateComponentInteraction = PrivateComponentButtonInteraction | PrivateComponentSelectMenuInteraction;
export type AnyComponentInteraction = GuildComponentInteraction | PrivateComponentInteraction;

export type GuildModalSubmitInteraction = ModalSubmitInteraction<AnyGuildTextChannel>;
export type PrivateModalSubmitInteraction = Omit<ModalSubmitInteraction<PrivateChannel | Uncached>, "appPermissions" | "guild" | "guildID" | "guildLocale" | "member" | "memberPermissions">;
export type AnyModalSubmitInteraction = GuildModalSubmitInteraction | PrivateModalSubmitInteraction;

export type SubCommandArray = [subcommand: string] | [subcommandGroup: string, subcommand: string];
