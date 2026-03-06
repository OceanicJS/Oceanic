/** @module REST/ApplicationCommands */
import * as Routes from "../util/Routes";
import type * as Types from "../types/namespaced";
import ApplicationCommand from "../structures/ApplicationCommand";
import type RESTManager from "../rest/RESTManager";
import SKU from "../structures/SKU";
import Entitlement from "../structures/Entitlement";
import TestEntitlement from "../structures/TestEntitlement";
import ClientApplication from "../structures/ClientApplication";
import Application from "../structures/Application";
import Subscription from "../structures/Subscription";
import QueryBuilder from "../util/QueryBuilder";

/** Various methods for interacting with application commands. Located at {@link Client#rest | Client#rest}{@link RESTManager#applications | .applications}. */
export default class Applications {
    private _manager: RESTManager;
    constructor(manager: RESTManager) {
        this._manager = manager;
    }

    /**
     * Overwrite all existing global application commands.
     * @param applicationID The ID of the application.
     * @param options The commands.
     * @caching This method **does not** cache its result.
     */
    async bulkEditGlobalCommands(applicationID: string, options: Array<Types.Applications.CreateApplicationCommandOptions>): Promise<Array<ApplicationCommand>> {
        const opts = options as Array<Types.Applications.CreateChatInputApplicationCommandOptions>;
        return this._manager.authRequest<Array<Types.Applications.RawApplicationCommand>>({
            method: "PUT",
            path:   Routes.APPLICATION_COMMANDS(applicationID),
            json:   opts.map(opt => ({
                contexts:                   opt.contexts,
                description:                opt.description,
                default_member_permissions: opt.defaultMemberPermissions,
                description_localizations:  opt.descriptionLocalizations,
                dm_permission:              opt.dmPermission,
                handler:                    (opt as unknown as Types.Applications.CreatePrimaryEntryPointApplicationCommandOptions).handler,
                integration_types:          opt.integrationTypes,
                name:                       opt.name,
                name_localizations:         opt.nameLocalizations,
                nsfw:                       opt.nsfw,
                options:                    opt.options?.map(o => this._manager.client.util.optionToRaw(o)),
                type:                       opt.type
            }))
        }).then(data => data.map(d => new ApplicationCommand(d, this._manager.client)));
    }

    /**
     * Overwrite all existing application commands in a guild.
     * @param applicationID The ID of the application.
     * @param guildID The ID of the guild.
     * @param options The commands.
     * @caching This method **does not** cache its result.
     */
    async bulkEditGuildCommands(applicationID: string, guildID: string, options: Array<Types.Applications.CreateGuildApplicationCommandOptions>): Promise<Array<ApplicationCommand>> {
        const opts = this._manager.client.util._freeze(options) as Array<Types.Applications.CreateChatInputApplicationCommandOptions>;
        return this._manager.authRequest<Array<Types.Applications.RawApplicationCommand>>({
            method: "PUT",
            path:   Routes.GUILD_APPLICATION_COMMANDS(applicationID, guildID),
            json:   opts.map(opt => ({
                id:                         opt.id,
                default_member_permissions: opt.defaultMemberPermissions,
                description:                opt.description,
                description_localizations:  opt.descriptionLocalizations,
                dm_permission:              opt.dmPermission,
                name:                       opt.name,
                name_localizations:         opt.nameLocalizations,
                nsfw:                       opt.nsfw,
                options:                    opt.options?.map(o => this._manager.client.util.optionToRaw(o)),
                type:                       opt.type
            }))
        }).then(data => data.map(d => new ApplicationCommand(d, this._manager.client)));
    }

    /**
     * Mark an entitlement as consumed.
     * @param applicationID The ID of the application to the entitlement is for.
     * @param entitlementID The ID of the entitlement to consume.
     */
    async consumeEntitlement(applicationID: string, entitlementID: string): Promise<void> {
        await this._manager.authRequest<void>({
            method: "POST",
            path:   Routes.CONSUME_ENTITLEMENT(applicationID, entitlementID)
        });
    }

