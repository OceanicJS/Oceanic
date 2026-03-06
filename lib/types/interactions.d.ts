/** @module Types/Interactions */
import type * as Types from "./namespaced";
import type {
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
    ApplicationIntegrationTypes,
    ComponentTypes,
    GuildFeature,
    InteractionContextTypes,
    InteractionResponseTypes,
    InteractionTypes,
    MessageComponentTypes,
    ModalComponentTypes,
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
import type InteractionOptionsWrapper from "../util/interactions/InteractionOptionsWrapper";
import type TypedCollection from "../util/TypedCollection";
import type InteractionResolvedChannel from "../structures/InteractionResolvedChannel";
import type SelectMenuValuesWrapper from "../util/interactions/SelectMenuValuesWrapper";
import type Interaction from "../structures/Interaction";
import type Guild from "../structures/Guild";
import type Permission from "../structures/Permission";
import type ModalSubmitInteractionComponentsWrapper from "../util/interactions/ModalSubmitInteractionComponentsWrapper";

export interface InteractionContent extends Pick<Types.Webhooks.ExecuteWebhookOptions, "tts" | "content" | "embeds" | "allowedMentions" | "flags" | "components" | "attachments" | "files" | "poll"> {}
export interface EditInteractionContent extends Pick<Types.Webhooks.EditWebhookMessageOptions, "content" | "embeds" | "allowedMentions" | "flags" | "components" | "attachments" | "files" | "poll"> {}

export type InteractionResponse = PingInteractionResponse | MessageInteractionResponse | DeferredInteractionResponse | AutocompleteInteractionResponse | ModalSubmitInteractionResponse | PremiumRequiredResponse | LaunchActivityResponse;
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

export interface ModalSubmitInteractionResponse {
    /** The [response data](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-modal). Convert any `snake_case` keys to `camelCase`. */
    data: ModalData;
    type: InteractionResponseTypes.MODAL;
}

export interface PremiumRequiredResponse {
    type: InteractionResponseTypes.PREMIUM_REQUIRED;
}

export interface LaunchActivityResponse {
    type: InteractionResponseTypes.LAUNCH_ACTIVITY;
}


export interface ModalData {
    /** The components of the modal. Each component needs its own row. `snake_case` keys should be converted to `camelCase`, or passed through {@link Util.rawModalComponents | Util#rawModalComponents}. */
    components: Array<Types.Channels.ModalComponent>;
    /** The custom ID of the modal. */
    customID: string;
    /** The title of the modal. */
    title: string;
}

export interface RawInteraction {
    app_permissions: string;
    application_id: string;
    attachment_size_limit: number;
    authorizing_integration_owners: AuthorizingIntegrationOwners;
    channel_id?: string;
    context?: InteractionContextTypes;
    data?: RawInteractionData;
    entitlements?: Array<Types.Applications.RawEntitlement | Types.Applications.RawTestEntitlement>;
    guild?: InteractionGuild;
    guild_id?: string;
    guild_locale?: string;
    id: string;
    locale?: string;
    member?: Types.Guilds.InteractionMember;
    message?: Types.Channels.RawMessage;
    token: string;
    type: InteractionTypes;
    user?: Types.Users.RawUser;
    version: 1;
}

export interface AuthorizingIntegrationOwners extends Partial<Record<`${ApplicationIntegrationTypes}`, string>> {}

export type AnyRawInteraction = RawPingInteraction | AnyRawGatewayInteraction;
export type AnyRawGatewayInteraction = RawApplicationCommandInteraction | RawMessageComponentInteraction | RawAutocompleteInteraction | RawModalSubmitInteraction;
export interface RawPingInteraction extends Pick<RawInteraction, "application_id" | "id" | "token" | "type" | "version"> {}
export interface RawApplicationCommandInteraction extends Omit<RawInteraction, "data" | "message"> { data: RawApplicationCommandInteractionData; }
export interface RawMessageComponentInteraction extends Omit<RawInteraction, "data" | "message"> { data: RawMessageComponentInteractionData; message: Types.Channels.RawMessage; }
export interface RawAutocompleteInteraction extends Omit<RawInteraction, "data" | "message"> { data: RawAutocompleteInteractionData; }
export interface RawModalSubmitInteraction extends Omit<RawInteraction, "data" | "message"> { data: RawModalSubmitInteractionData; message?: Types.Channels.RawMessage; }

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
export interface ApplicationCommandInteractionData<T extends Types.Channels.AnyInteractionChannel | Types.Shared.Uncached = Types.Channels.AnyInteractionChannel | Types.Shared.Uncached, C extends ApplicationCommandTypes = ApplicationCommandTypes> {
    guildID?: string;
    id: string;
    name: string;
    options: InteractionOptionsWrapper;
    resolved: ApplicationCommandInteractionResolvedData;
    target: C extends ApplicationCommandTypes.CHAT_INPUT ? null : C extends ApplicationCommandTypes.USER ? User : C extends ApplicationCommandTypes.MESSAGE ? Message<T> : User | Message<T> | null;
    targetID: C extends ApplicationCommandTypes.CHAT_INPUT ? null : C extends ApplicationCommandTypes.USER | ApplicationCommandTypes.MESSAGE ? string : string | null;
    type: C;
}
export interface RawAutocompleteInteractionData extends Omit<RawApplicationCommandInteractionData, "resolved" | "target_id"> {}
export interface AutocompleteInteractionData extends Omit<ApplicationCommandInteractionData, "resolved" | "target" | "targetID"> {}

export interface RawMessageComponentInteractionResolvedData {
    channels?: Record<string, Types.Channels.RawInteractionResolvedChannel>;
    members?: Record<string, Omit<Types.Guilds.RawMember, "user" | "deaf" | "mute">>;
    roles?: Record<string, Types.Guilds.RawRole>;
    users?: Record<string, Types.Users.RawUser>;
}

export interface MessageComponentInteractionResolvedData {
    channels: TypedCollection<Types.Channels.RawInteractionResolvedChannel, InteractionResolvedChannel>;
    members: TypedCollection<Types.Guilds.RawMember, Member, [guildID: string]>;
    roles: TypedCollection<Types.Guilds.RawRole, Role, [guildID: string]>;
    users: TypedCollection<Types.Users.RawUser, User>;
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

export interface RawModalSubmitInteractionResolvedData {
    attachments?: Record<string, Types.Channels.RawAttachment>;
    channels?: Record<string, Types.Channels.RawInteractionResolvedChannel>;
    members?: Record<string, Omit<Types.Guilds.RawMember, "user" | "deaf" | "mute">>;
    roles?: Record<string, Types.Guilds.RawRole>;
    users?: Record<string, Types.Users.RawUser>;
}

export interface ModalSubmitInteractionResolvedData {
    attachments: TypedCollection<Types.Channels.RawAttachment, Attachment>;
    channels: TypedCollection<Types.Channels.RawInteractionResolvedChannel, InteractionResolvedChannel>;
    members: TypedCollection<Types.Guilds.RawMember, Member, [guildID: string]>;
    roles: TypedCollection<Types.Guilds.RawRole, Role, [guildID: string]>;
    users: TypedCollection<Types.Users.RawUser, User>;
}

export interface RawModalSubmitInteractionData {
    components: Array<RawModalSubmitComponentsActionRow>;
    custom_id: string;
    resolved?: RawModalSubmitInteractionResolvedData;
}

export interface ModalSubmitInteractionData {
    components: ModalSubmitInteractionComponentsWrapper;
    customID: string;
    resolved: ModalSubmitInteractionResolvedData;
}

export interface RawApplicationCommandInteractionResolvedData {
    attachments?: Record<string, Types.Channels.RawAttachment>;
    channels?: Record<string, Types.Channels.RawInteractionResolvedChannel>;
    members?: Record<string, Omit<Types.Guilds.RawMember, "user" | "deaf" | "mute">>;
    messages?: Record<string, Types.Channels.RawMessage>;
    roles?: Record<string, Types.Guilds.RawRole>;
    users?: Record<string, Types.Users.RawUser>;
}

export interface ApplicationCommandInteractionResolvedData {
    attachments: TypedCollection<Types.Channels.RawAttachment, Attachment>;
    channels: TypedCollection<Types.Channels.RawInteractionResolvedChannel, InteractionResolvedChannel>;
    members: TypedCollection<Types.Guilds.RawMember, Member, [guildID: string]>;
    messages: TypedCollection<Types.Channels.RawMessage, Message>;
    roles: TypedCollection<Types.Guilds.RawRole, Role, [guildID: string]>;
    users: TypedCollection<Types.Users.RawUser, User>;
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
    nameLocalizations?: Types.Applications.LocaleMap;
    /** The value of the choice. */
    value: string;
}

type Guildify<T extends Interaction> = Omit<T, "guild" | "guildID" | "guildLocale" | "guildPartial" | "member" | "memberPermissions"> & {
    guild: Guild;
    guildID: string;
    guildLocale: string;
    guildPartial: InteractionGuild;
    member: Member;
    memberPermissions: Permission;
};
type Privatify<T extends Interaction> = Omit<T, "guild" | "guildID" | "guildLocale" | "guildPartial" | "member" | "memberPermissions"> & {
    guild: undefined;
    guildID: undefined;
    guildLocale: undefined;
    guildPartial: undefined;
    member: undefined;
    memberPermissions: undefined;
};

export interface GuildAutocompleteInteraction extends Guildify<AutocompleteInteraction<Types.Channels.AnyTextableGuildChannel>> {}
export interface PrivateAutocompleteInteraction extends Privatify<AutocompleteInteraction<Types.Channels.AnyPrivateChannel | Types.Shared.Uncached>> {}
export type AnyAutocompleteInteraction = GuildAutocompleteInteraction | PrivateAutocompleteInteraction;

export interface GuildCommandInteraction extends Guildify<CommandInteraction<Types.Channels.AnyTextableGuildChannel>> {}
export interface PrivateCommandInteraction extends Privatify<CommandInteraction<Types.Channels.AnyPrivateChannel | Types.Shared.Uncached>> {}
export type AnyCommandInteraction = GuildCommandInteraction | PrivateCommandInteraction;

export interface GuildComponentButtonInteraction extends Guildify<ComponentInteraction<ComponentTypes.BUTTON, Types.Channels.AnyTextableGuildChannel>> {}
export interface GuildComponentSelectMenuInteraction extends Guildify<ComponentInteraction<SelectMenuTypes, Types.Channels.AnyTextableGuildChannel>> {}
export type GuildComponentInteraction = GuildComponentButtonInteraction | GuildComponentSelectMenuInteraction;

export interface PrivateComponentButtonInteraction extends Privatify<ComponentInteraction<ComponentTypes.BUTTON, Types.Channels.AnyPrivateChannel | Types.Shared.Uncached>> {}
export interface PrivateComponentSelectMenuInteraction extends Privatify<ComponentInteraction<SelectMenuTypes, Types.Channels.AnyPrivateChannel | Types.Shared.Uncached>> {}
export type PrivateComponentInteraction = PrivateComponentButtonInteraction | PrivateComponentSelectMenuInteraction;
export type AnyComponentButtonInteraction = GuildComponentButtonInteraction | PrivateComponentButtonInteraction;
export type AnyComponentSelectMenuInteraction = GuildComponentSelectMenuInteraction | PrivateComponentSelectMenuInteraction;
export type AnyComponentInteraction = AnyComponentButtonInteraction | AnyComponentSelectMenuInteraction;

export interface GuildModalSubmitInteraction extends Guildify<ModalSubmitInteraction<Types.Channels.AnyTextableGuildChannel>> {}
export interface PrivateModalSubmitInteraction extends Privatify<ModalSubmitInteraction<Types.Channels.AnyPrivateChannel | Types.Shared.Uncached>> {}
export type AnyModalSubmitInteraction = GuildModalSubmitInteraction | PrivateModalSubmitInteraction;

export type SubCommandArray = [subcommand: string] | [subcommandGroup: string, subcommand: string];
export type AutoCompleteFocusedOption = InteractionOptionsString | InteractionOptionsNumber | InteractionOptionsInteger;

export interface InteractionGuild {
    features: Array<GuildFeature>;
    id: string;
    locale: string;
}

export type AnyGuildInteraction = GuildAutocompleteInteraction | GuildCommandInteraction | GuildComponentInteraction | GuildModalSubmitInteraction;
export type AnyPrivateInteraction = PrivateAutocompleteInteraction | PrivateCommandInteraction | PrivateComponentInteraction | PrivateModalSubmitInteraction;


export type SelectMenuDefaultValueTypes = "user" | "role" | "channel";
export interface SelectMenuDefaultValue {
    id: string;
    type: SelectMenuDefaultValueTypes;
}

interface RawModalSubmitComponentsBase {
    custom_id: string;
}

export interface RawModalSubmitComponentsStringValue<T extends ModalComponentTypes = ModalComponentTypes> extends RawModalSubmitComponentsBase {
    type: T;
    value: string;
}

export interface RawModalSubmitComponentsStringValues<T extends ModalComponentTypes = ModalComponentTypes> extends RawModalSubmitComponentsBase {
    type: T;
    values: Array<string>;
}

/** @deprecated */
interface RawModalComponentsActionRow<T extends RawModalSubmitComponents> {
    components: Array<T>;
    type: ComponentTypes.ACTION_ROW;
}

/** @deprecated */
interface ModalComponentsActionRow<T extends ModalSubmitComponents> {
    components: Array<T>;
    type: ComponentTypes.ACTION_ROW;
}

interface RawModalComponentsLabel<T extends RawModalSubmitComponents> {
    component: T;
    type: ComponentTypes.LABEL;
}

interface ModalComponentsLabel<T extends ModalSubmitComponents> {
    component: T;
    type: ComponentTypes.LABEL;
}

export type ToModalSubmitComponentFromRaw<T extends RawModalSubmitComponents> =
T extends RawModalSubmitTextInputComponent ? ModalSubmitTextInputComponent :
    T extends RawModalSubmitStringSelectComponent ? ModalSubmitStringSelectComponent :
        T extends RawModalSubmitUserSelectComponent ? ModalSubmitUserSelectComponent :
            T extends RawModalSubmitRoleSelectComponent ? ModalSubmitRoleSelectComponent :
                T extends RawModalSubmitMentionableSelectComponent ? ModalSubmitMentionableSelectComponent :
                    T extends RawModalSubmitChannelSelectComponent ? ModalSubmitChannelSelectComponent :
                        T extends RawModalSubmitFileUploadComponent ? ModalSubmitFileUploadComponent :
                            never;

/** @deprecated */
export type RawModalSubmitComponentsActionRow = RawModalComponentsActionRow<RawModalSubmitComponents>;
export type RawModalSubmitComponentsLabel = RawModalComponentsLabel<RawModalSubmitComponents>;
export type RawModalSubmitComponents = RawModalSubmitTextInputComponent | RawModalSubmitFileUploadComponent | RawModalSubmitSelectComponents;
export type RawModalSubmitSelectComponents = RawModalSubmitStringSelectComponent | RawModalSubmitUserSelectComponent | RawModalSubmitRoleSelectComponent | RawModalSubmitMentionableSelectComponent | RawModalSubmitChannelSelectComponent;
export interface RawModalSubmitTextInputComponent extends RawModalSubmitComponentsStringValue<ComponentTypes.TEXT_INPUT> {}
export interface RawModalSubmitStringSelectComponent extends RawModalSubmitComponentsStringValues<ComponentTypes.STRING_SELECT> {}
export interface RawModalSubmitUserSelectComponent extends RawModalSubmitComponentsStringValues<ComponentTypes.USER_SELECT> {}
export interface RawModalSubmitRoleSelectComponent extends RawModalSubmitComponentsStringValues<ComponentTypes.ROLE_SELECT> {}
export interface RawModalSubmitMentionableSelectComponent extends RawModalSubmitComponentsStringValues<ComponentTypes.MENTIONABLE_SELECT> {}
export interface RawModalSubmitChannelSelectComponent extends RawModalSubmitComponentsStringValues<ComponentTypes.CHANNEL_SELECT> {}
export interface RawModalSubmitFileUploadComponent extends RawModalSubmitComponentsStringValues<ComponentTypes.FILE_UPLOAD> { }

interface ModalSubmitComponentsBase {
    customID: string;
}

export interface ModalSubmitComponentsStringValue<T extends ModalComponentTypes = ModalComponentTypes> extends ModalSubmitComponentsBase {
    type: T;
    value: string;
}

export interface ModalSubmitComponentsStringValues<T extends ModalComponentTypes = ModalComponentTypes> extends ModalSubmitComponentsBase {
    type: T;
    values: Array<string>;
}

export type ToRawFromoModalSubmitComponent<T extends ModalSubmitComponents> =
T extends ModalSubmitTextInputComponent ? RawModalSubmitTextInputComponent :
    T extends ModalSubmitStringSelectComponent ? RawModalSubmitStringSelectComponent :
        T extends ModalSubmitUserSelectComponent ? RawModalSubmitUserSelectComponent :
            T extends ModalSubmitRoleSelectComponent ? RawModalSubmitRoleSelectComponent :
                T extends ModalSubmitMentionableSelectComponent ? RawModalSubmitMentionableSelectComponent :
                    T extends ModalSubmitChannelSelectComponent ? RawModalSubmitChannelSelectComponent :
                        T extends ModalSubmitFileUploadComponent ? RawModalSubmitFileUploadComponent :
                            never;

/** @deprecated */
export type ModalSubmitComponentsActionRow = ModalComponentsActionRow<ModalSubmitComponents>;
export type ModalSubmitComponentsLabel = ModalComponentsLabel<ModalSubmitComponents>;
export type ModalSubmitComponents = ModalSubmitTextInputComponent | ModalSubmitSelectComponents | ModalSubmitFileUploadComponent;
export type ModalSubmitSelectComponents = ModalSubmitStringSelectComponent | ModalSubmitUserSelectComponent | ModalSubmitRoleSelectComponent | ModalSubmitMentionableSelectComponent | ModalSubmitChannelSelectComponent;
export interface ModalSubmitTextInputComponent extends ModalSubmitComponentsStringValue<ComponentTypes.TEXT_INPUT> {}
export interface ModalSubmitStringSelectComponent extends ModalSubmitComponentsStringValues<ComponentTypes.STRING_SELECT> {}
export interface ModalSubmitUserSelectComponent extends ModalSubmitComponentsStringValues<ComponentTypes.USER_SELECT> {}
export interface ModalSubmitRoleSelectComponent extends ModalSubmitComponentsStringValues<ComponentTypes.ROLE_SELECT> {}
export interface ModalSubmitMentionableSelectComponent extends ModalSubmitComponentsStringValues<ComponentTypes.MENTIONABLE_SELECT> {}
export interface ModalSubmitChannelSelectComponent extends ModalSubmitComponentsStringValues<ComponentTypes.CHANNEL_SELECT> {}
export interface ModalSubmitFileUploadComponent extends ModalSubmitComponentsStringValues<ComponentTypes.FILE_UPLOAD> { }

export type ApplicationCommandTypesWithTarget = ApplicationCommandTypes.USER | ApplicationCommandTypes.MESSAGE;

export interface RawInteractionCallbackResponse {
    interaction: RawInteractionCallback;
    resource?: RawInteractionCallbackResource;
}

export interface RawInteractionCallback {
    activity_instance_id?: string;
    id: string;
    response_message_ephemeral?: boolean;
    response_message_id?: string;
    response_message_loading?: boolean;
    type: InteractionTypes;
}

export interface RawInteractionCallbackResource {
    activity_instance?: Array<InteractionCallbackActivityInstance>;
    message?: Types.Channels.RawMessage;
    type: InteractionResponseTypes;
}

export interface InteractionCallbackActivityInstance {
    /** Instance ID of the Activity if one was launched or joined. */
    id: string;
}

export interface InteractionCallbackResponse<CH extends Types.Channels.AnyInteractionChannel | Types.Shared.Uncached = Types.Channels.AnyInteractionChannel | Types.Shared.Uncached> {
    /** The interaction object associated with the interaction response. */
    interaction: InteractionCallback;
    /** The resource that was created by the interaction response. */
    resource?: InteractionCallbackResource<CH>;
}

export interface InteractionCallback {
    /** Instance ID of the Activity if one was launched or joined. */
    activityInstanceID?: string;
    /** ID of the interaction. */
    id: string;
    /** Whether or not the response message was ephemeral. */
    responseMessageEphemeral?: boolean;
    /** ID of the message that was created by the interaction. */
    responseMessageID?: string;
    /** Whether or not the message is in a loading state. */
    responseMessageLoading?: boolean;
    /** Interaction type. */
    type: InteractionTypes;
}

export interface InteractionCallbackResource<CH extends Types.Channels.AnyInteractionChannel | Types.Shared.Uncached = Types.Channels.AnyInteractionChannel | Types.Shared.Uncached> {
    /** Represents the Activity launched by this interaction. Only present if type is `LAUNCH_ACTIVITY`. */
    activityInstance?: Array<InteractionCallbackActivityInstance>;
    /** Message created by the interaction. Only present if type is either `CHANNEL_MESSAGE_WITH_SOURCE` or `UPDATE_MESSAGE`. */
    message?: Message<CH>;
    type: InteractionResponseTypes;
}
