import type * as Types from "../../types/namespaced";

export function fromRaw(option: Types.Applications.RawApplicationCommandOption): Types.Applications.ApplicationCommandOptions {
    return {
        autocomplete:             option.autocomplete,
        channelTypes:             option.channel_types,
        choices:                  option.choices,
        description:              option.description,
        descriptionLocalizations: option.description_localizations,
        descriptionLocalized:     option.description_localized,
        fileTypes:                option.file_types,
        maxLength:                option.max_length,
        maxValue:                 option.max_value,
        minLength:                option.min_length,
        minValue:                 option.min_value,
        name:                     option.name,
        nameLocalizations:        option.name_localizations,
        nameLocalized:            option.name_localized,
        options:                  option.options?.map(o => fromRaw(o)),
        required:                 option.required,
        type:                     option.type
    } satisfies Types.Shared.KeysExist<Types.Applications.ApplicationCommandOptions> as Types.Applications.ApplicationCommandOptions;
}

export function toRaw(option: Types.Applications.ApplicationCommandOptions): Types.Applications.RawApplicationCommandOption {
    const opt = option as Types.Applications.CombinedApplicationCommandOption;
    return {
        autocomplete:  opt.autocomplete,
        channel_types: opt.channelTypes,
        choices:       opt.choices?.map(choice => ({
            name:               choice.name,
            name_localizations: choice.nameLocalizations,
            value:              choice.value
        })),
        description:               opt.description,
        description_localizations: opt.descriptionLocalizations,
        description_localized:     opt.descriptionLocalized,
        file_types:                opt.fileTypes,
        max_length:                opt.maxLength,
        max_value:                 opt.maxValue,
        min_length:                opt.minLength,
        min_value:                 opt.minValue,
        name:                      opt.name,
        name_localizations:        opt.nameLocalizations,
        name_localized:            opt.nameLocalized,
        options:                   opt.options?.map(o => toRaw(o as Types.Applications.ApplicationCommandOptions)),
        required:                  opt.required,
        type:                      opt.type
    } satisfies Types.Shared.KeysExist<Types.Applications.RawApplicationCommandOption> as Types.Applications.RawApplicationCommandOption;
}
