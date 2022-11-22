/** @module Types/ApplicationCommands */
import type { ExclusifyUnion } from "./shared";
import type { ApplicationCommandOptionTypes, ApplicationCommandPermissionTypes, ApplicationCommandTypes, GuildChannelTypes } from "../Constants";
import type ApplicationCommand from "../structures/ApplicationCommand";
import type ClientApplication from "../structures/ClientApplication";

export interface RawApplicationCommand {
    application_id: string;
    default_member_permissions: string | null;
    description: string;
    description_localizations?: LocaleMap | null;
    description_localized?: string;
    dm_permission?: boolean;
    guild_id?: string;
    id: string;
    name: string;
    name_localizations?: LocaleMap | null;
    name_localized?: string;
    nsfw?: boolean;
    options?: Array<RawApplicationCommandOption>;
    type: ApplicationCommandTypes;
    version: string;
}

export interface RawApplicationCommandOption {
    autocomplete?: boolean;
    channel_types?: Array<GuildChannelTypes>;
    choices?: Array<RawApplicationCommandOptionChoice>;
    description: string;
    description_localizations?: LocaleMap | null;
    description_localized?: string;
    max_length?: number;
    max_value?: number;
    min_length?: number;
    min_value?: number;
    name: string;
    name_localizations?: LocaleMap | null;
    name_localized?: string;
    options?: Array<RawApplicationCommandOption>;
    required?: boolean;
    type: ApplicationCommandOptionTypes;
}

export interface CombinedApplicationCommandOption {
    autocomplete?: boolean;
    channelTypes?: Array<GuildChannelTypes>;
    choices?: Array<ApplicationCommandOptionsChoices>;
    description: string;
    descriptionLocalizations?: LocaleMap | null;
    maxLength?: number;
    maxValue?: number;
    minLength?: number;
    minValue?: number;
    name: string;
    nameLocalizations?: LocaleMap | null;
    options?: Array<CombinedApplicationCommandOption>;
    required?: boolean;
    type: ApplicationCommandOptionTypes;
}

export interface RawApplicationCommandOptionChoice {
    name: string;
    name_localizations?: LocaleMap | null;
    value: string;
}

export type AnyApplicationCommand = ChatInputApplicationCommand | UserApplicationCommand | MessageApplicationCommand;
export type ApplicationCommandOptions = ApplicationCommandOptionsWithOptions | ApplicationCommandOptionsWithValue;
export type ApplicationCommandOptionsWithOptions = ApplicationCommandOptionsSubCommand | ApplicationCommandOptionsSubCommandGroup;
export type ApplicationCommandOptionsWithValue = ApplicationCommandOptionsString | ApplicationCommandOptionsInteger | ApplicationCommandOptionsBoolean | ApplicationCommandOptionsUser | ApplicationCommandOptionsChannel | ApplicationCommandOptionsRole | ApplicationCommandOptionsMentionable | ApplicationCommandOptionsNumber | ApplicationCommandOptionsAttachment;
export type ChatInputApplicationCommand = ApplicationCommand<ApplicationCommandTypes.CHAT_INPUT>;
export type UserApplicationCommand = ApplicationCommand<ApplicationCommandTypes.USER>;
export type MessageApplicationCommand = ApplicationCommand<ApplicationCommandTypes.MESSAGE>;

export type ApplicationCommandOptionConversion<T extends EditApplicationCommandOptions | CreateApplicationCommandOptions> =
    T extends EditChatInputApplicationCommandOptions | CreateChatInputApplicationCommandOptions ? ChatInputApplicationCommand :
        T extends EditUserApplicationCommandOptions | CreateUserApplicationCommandOptions ? UserApplicationCommand :
            T extends EditMessageApplicationCommandOptions | CreateMessageApplicationCommandOptions ? MessageApplicationCommand :
                never;


export interface ApplicationCommandOptionBase<T extends ApplicationCommandOptionTypes = ApplicationCommandOptionTypes> {
    description: string;
    descriptionLocalizations?: LocaleMap;
    /** The description of this application command in the requested locale. This cannot be sent. */
    descriptionLocalized?: string;
    name: string;
    nameLocalizations?: LocaleMap;
    /** The description of this application command in the requested locale. This cannot be sent. */
    nameLocalized?: string;
    required?: T extends ApplicationCommandOptionTypes.SUB_COMMAND | ApplicationCommandOptionTypes.SUB_COMMAND_GROUP ? never : boolean;
    type: T;
}