    /**
     * Create an emoji for an application.
     * @param applicationID The ID of the application.
     * @param options The options for creating the emoji.
     * @caching This method **does not** cache its result.
     */
    async createEmoji(applicationID: string, options: Types.Applications.CreateApplicationEmojiOptions): Promise<Types.Applications.ApplicationEmoji> {
        options = this._manager.client.util._freeze(options);
        let image: string | undefined;
        if (options.image) {
            image = this._manager.client.util._convertImage(options.image, "image");
        }

        return this._manager.authRequest<Types.Applications.RawApplicationEmoji>({
            method: "POST",
            path:   Routes.APPLICATION_EMOJIS(applicationID),
            json:   {
                name: options.name,
                image
            }
        }).then(emoji => this._manager.client.util.convertApplicationEmoji(emoji));
    }

    /**
     * Create a global application command.
     * @param applicationID The ID of the application.
     * @param options The options for the command.
     * @caching This method **does not** cache its result.
     */
    async createGlobalCommand<T extends Types.Applications.CreateApplicationCommandOptions = Types.Applications.CreateApplicationCommandOptions>(applicationID: string, options: T): Promise<Types.Applications.ApplicationCommandOptionConversion<T>> {
        const opt = this._manager.client.util._freeze(options) as Types.Applications.CreateChatInputApplicationCommandOptions;
        return this._manager.authRequest<Types.Applications.RawApplicationCommand>({
            method: "POST",
            path:   Routes.APPLICATION_COMMANDS(applicationID),
            json:   {
                contexts:                   opt.contexts,
                default_member_permissions: opt.defaultMemberPermissions,
                description_localizations:  opt.descriptionLocalizations,
                description:                opt.description,
                dm_permission:              opt.dmPermission,
                handler:                    (opt as unknown as Types.Applications.CreatePrimaryEntryPointApplicationCommandOptions).handler,
                integration_types:          opt.integrationTypes,
                name_localizations:         opt.nameLocalizations,
                name:                       opt.name,
                nsfw:                       opt.nsfw,
                options:                    opt.options?.map(o => this._manager.client.util.optionToRaw(o)),
                type:                       opt.type
            }
        }).then(data => new ApplicationCommand(data, this._manager.client) as never);
    }

    /**
     * Create a guild application command.
     * @param applicationID The ID of the application.
     * @param guildID The ID of the guild.
     * @param options The options for the command.
     * @caching This method **does not** cache its result.
     */
    async createGuildCommand<T extends Types.Applications.CreateGuildApplicationCommandOptions = Types.Applications.CreateGuildApplicationCommandOptions>(applicationID: string, guildID: string, options: T): Promise<Types.Applications.ApplicationCommandOptionConversion<T>> {
        const opt = this._manager.client.util._freeze(options) as Types.Applications.CreateChatInputApplicationCommandOptions;
        return this._manager.authRequest<Types.Applications.RawApplicationCommand>({
            method: "POST",
            path:   Routes.GUILD_APPLICATION_COMMANDS(applicationID, guildID),
            json:   {
                default_member_permissions: opt.defaultMemberPermissions,
                description:                opt.description,
                description_localizations:  opt.descriptionLocalizations,
                dm_permission:              opt.dmPermission,
                name:                       opt.name,
                name_localizations:         opt.nameLocalizations,
                nsfw:                       opt.nsfw,
                options:                    opt.options?.map(o => this._manager.client.util.optionToRaw(o)),
                type:                       opt.type
            }
        }).then(data => new ApplicationCommand(data, this._manager.client) as never);
    }

