import type { ApplicationCommandOptionTypes, ApplicationCommandPermissionTypes, ApplicationCommandTypes, GuildChannelTypes } from "../Constants";
import type ApplicationCommand from "../structures/ApplicationCommand";

// @TODO `name_localized` and `description_localized`

export interface RawApplicationCommand {
	application_id: string;
	default_member_permissions: string | null;
	description: string;
	description_localizations?: Record<string, string> | null;
	dm_permission?: boolean;
	guild_id?: string;
	id: string;
	name: string;
	name_localizations?: Record<string, string> | null;
	options?: Array<RawApplicationCommandOption>;
	type: ApplicationCommandTypes;
	version: string;
}

export interface RawApplicationCommandOption {
	autocomplete?: boolean;
	channel_types?: Array<GuildChannelTypes>;
	choices?: Array<RawApplicationCommandOptionChoice>;
	description: string;
	description_localizations?: Record<string, string> | null;
	max_length?: number;
	max_value?: number;
	min_length?: number;
	min_value?: number;
	name: string;
	name_localizations?: Record<string, string> | null;
	options?: Array<RawApplicationCommandOption>;
	required?: boolean;
	type: ApplicationCommandOptionTypes;
}

export interface CombinedApplicationCommandOption {
	autocomplete?: boolean;
	channelTypes?: Array<GuildChannelTypes>;
	choices?: Array<ApplicationCommandOptionsChoices>;
	description: string;
	descriptionLocalizations?: Record<string, string> | null;
	maxLength?: number;
	maxValue?: number;
	minLength?: number;
	minValue?: number;
	name: string;
	nameLocalizations?: Record<string, string> | null;
	options?: Array<CombinedApplicationCommandOption>;
	required?: boolean;
	type: ApplicationCommandOptionTypes;
}

export interface RawApplicationCommandOptionChoice {
	name: string;
	name_localizations?: Record<string, string> | null;
	value: string;
}

export type AnyApplicationCommand<W extends boolean = false> = ChatInputApplicationCommand<W> | UserApplicationCommand<W> | MessageApplicationCommand<W>;
export type ApplicationCommandOptions = ApplicationCommandOptionsWithOptions | ApplicationCommandOptionsWithValue;
export type ApplicationCommandOptionsWithOptions = ApplicationCommandOptionsSubCommand | ApplicationCommandOptionsSubCommandGroup;
export type ApplicationCommandOptionsWithValue = ApplicationCommandOptionsString | ApplicationCommandOptionsInteger | ApplicationCommandOptionsBoolean | ApplicationCommandOptionsUser | ApplicationCommandOptionsChannel | ApplicationCommandOptionsRole | ApplicationCommandOptionsMentionable | ApplicationCommandOptionsNumber | ApplicationCommandOptionsAttachment;
export type ChatInputApplicationCommand<W extends boolean = false> = WithLang<ApplicationCommand<ApplicationCommandTypes.CHAT_INPUT>, W>;
export type UserApplicationCommand<W extends boolean = false> = WithLang<ApplicationCommand<ApplicationCommandTypes.USER>, W>;
export type MessageApplicationCommand<W extends boolean = false> = WithLang<ApplicationCommand<ApplicationCommandTypes.MESSAGE>, W>;

export type ApplicationCommandOptionConversion<T extends EditApplicationCommandOptions | CreateApplicationCommandOptions> =
	T extends EditChatInputApplicationCommandOptions | CreateChatInputApplicationCommandOptions ? ChatInputApplicationCommand :
		T extends EditUserApplicationCommandOptions | CreateUserApplicationCommandOptions ? UserApplicationCommand :
			T extends EditMessageApplicationCommandOptions | CreateMessageApplicationCommandOptions ? MessageApplicationCommand :
				never;

type WithLang<T extends ApplicationCommand, W extends boolean> = Omit<T, "descriptionLocalizations" | "nameLocalizations"> & (W extends false ? never : {
	descriptionLocalizations: Record<string, string> |  null;
	nameLocalizations: Record<string, string> |  null;
});

