"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.is = void 0;
const Routes_1 = require("./Routes");
const Constants_1 = require("../Constants");
const Member_1 = __importDefault(require("../structures/Member"));
/** A general set of utilities. These are intentionally poorly documented, as they serve almost no usefulness to outside developers. */
class Util {
    static BASE64URL_REGEX = /^data:image\/(?:jpeg|png|gif);base64,(?:[A-Za-z0-9+/]{2}[A-Za-z0-9+/]{2})*(?:[A-Za-z0-9+/]{2}(==)?|[A-Za-z0-9+/]{3}=?)?$/;
    #client;
    constructor(client) {
        this.#client = client;
    }
    /** @hidden intentionally not documented - this is an internal function */
    _convertImage(image, name) {
        try {
            return this.convertImage(image);
        }
        catch (err) {
            throw new Error(`Invalid ${name} provided. Ensure you are providing a valid, fully-qualified base64 url.`, { cause: err });
        }
    }
    componentsToParsed(components) {
        return components.map(row => ({
            type: row.type,
            components: row.components.map(component => {
                if (component.type === Constants_1.ComponentTypes.BUTTON) {
                    if (component.style === Constants_1.ButtonStyles.LINK)
                        return component;
                    else
                        return {
                            customID: component.custom_id,
                            disabled: component.disabled,
                            emoji: component.emoji,
                            label: component.label,
                            style: component.style,
                            type: component.type
                        };
                }
                else if (component.type === Constants_1.ComponentTypes.SELECT_MENU)
                    return {
                        customID: component.custom_id,
                        disabled: component.disabled,
                        maxValues: component.max_values,
                        minValues: component.min_values,
                        options: component.options,
                        placeholder: component.placeholder,
                        type: component.type
                    };
                else if (component.type === Constants_1.ComponentTypes.TEXT_INPUT) {
                    return {
                        customID: component.custom_id,
                        label: component.label,
                        maxLength: component.max_length,
                        minLength: component.min_length,
                        placeholder: component.placeholder,
                        required: component.required,
                        style: component.style,
                        type: component.type,
                        value: component.value
                    };
                }
                else
                    return component;
            })
        }));
    }
    componentsToRaw(components) {
        return components.map(row => ({
            type: row.type,
            components: row.components.map(component => {
                if (component.type === Constants_1.ComponentTypes.BUTTON) {
                    if (component.style === Constants_1.ButtonStyles.LINK)
                        return component;
                    else
                        return {
                            custom_id: component.customID,
                            disabled: component.disabled,
                            emoji: component.emoji,
                            label: component.label,
                            style: component.style,
                            type: component.type
                        };
                }
                else if (component.type === Constants_1.ComponentTypes.SELECT_MENU) {
                    return {
                        custom_id: component.customID,
                        disabled: component.disabled,
                        max_values: component.maxValues,
                        min_values: component.minValues,
                        options: component.options,
                        placeholder: component.placeholder,
                        type: component.type
                    };
                }
                else if (component.type === Constants_1.ComponentTypes.TEXT_INPUT) {
                    return {
                        custom_id: component.customID,
                        label: component.label,
                        max_length: component.maxLength,
                        min_length: component.minLength,
                        placeholder: component.placeholder,
                        required: component.required,
                        style: component.style,
                        type: component.type,
                        value: component.value
                    };
                }
                else
                    return component;
            })
        }));
    }
    convertImage(img) {
        if (Buffer.isBuffer(img)) {
            const b64 = img.toString("base64");
            let mime;
            const magic = [...new Uint8Array(img.subarray(0, 4))].map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
            switch (magic) {
                case "47494638":
                    mime = "image/gif";
                    break;
                case "89504E47":
                    mime = "image/png";
                    break;
                case "FFD8FFDB":
                case "FFD8FFE0":
                case "49460001":
                case "FFD8FFEE":
                case "69660000":
                    mime = "image/jpeg";
                    break;
            }
            if (!mime)
                throw new Error(`Failed to determine image format. (magic: ${magic})`);
            img = `data:${mime};base64,${b64}`;
        }
        if (!Util.BASE64URL_REGEX.test(img))
            throw new Error("Invalid image provided. Ensure you are providing a valid, fully-qualified base64 url.");
        return img;
    }
    formatAllowedMentions(allowed) {
        const result = {
            parse: []
        };
        if (!allowed)
            return this.formatAllowedMentions(this.#client.options.allowedMentions);
        if (allowed.everyone === true)
            result.parse.push("everyone");
        if (allowed.roles === true)
            result.parse.push("roles");
        else if (Array.isArray(allowed.roles))
            result.roles = allowed.roles;
        if (allowed.users === true)
            result.parse.push("users");
        else if (Array.isArray(allowed.users))
            result.users = allowed.users;
        if (allowed.repliedUser === true)
            result.replied_user = true;
        return result;
    }
    formatImage(url, format, size) {
        if (!format || !Constants_1.ImageFormats.includes(format.toLowerCase()))
            format = url.includes("/a_") ? "gif" : this.#client.options.defaultImageFormat;
        if (!size || size < Constants_1.MIN_IMAGE_SIZE || size > Constants_1.MAX_IMAGE_SIZE)
            size = this.#client.options.defaultImageSize;
        return `${Routes_1.CDN_URL}${url}.${format}?size=${size}`;
    }
    optionToParsed(option) {
        const opt = option;
        return {
            autocomplete: opt.autocomplete,
            channelTypes: opt.channel_types,
            choices: opt.choices,
            description: opt.description,
            descriptionLocalizations: opt.description_localizations,
            max_length: opt.max_length,
            max_value: opt.max_value,
            min_length: opt.min_length,
            min_value: opt.min_value,
            name: opt.name,
            nameLocalizations: opt.name_localizations,
            options: opt.options?.map(o => this.optionToParsed(o)),
            required: opt.required,
            type: opt.type
        };
    }
    optionToRaw(option) {
        const opt = option;
        return {
            autocomplete: opt.autocomplete,
            channel_types: opt.channelTypes,
            choices: opt.choices,
            description: opt.description,
            description_localizations: opt.descriptionLocalizations,
            max_length: opt.maxLength,
            max_value: opt.maxValue,
            min_length: opt.minLength,
            min_value: opt.minValue,
            name: opt.name,
            name_localizations: opt.nameLocalizations,
            options: opt.options?.map(o => this.optionToRaw(o)),
            required: opt.required,
            type: opt.type
        };
    }
    updateMember(guildID, memberID, member) {
        return this.#client.guilds.has(guildID) ? this.#client.guilds.get(guildID).members.update({ ...member, id: memberID }, guildID) : new Member_1.default(member, this.#client, guildID);
    }
}
exports.default = Util;
function is(input) {
    return true;
}
exports.is = is;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi91dGlsL1V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEscUNBQW1DO0FBR25DLDRDQU1zQjtBQWF0QixrRUFBMEM7QUFFMUMsdUlBQXVJO0FBQ3ZJLE1BQXFCLElBQUk7SUFDckIsTUFBTSxDQUFDLGVBQWUsR0FBRywwSEFBMEgsQ0FBQztJQUNwSixPQUFPLENBQVU7SUFFakIsWUFBWSxNQUFjO1FBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQzFCLENBQUM7SUFFRCwwRUFBMEU7SUFDMUUsYUFBYSxDQUFDLEtBQXNCLEVBQUUsSUFBWTtRQUM5QyxJQUFJO1lBQ0EsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25DO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDVixNQUFNLElBQUksS0FBSyxDQUFDLFdBQVcsSUFBSSwwRUFBMEUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFZLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZJO0lBQ0wsQ0FBQztJQUVELGtCQUFrQixDQUFvRCxVQUFvQjtRQUN0RixPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzFCLElBQUksRUFBUSxHQUFHLENBQUMsSUFBSTtZQUNwQixVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ3ZDLElBQUksU0FBUyxDQUFDLElBQUksS0FBSywwQkFBYyxDQUFDLE1BQU0sRUFBRTtvQkFDMUMsSUFBSSxTQUFTLENBQUMsS0FBSyxLQUFLLHdCQUFZLENBQUMsSUFBSTt3QkFBRSxPQUFPLFNBQVMsQ0FBQzs7d0JBQ3ZELE9BQU87NEJBQ1IsUUFBUSxFQUFFLFNBQVMsQ0FBQyxTQUFTOzRCQUM3QixRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVE7NEJBQzVC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