    /**
     * Create a test entitlement.
     * @param applicationID The ID of the application to create the entitlement for.
     * @param options The options for creating the test entitlement.
     */
    async createTestEntitlement(applicationID: string, options: Types.Applications.CreateTestEntitlementOptions): Promise<TestEntitlement> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.Applications.RawTestEntitlement>({
            method: "POST",
            path:   Routes.ENTITLEMENTS(applicationID),
            json:   {
                owner_id:   options.ownerID,
                owner_type: options.ownerType,
                sku_id:     options.skuID
            }
        }).then(data => new TestEntitlement(data, this._manager.client));
    }

    /**
     * Delete an emoji for an application.
     * @param applicationID The ID of the application.
     * @param emojiID The ID of the emoji to be deleted.
     * @caching This method **does not** cache its result.
     */
    async deleteEmoji(applicationID: string, emojiID: string): Promise<void> {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.APPLICATION_EMOJI(applicationID, emojiID)
        });
    }

    /**
     * Delete a global application command.
     * @param applicationID The ID of the application.
     * @param commandID The ID the command to delete.
     * @caching This method **does not** cache its result.
     */
    async deleteGlobalCommand(applicationID: string, commandID: string): Promise<void> {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.APPLICATION_COMMAND(applicationID, commandID)
        });
    }

    /**
     * Delete a guild application command.
     * @param applicationID The ID of the application.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command to delete.
     * @caching This method **does not** cache its result.
     */
    async deleteGuildCommand(applicationID: string, guildID: string, commandID: string): Promise<void> {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_APPLICATION_COMMAND(applicationID, guildID, commandID)
        });
    }

    /**
     * Delete an entitlement.
     * @param applicationID The ID of the application to delete the entitlement from.
     * @param entitlementID The ID of the entitlement to delete.
     */
    async deleteTestEntitlement(applicationID: string, entitlementID: string): Promise<void> {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.ENTITLEMENT(applicationID, entitlementID)
        });
    }

    /**
     * Edit the currently authenticated bot's application info.
     * @param options The options for editing the application.
     * @caching This method **does not** cache its result.
     */
    async editCurrent(options: Types.Applications.EditApplicationOptions): Promise<Application> {
        options = this._manager.client.util._freeze(options);
        let coverImage: string | undefined, icon: string | undefined;
        if (options.coverImage) {
            coverImage = this._manager.client.util._convertImage(options.coverImage, "cover image");
        }

        if (options.icon) {
            icon = this._manager.client.util._convertImage(options.icon, "icon");
        }

        return this._manager.authRequest<Types.Applications.RESTApplication>({
            method: "PATCH",
            path:   Routes.APPLICATION,
            json:   {
                cover_image:                       coverImage,
                custom_install_url:                options.customInstallURL,
                description:                       options.description,
                event_webhooks_status:             options.eventWebhooksStatus,
                event_webhooks_types:              options.eventWebhooksTypes,
                event_webhooks_url:                options.eventWebhooksURL,
                flags:                             options.flags,
                icon,
                install_params:                    options.installParams,
                integration_types_config:          options.integrationTypesConfig,
                interactions_endpoint_url:         options.interactionsEndpointURL,
                role_connections_verification_url: options.roleConnectionsVerificationURL,
                tags:                              options.tags
            }
        }).then(data => new Application(data, this._manager.client));
    }

    /**
     * Edit an existing emoji for an application.
     * @param applicationID The ID of the application.
     * @param emojiID The ID of the emoji to be edited.
     * @param options The options for editing the emoji.
     * @caching This method **does not** cache its result.
     */
    async editEmoji(applicationID: string, emojiID: string, options: Types.Applications.EditApplicationEmojiOptions): Promise<Types.Applications.ApplicationEmoji> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.Applications.RawApplicationEmoji>({
            method: "PATCH",
            path:   Routes.APPLICATION_EMOJI(applicationID, emojiID),
            json:   { name: options.name }
        }).then(emoji => this._manager.client.util.convertApplicationEmoji(emoji));
    }

    /**
     * Edit a global application command.
     * @param applicationID The ID of the application.
     * @param commandID The ID of the command to edit.
     * @param options The options for editing the command.
     * @caching This method **does not** cache its result.
     */
    async editGlobalCommand<T extends Types.Applications.EditApplicationCommandOptions = Types.Applications.EditApplicationCommandOptions>(applicationID: string, commandID: string, options: T): Promise<Types.Applications.ApplicationCommandOptionConversion<T>> {
        const opt = this._manager.client.util._freeze(options) as Types.Applications.EditChatInputApplicationCommandOptions;
        return this._manager.authRequest<Types.Applications.RawApplicationCommand>({
            method: "PATCH",
            path:   Routes.APPLICATION_COMMAND(applicationID, commandID),
            json:   {
                contexts:                   opt.contexts,
                default_member_permissions: opt.defaultMemberPermissions,
                description:                opt.description,
                description_localizations:  opt.descriptionLocalizations,
                dm_permission:              opt.dmPermission,
                integration_types:          opt.integrationTypes,
                name:                       opt.name,
                name_localizations:         opt.nameLocalizations,
                nsfw:                       opt.nsfw,
                options:                    opt.options?.map(o => this._manager.client.util.optionToRaw(o))
            }
        }).then(data => new ApplicationCommand(data, this._manager.client) as never);
    }

    /**
     * Edit a guild application command.
     * @param applicationID The ID of the application.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command to edit.
     * @param options The options for editing the command.
     * @caching This method **does not** cache its result.
     */
    async editGuildCommand<T extends Types.Applications.EditGuildApplicationCommandOptions = Types.Applications.EditGuildApplicationCommandOptions>(applicationID: string, guildID: string, commandID: string, options: T): Promise<Types.Applications.ApplicationCommandOptionConversion<T>> {
        const opt = this._manager.client.util._freeze(options) as Types.Applications.EditChatInputApplicationCommandOptions;
        return this._manager.authRequest<Types.Applications.RawApplicationCommand>({
            method: "PATCH",
            path:   Routes.GUILD_APPLICATION_COMMAND(applicationID, guildID, commandID),
            json:   {
                default_member_permissions: opt.defaultMemberPermissions,
                description:                opt.description,
                description_localizations:  opt.descriptionLocalizations,
                dm_permission:              opt.dmPermission,
                name:                       opt.name,
                name_localizations:         opt.nameLocalizations,
                nsfw:                       opt.nsfw,
                options:                    opt.options?.map(o => this._manager.client.util.optionToRaw(o))
            }
        }).then(data => new ApplicationCommand(data, this._manager.client) as never);
    }

    /**
     * Edit a guild application command's permissions. This requires a bearer token with the `applications.commands.permissions.update` scope.
     * @param applicationID The ID of the application.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     * @param options The options for editing the permissions.
     * @caching This method **does not** cache its result.
     */
    async editGuildCommandPermissions(applicationID: string, guildID: string, commandID: string, options: Types.Applications.EditApplicationCommandPermissionsOptions): Promise<Types.Applications.RESTGuildApplicationCommandPermissions> {
        options = this._manager.client.util._freeze(options);
        return (options.accessToken ? this._manager.request.bind(this._manager) : this._manager.authRequest.bind(this._manager))({
            method: "PATCH",
            path:   Routes.GUILD_APPLICATION_COMMAND_PERMISSION(applicationID, guildID, commandID),
            json:   { permissions: options.permissions },
            auth:   options.accessToken
        } as Omit<Types.RequestHandler.RequestOptions, "auth">).then(data => {
            const d = data as Types.Applications.RawGuildApplicationCommandPermissions;
            return {
                applicationID: d.application_id,
                guildID:       d.guild_id,
                id:            d.id,
                permissions:   d.permissions
            };
        });
    }

    /**
     * Get an activity instance.
     * @param applicationID The ID of the application.
     * @param instanceID The ID of the instance.
     */
    async getActivityInstance(applicationID: string, instanceID: string): Promise<Types.Applications.ActivityInstance> {
        return this._manager.authRequest<Types.Applications.RawActivityInstance>({
            method: "GET",
            path:   Routes.APPLICATION_ACTIVITY_INSTANCE(applicationID, instanceID)
        }).then(data => ({
            applicationID: data.application_id,
            instanceID:    data.instance_id,
            launchID:      data.launch_id,
            location:      {
                channelID: data.location.channel_id,
                guildID:   data.location.guild_id,
                id:        data.location.id,
                kind:      data.location.kind
            },
            users: data.users
        }));
    }

    /**
     * Get the currently authenticated bot's application info as a bare {@link ClientApplication | ClientApplication}.
     * @caching This method **does not** cache its result.
     */
    async getClient(): Promise<ClientApplication> {
        return this._manager.authRequest<Types.Applications.RawClientApplication>({
            method: "GET",
            path:   Routes.APPLICATION
        }).then(data => new ClientApplication(data, this._manager.client));
    }

    /**
     * Get the currently authenticated bot's application info.
     * @caching This method **does not** cache its result.
     */
    async getCurrent(): Promise<Application> {
        return this._manager.authRequest<Types.Applications.RESTApplication>({
            method: "GET",
            path:   Routes.APPLICATION
        }).then(data => new Application(data, this._manager.client));
    }

    /**
     * Get an emoji for an application.
     * @param applicationID The ID of the application to get the emojis of.
     * @param emojiID The ID of the emoji to get.
     * @caching This method **does not** cache its result.
     */
    async getEmoji(applicationID: string, emojiID: string): Promise<Types.Applications.ApplicationEmoji> {
        return this._manager.authRequest<Types.Applications.RawApplicationEmoji>({
            method: "GET",
            path:   Routes.APPLICATION_EMOJI(applicationID, emojiID)
        }).then(emoji => this._manager.client.util.convertApplicationEmoji(emoji));
    }

    /**
     * Get the emojis for an application.
     * @param applicationID The ID of the application to get the emojis of.
     * @caching This method **does not** cache its result.
     */
    async getEmojis(applicationID: string): Promise<Types.Applications.ApplicationEmojis> {
        return this._manager.authRequest<Types.Applications.RawApplicationEmojis>({
            method: "GET",
            path:   Routes.APPLICATION_EMOJIS(applicationID)
        }).then(({ items }) => ({
            items: items.map(item => this._manager.client.util.convertApplicationEmoji(item))
        }));
    }

    /**
     * Get the entitlements for an application.
     * @param applicationID The ID of the application to get the entitlements of.
     * @param options The options for getting the entitlements.
     */
    async getEntitlements(applicationID: string, options: Types.Applications.SearchEntitlementsOptions = {}): Promise<Array<Entitlement | TestEntitlement>> {
        options = this._manager.client.util._freeze(options);
        const query = new QueryBuilder();
        query.setIfPresent("after", options.after);
        query.setIfPresent("before", options.before);
        query.setIfPresent("exclude_deleted", options.excludeDeleted);
        query.setIfPresent("exclude_ended", options.excludeEnded);
        query.setIfPresent("guild_id", options.guildID);
        query.setIfPresent("limit", options.limit);
        query.setIfPresent("sku_ids", options.skuIDs?.join(","));
        query.setIfPresent("user_id", options.userID);
        return this._manager.authRequest<Array<Types.Applications.RawEntitlement | Types.Applications.RawTestEntitlement>>({
            method: "GET",
            path:   Routes.ENTITLEMENTS(applicationID),
            query
        }).then(data => data.map(d => "subscription_id" in d && d.subscription_id ? new Entitlement(d, this._manager.client) : new TestEntitlement(d, this._manager.client)));
    }

    /**
     * Get a global application command.
     * @param applicationID The ID of the application.
     * @param commandID The ID of the command.
     * @param options The options for getting the command.
     * @caching This method **does not** cache its result.
     */
    async getGlobalCommand<T extends Types.Applications.AnyApplicationCommand = Types.Applications.AnyApplicationCommand>(applicationID: string, commandID: string, options?: Types.Applications.GetApplicationCommandOptions): Promise<T> {
        options = this._manager.client.util._freeze(options);
        const query = new QueryBuilder();
        query.setIfPresent("with_localizations", options?.withLocalizations);
        return this._manager.authRequest<Types.Applications.RawApplicationCommand>({
            method:  "GET",
            path:    Routes.APPLICATION_COMMAND(applicationID, commandID),
            query,
            headers: options?.locale === undefined ? undefined : { "X-Discord-Locale": options.locale }
        }).then(data => new ApplicationCommand(data, this._manager.client) as never);
    }

    /**
     * Get an application's global commands.
     * @param applicationID The ID of the application.
     * @param options The options for getting the command.
     * @caching This method **does not** cache its result.
     */
    async getGlobalCommands(applicationID: string, options?: Types.Applications.GetApplicationCommandOptions): Promise<Array<Types.Applications.AnyApplicationCommand>> {
        options = this._manager.client.util._freeze(options);
        const query = new QueryBuilder();
        query.setIfPresent("with_localizations", options?.withLocalizations);
        return this._manager.authRequest<Array<Types.Applications.RawApplicationCommand>>({
            method:  "GET",
            path:    Routes.APPLICATION_COMMANDS(applicationID),
            query,
            headers: options?.locale === undefined ? undefined : { "X-Discord-Locale": options.locale }
        }).then(data => data.map(d => new ApplicationCommand(d, this._manager.client)) as never);
    }

    /**
     * Get a global application command.
     * @param applicationID The ID of the application.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     * @param options The options for getting the command.
     * @caching This method **does not** cache its result.
     */
    async getGuildCommand<T extends Types.Applications.AnyApplicationCommand = Types.Applications.AnyApplicationCommand>(applicationID: string, guildID: string, commandID: string, options?: Types.Applications.GetApplicationCommandOptions): Promise<T> {
        options = this._manager.client.util._freeze(options);
        const query = new QueryBuilder();
        query.setIfPresent("with_localizations", options?.withLocalizations);
        return this._manager.authRequest<Types.Applications.RawApplicationCommand>({
            method:  "GET",
            path:    Routes.GUILD_APPLICATION_COMMAND(applicationID, commandID, guildID),
            query,
            headers: options?.locale === undefined ? undefined : { "X-Discord-Locale": options.locale }
        }).then(data => new ApplicationCommand(data, this._manager.client) as never);
    }

    /**
     * Get an application's application commands in a specific guild.
     * @param applicationID The ID of the application.
     * @param guildID The ID of the guild.
     * @param options The options for getting the command.
     * @caching This method **does not** cache its result.
     */
    async getGuildCommands(applicationID: string, guildID: string, options?: Types.Applications.GetApplicationCommandOptions): Promise<Array<Types.Applications.AnyApplicationCommand>> {
        options = this._manager.client.util._freeze(options);
        const query = new QueryBuilder();
        query.setIfPresent("with_localizations", options?.withLocalizations);
        return this._manager.authRequest<Array<Types.Applications.RawApplicationCommand>>({
            method:  "GET",
            path:    Routes.GUILD_APPLICATION_COMMANDS(applicationID, guildID),
            query,
            headers: options?.locale === undefined ? undefined : { "X-Discord-Locale": options.locale }
        }).then(data => data.map(d => new ApplicationCommand(d, this._manager.client)) as never);
    }

    /**
     * Get an application command's permissions in a guild.
     * @param applicationID The ID of the application.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     * @caching This method **does not** cache its result.
     */
    async getGuildPermission(applicationID: string, guildID: string, commandID: string): Promise<Types.Applications.RESTGuildApplicationCommandPermissions> {
        return this._manager.authRequest<Types.Applications.RawGuildApplicationCommandPermissions>({
            method: "GET",
            path:   Routes.GUILD_APPLICATION_COMMAND_PERMISSION(applicationID, guildID, commandID)
        }).then(data => ({
            applicationID: data.application_id,
            guildID:       data.guild_id,
            id:            data.id,
            permissions:   data.permissions
        }));
    }

    /**
     * Get the permissions for all application commands in a guild.
     * @param applicationID The ID of the application.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getGuildPermissions(applicationID: string, guildID: string): Promise<Array<Types.Applications.RESTGuildApplicationCommandPermissions>> {
        return this._manager.authRequest<Array<Types.Applications.RawGuildApplicationCommandPermissions>>({
            method: "GET",
            path:   Routes.GUILD_APPLICATION_COMMAND_PERMISSIONS(applicationID, guildID)
        }).then(data => data.map(d => ({
            applicationID: d.application_id,
            guildID:       d.guild_id,
            id:            d.id,
            permissions:   d.permissions
        })));
    }

    /**
     * Get the subscription for an SKU.
     * @param skuID The ID of the SKU to get the subscription of.
     * @param subscriptionID The ID of the subscription to get.
     */
    async getSKUSubscription(skuID: string, subscriptionID: string): Promise<Subscription> {
        return this._manager.authRequest<Types.Applications.RawSubscription>({
            method: "GET",
            path:   Routes.SKU_SUBSCRIPTION(skuID, subscriptionID)
        }).then(data => new Subscription(data, this._manager.client));
    }

    /**
     * Get the subscriptions for an SKU.
     * @param skuID The ID of the SKU to get the subscriptions of.
     * @param options The options for getting the subscriptions.
     */
    async getSKUSubscriptions(skuID: string, options: Types.Applications.SearchSKUSubscriptions): Promise<Array<Subscription>> {
        options = this._manager.client.util._freeze(options);
        const query = new QueryBuilder();
        query.setIfPresent("after", options.after);
        query.setIfPresent("before", options.before);
        query.setIfPresent("limit", options.limit);
        query.setIfPresent("user_id", options.userID);
        return this._manager.authRequest<Array<Types.Applications.RawSubscription>>({
            method: "GET",
            path:   Routes.SKU_SUBSCRIPTIONS(skuID),
            query
        }).then(data => data.map(d => new Subscription(d, this._manager.client)));
    }

    /**
     * Get the SKUs for an application.
     * @param applicationID The ID of the application to get the SKUs of.
     */
    async getSKUs(applicationID: string): Promise<Array<SKU>> {
        return this._manager.authRequest<Array<Types.Applications.RawSKU>>({
            method: "GET",
            path:   Routes.SKUS(applicationID)
        }).then(data => data.map(d => new SKU(d, this._manager.client)));
    }
}