type ApplicationCommandOptionsTypesWithAutocomplete = ApplicationCommandOptionTypes.INTEGER | ApplicationCommandOptionTypes.NUMBER | ApplicationCommandOptionTypes.STRING;
type ApplicationCommandOptionsTypesWithChoices = ApplicationCommandOptionTypes.INTEGER | ApplicationCommandOptionTypes.NUMBER | ApplicationCommandOptionTypes.STRING;

interface ApplicationCommandOptionsChoices<T extends ApplicationCommandOptionsTypesWithChoices = ApplicationCommandOptionsTypesWithChoices> {
    choices?: Array<ApplicationCommandOptionsChoice<T>>;
}

interface ApplicationCommandOptionsChoice<T extends ApplicationCommandOptionsTypesWithChoices = ApplicationCommandOptionsTypesWithChoices> {
    name: string;
    nameLocalizations?: LocaleMap;
    value:
    T extends ApplicationCommandOptionTypes.STRING ? string :
        T extends ApplicationCommandOptionTypes.INTEGER | ApplicationCommandOptionTypes.NUMBER ? number :
            unknown;
}

interface ApplicationCommandOptionsChannelTypes {
    channelTypes?: Array<GuildChannelTypes>;
}

interface ApplicationCommandOptionsMinMaxValue {
    maxValue?: number;
    minValue?: number;
}

interface ApplicationCommandOptionsMinMaxLength {
    maxLength?: number;
    minLength?: number;
}

interface ApplicationCommandOptionsAutocomplete {
    autocomplete?: boolean;
}

interface ApplicationCommandOptionsSubCommand extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.SUB_COMMAND> {
    options?: Array<ApplicationCommandOptionsWithValue>;
}

interface ApplicationCommandOptionsSubCommandGroup extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.SUB_COMMAND_GROUP> {
    options?: Array<ApplicationCommandOptionsSubCommand | ApplicationCommandOptionsWithValue>;
}

type ApplicationCommandOptionsAttachment  = ApplicationCommandOptionBase<ApplicationCommandOptionTypes.ATTACHMENT>;
type ApplicationCommandOptionsBoolean     = ApplicationCommandOptionBase<ApplicationCommandOptionTypes.BOOLEAN>;
type ApplicationCommandOptionsChannel     = ApplicationCommandOptionBase<ApplicationCommandOptionTypes.CHANNEL> & ApplicationCommandOptionsChannelTypes;
type ApplicationCommandOptionsInteger     = ApplicationCommandOptionBase<ApplicationCommandOptionTypes.INTEGER> & ExclusifyUnion<ApplicationCommandOptionsAutocomplete | ApplicationCommandOptionsMinMaxValue | ApplicationCommandOptionsChoices<ApplicationCommandOptionTypes.INTEGER>>;
type ApplicationCommandOptionsMentionable = ApplicationCommandOptionBase<ApplicationCommandOptionTypes.MENTIONABLE>;
type ApplicationCommandOptionsNumber      = ApplicationCommandOptionBase<ApplicationCommandOptionTypes.NUMBER> & ExclusifyUnion<ApplicationCommandOptionsAutocomplete | ApplicationCommandOptionsMinMaxValue | ApplicationCommandOptionsChoices<ApplicationCommandOptionTypes.NUMBER>>;
type ApplicationCommandOptionsRole        = ApplicationCommandOptionBase<ApplicationCommandOptionTypes.ROLE>;
type ApplicationCommandOptionsString      = ApplicationCommandOptionBase<ApplicationCommandOptionTypes.STRING> & ExclusifyUnion<ApplicationCommandOptionsAutocomplete | ApplicationCommandOptionsMinMaxLength | ApplicationCommandOptionsChoices<ApplicationCommandOptionTypes.STRING>>;
type ApplicationCommandOptionsUser        = ApplicationCommandOptionBase<ApplicationCommandOptionTypes.USER>;

// desc, options
export interface CreateApplicationCommandOptionsBase<T extends ApplicationCommandTypes = ApplicationCommandTypes> {
    /** The default member permissions for the command. */
    defaultMemberPermissions?: string | null;
    /** If the command can be used in a DM. */
    dmPermission?: boolean | null;
    /** The ID of the command, if known. (Only usable when bulkEditing guild commands.) */
    id?: string;
    /** The name of the command. */
    name: string;
    /** A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names. */
    nameLocalizations?: LocaleMap | null;
    /** Whether the command is age restricted. */
    nsfw?: boolean;
    /** The type of the command. */
    type: T;
}

