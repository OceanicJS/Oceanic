"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Properties_1 = __importDefault(require("./Properties"));
const Routes_1 = require("./Routes");
const Constants_1 = require("../Constants");
const Member_1 = __importDefault(require("../structures/Member"));
const assert_1 = require("assert");
/** A general set of utilities. These are intentionally poorly documented, as they serve almost no usefulness to outside developers. */
class Util {
    static BASE64URL_REGEX = /^data:image\/(?:jpeg|png|gif);base64,(?:[A-Za-z0-9+/]{2}[A-Za-z0-9+/]{2})*(?:[A-Za-z0-9+/]{2}(==)?|[A-Za-z0-9+/]{3}=?)?$/;
    _client;
    constructor(client) {
        Properties_1.default.looseDefine(this, "_client", client);
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
    assert(condition, message) {
        if (!condition)
            throw new assert_1.AssertionError({ message });
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
            return this.formatAllowedMentions(this._client.options.allowedMentions);
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
            format = url.includes("/a_") ? "gif" : this._client.options.defaultImageFormat;
        if (!size || size < Constants_1.MIN_IMAGE_SIZE || size > Constants_1.MAX_IMAGE_SIZE)
            size = this._client.options.defaultImageSize;
        return `${Routes_1.CDN_URL}${url}.${format}?size=${size}`;
    }
    is(input) {
        return true;
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
        return this._client.guilds.has(guildID) ? this._client.guilds.get(guildID).members.update({ ...member, id: memberID }, guildID) : new Member_1.default(member, this._client, guildID);
    }
}
exports.default = Util;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi91dGlsL1V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4REFBc0M7QUFDdEMscUNBQW1DO0FBR25DLDRDQU1zQjtBQWF0QixrRUFBMEM7QUFDMUMsbUNBQXdDO0FBRXhDLHVJQUF1STtBQUN2SSxNQUFxQixJQUFJO0lBQ3JCLE1BQU0sQ0FBQyxlQUFlLEdBQUcsMEhBQTBILENBQUM7SUFDNUksT0FBTyxDQUFVO0lBRXpCLFlBQVksTUFBYztRQUN0QixvQkFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCwwRUFBMEU7SUFDMUUsYUFBYSxDQUFDLEtBQXNCLEVBQUUsSUFBWTtRQUM5QyxJQUFJO1lBQ0EsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25DO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDVixNQUFNLElBQUksS0FBSyxDQUFDLFdBQVcsSUFBSSwwRUFBMEUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFZLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZJO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxTQUFrQixFQUFFLE9BQWdCO1FBQ3ZDLElBQUksQ0FBQyxTQUFTO1lBQUUsTUFBTSxJQUFJLHVCQUFjLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxrQkFBa0IsQ0FBb0QsVUFBb0I7UUFDdEYsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMxQixJQUFJLEVBQVEsR0FBRyxDQUFDLElBQUk7WUFDcEIsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUN2QyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssMEJBQWMs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