export interface ApplicationCommandOptionBase<T extends ApplicationCommandOptionTypes = ApplicationCommandOptionTypes> {
	description: string;
	descriptionLocalizations?: Record<string, string>;
	name: string;
	nameLocalizations?: Record<string, string>;
	required?: T extends ApplicationCommandOptionTypes.SUB_COMMAND | ApplicationCommandOptionTypes.SUB_COMMAND_GROUP ? boolean : never;
	type: T;
}

type ApplicationCommandOptionsTypesWithAutocomplete = ApplicationCommandOptionTypes.INTEGER | ApplicationCommandOptionTypes.NUMBER | ApplicationCommandOptionTypes.STRING;
type ApplicationCommandOptionsTypesWithChoices = ApplicationCommandOptionTypes.INTEGER | ApplicationCommandOptionTypes.NUMBER | ApplicationCommandOptionTypes.STRING;
type ApplicationCommandOptionAutocomplete<T extends ApplicationCommandOptionTypes.INTEGER | ApplicationCommandOptionTypes.NUMBER | ApplicationCommandOptionTypes.STRING> = (ApplicationCommandOptionBase<T> & ApplicationCommandOptionsAutocomplete);
type ApplicationCommandOptionChannelTypes<T extends ApplicationCommandOptionTypes.CHANNEL> = (ApplicationCommandOptionBase<T> & ApplicationCommandOptionsChannelTypes);
type ApplicationCommandOptionChoices<T extends ApplicationCommandOptionTypes.INTEGER | ApplicationCommandOptionTypes.NUMBER | ApplicationCommandOptionTypes.STRING> = (ApplicationCommandOptionBase<T> & ApplicationCommandOptionsChoices<T>);
type ApplicationCommandOptionMinMaxValue<T extends ApplicationCommandOptionTypes.INTEGER | ApplicationCommandOptionTypes.NUMBER> = (ApplicationCommandOptionBase<T> & ApplicationCommandOptionsMinMaxValue);
type ApplicationCommandOptionMinMaxLength<T extends ApplicationCommandOptionTypes.STRING> = (ApplicationCommandOptionBase<T> & ApplicationCommandOptionsMinMaxLength);

interface ApplicationCommandOptionsChoices<T extends ApplicationCommandOptionsTypesWithChoices = ApplicationCommandOptionsTypesWithChoices> { choices?: Array<ApplicationCommandOptionsChoice<T>>; }