export type CreateApplicationCommandOptions = CreateChatInputApplicationCommandOptions | CreateUserApplicationCommandOptions | CreateMessageApplicationCommandOptions;
export type CreateGuildApplicationCommandOptions = Omit<CreateChatInputApplicationCommandOptions, "dmPermission"> | Omit<CreateUserApplicationCommandOptions, "dmPermission"> | Omit<CreateMessageApplicationCommandOptions, "dmPermission">;
export interface CreateChatInputApplicationCommandOptions extends CreateApplicationCommandOptionsBase<ApplicationCommandTypes.CHAT_INPUT> {
    /** The description of the command. */
    description: string;
    /** A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized descriptions. */
    descriptionLocalizations?: LocaleMap | null;
    /** See [Discord's docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure) for more information. Convert `snake_case` keys to `camelCase`. */
    options?: Array<ApplicationCommandOptions>;
}

export type CreateUserApplicationCommandOptions = CreateApplicationCommandOptionsBase<ApplicationCommandTypes.USER>;
export type CreateMessageApplicationCommandOptions = CreateApplicationCommandOptionsBase<ApplicationCommandTypes.MESSAGE>;

export type EditApplicationCommandOptions = EditChatInputApplicationCommandOptions | EditUserApplicationCommandOptions | EditMessageApplicationCommandOptions;
export type EditChatInputApplicationCommandOptions = Partial<Omit<CreateChatInputApplicationCommandOptions, "type">>;
export type EditUserApplicationCommandOptions = Partial<Omit<CreateUserApplicationCommandOptions, "type">>;
export type EditMessageApplicationCommandOptions = Partial<Omit<CreateMessageApplicationCommandOptions, "type">>;

export type EditGuildApplicationCommandOptions = EditGuildChatInputApplicationCommandOptions | EditGuildUserApplicationCommandOptions | EditGuildMessageApplicationCommandOptions;
export type EditGuildChatInputApplicationCommandOptions = Partial<Omit<CreateChatInputApplicationCommandOptions, "type" | "dmPermission">>;
export type EditGuildUserApplicationCommandOptions = Partial<Omit<CreateUserApplicationCommandOptions, "type" | "dmPermission">>;
export type EditGuildMessageApplicationCommandOptions = Partial<Omit<CreateMessageApplicationCommandOptions, "type" | "dmPermission">>;

export interface RawGuildApplicationCommandPermissions {
    application_id: string;
    guild_id: string;
    id: string;
    permissions: Array<ApplicationCommandPermission>;
}

export interface RESTGuildApplicationCommandPermissions {
    applicationID: string;
    guildID: string;
    id: string;
    permissions: Array<ApplicationCommandPermission>;
}
export interface GuildApplicationCommandPermissions {
    application?: ClientApplication;
    applicationID: string;
    id: string;
    permissions: Array<ApplicationCommandPermission>;
}

export interface ApplicationCommandPermission {
    /** The id of the role, user, channel, or a [permission constant](https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permissions-constants). */
    id: string;
    /** If the permission is allowed. */
    permission: boolean;
    /** The [type](https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permission-type) of permission */
    type: ApplicationCommandPermissionTypes;
}

export interface EditApplicationCommandPermissionsOptions {
    /** If the overall authorization of this rest instance is not a bearer token, a bearer token can be supplied via this option. */
    accessToken?: string;
    /** The permissions to set for the command. */
    permissions: Array<ApplicationCommandPermission>;
}

export type TypeToEdit<T extends ApplicationCommandTypes> =
T extends ApplicationCommandTypes.CHAT_INPUT ? EditChatInputApplicationCommandOptions :
    T extends ApplicationCommandTypes.USER ? EditUserApplicationCommandOptions :
        T extends ApplicationCommandTypes.MESSAGE ? EditMessageApplicationCommandOptions :
            never;


export interface GetApplicationCommandOptions {
    /** The [locale](https://discord.com/developers/docs/reference#locales) to receive localized responses for (`descriptionLocalized`, `nameLocalized`). If no localization for the locale is present, the properties will not be present. */
    locale?: string;
    /** If localizations should be included. */
    withLocalizations?: boolean;
}

export type Locale =
    "bg" |
    "cs" |
    "da" |
    "de" |
    "el" |
    "en-GB" |
    "en-US" |
    "es-ES" |
    "fi" |
    "fr" |
    "hi" |
    "hr" |
    "hu" |
    "id" |
    "it" |
    "ja" |
    "ko" |
    "lt" |
    "nl" |
    "no" |
    "pl" |
    "pt-BR" |
    "ro" |
    "ru" |
    "sv-SE" |
    "th" |
    "tr" |
    "uk" |
    "vi" |
    "zh-CN" |
    "zh-TW";
export type LocaleMap = Partial<Record<Locale, string>>;