interface ApplicationCommandOptionsChoice<T extends ApplicationCommandOptionsTypesWithChoices = ApplicationCommandOptionsTypesWithChoices> {
	name: string;
	nameLocalizations?: Record<string, string>;
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
interface ApplicationCommandOptionsAutocomplete {
	autocomplete?: boolean;
}
interface ApplicationCommandOptionsMinMaxLength {
	maxLength?: number;
	minLength?: number;
}
interface ApplicationCommandOptionsSubCommand extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.SUB_COMMAND> {
	options?: Array<ApplicationCommandOptionsWithValue>;
}
interface ApplicationCommandOptionsSubCommandGroup extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.SUB_COMMAND_GROUP> {
	options?: Array<ApplicationCommandOptionsSubCommand | ApplicationCommandOptionsWithValue>;
}

type ApplicationCommandOptionsAttachment  = ApplicationCommandOptionBase<ApplicationCommandOptionTypes.ATTACHMENT>;
type ApplicationCommandOptionsBoolean     = ApplicationCommandOptionBase<ApplicationCommandOptionTypes.BOOLEAN>;
type ApplicationCommandOptionsChannel     = ApplicationCommandOptionChannelTypes<ApplicationCommandOptionTypes.CHANNEL>;
type ApplicationCommandOptionsInteger     = ApplicationCommandOptionAutocomplete<ApplicationCommandOptionTypes.INTEGER> | ApplicationCommandOptionChoices<ApplicationCommandOptionTypes.INTEGER> | ApplicationCommandOptionMinMaxValue<ApplicationCommandOptionTypes.INTEGER>;
type ApplicationCommandOptionsMentionable = ApplicationCommandOptionBase<ApplicationCommandOptionTypes.MENTIONABLE>;
type ApplicationCommandOptionsNumber      = ApplicationCommandOptionAutocomplete<ApplicationCommandOptionTypes.NUMBER> | ApplicationCommandOptionChoices<ApplicationCommandOptionTypes.NUMBER> | ApplicationCommandOptionMinMaxValue<ApplicationCommandOptionTypes.NUMBER>;
type ApplicationCommandOptionsRole        = ApplicationCommandOptionBase<ApplicationCommandOptionTypes.ROLE>;
type ApplicationCommandOptionsString      = ApplicationCommandOptionAutocomplete<ApplicationCommandOptionTypes.STRING> | ApplicationCommandOptionChoices<ApplicationCommandOptionTypes.STRING> | ApplicationCommandOptionMinMaxLength<ApplicationCommandOptionTypes.STRING>;
type ApplicationCommandOptionsUser        = ApplicationCommandOptionBase<ApplicationCommandOptionTypes.USER>;

// desc, options
export interface CreateApplicationCommandOptionsBase<T extends ApplicationCommandTypes = ApplicationCommandTypes> {
	defaultMemberPermissions?: string | null;
	dmPermission?: boolean | null;
	name: string;
	nameLocalizations?: Record<string, string> | null;
	type: T;
}

export type CreateApplicationCommandOptions = CreateChatInputApplicationCommandOptions | CreateUserApplicationCommandOptions | CreateMessageApplicationCommandOptions;
export interface CreateChatInputApplicationCommandOptions extends CreateApplicationCommandOptionsBase<ApplicationCommandTypes.CHAT_INPUT> {
	description: string;
	descriptionLocalizations?: Record<string, string> | null;
	options?: Array<ApplicationCommandOptions>;
}

export type CreateUserApplicationCommandOptions = CreateApplicationCommandOptionsBase<ApplicationCommandTypes.USER>;
export type CreateMessageApplicationCommandOptions = CreateApplicationCommandOptionsBase<ApplicationCommandTypes.MESSAGE>;

export type EditApplicationCommandOptions = EditChatInputApplicationCommandOptions | EditUserApplicationCommandOptions | EditMessageApplicationCommandOptions;
export type EditChatInputApplicationCommandOptions = Partial<Omit<CreateChatInputApplicationCommandOptions, "type">>;
export type EditUserApplicationCommandOptions = Partial<Omit<CreateUserApplicationCommandOptions, "type">>;
export type EditMessageApplicationCommandOptions = Partial<Omit<CreateMessageApplicationCommandOptions, "type">>;

export interface RawGuildApplicationCommandPermissions {
	application_id: string;
	guild_id: string;
	id: string;
	permissions: Array<ApplicationCommandPermission>;
}

export interface GuildApplicationCommandPermissions {
	applicationID: string;
	guildID: string;
	id: string;
	permissions: Array<ApplicationCommandPermission>;
}

export interface ApplicationCommandPermission {
	id: string;
	permission: boolean;
	type: ApplicationCommandPermissionTypes;
}

export interface EditApplicationCommandPermissionsOptions {
	accessToken?: string;
	permissions: Array<ApplicationCommandPermission>;
}

export type TypeToEdit<T extends ApplicationCommandTypes> =
T extends ApplicationCommandTypes.CHAT_INPUT ? EditChatInputApplicationCommandOptions :
	T extends ApplicationCommandTypes.USER ? EditUserApplicationCommandOptions :
		T extends ApplicationCommandTypes.MESSAGE ? EditMessageApplicationCommandOptions :
			never;
