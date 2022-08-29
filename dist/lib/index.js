"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageChannel = exports.ShardManager = exports.Shard = exports.SequentialBucket = exports.Routes = exports.Role = exports.RESTManager = exports.PublicThreadChannel = exports.PrivateThreadChannel = exports.PrivateChannel = exports.PingInteraction = exports.PermissionOverwrite = exports.Permission = exports.PartialApplication = exports.ModalSubmitInteraction = exports.Message = exports.Member = exports.Invite = exports.InteractionOptionsWrapper = exports.Integration = exports.GuildTemplate = exports.GuildScheduledEvent = exports.GuildPreview = exports.GuildChannel = exports.Guild = exports.GroupChannel = exports.GatewayError = exports.ExtendedUser = exports.DiscordRESTError = exports.DiscordHTTPError = exports.ComponentInteraction = exports.Collection = exports.TypedCollection = exports.CommandInteraction = exports.Constants = exports.ClientApplication = exports.Client = exports.CategoryChannel = exports.Bucket = exports.Base = exports.AutoModerationRule = exports.AutocompleteInteraction = exports.AuditLogEntry = exports.Attachment = exports.ApplicationCommand = exports.Application = exports.AnnouncementThreadChannel = exports.AnnouncementChannel = exports.Interaction = exports.Channel = void 0;
exports.Webhook = exports.VoiceState = exports.VoiceChannel = exports.Util = exports.User = exports.UnavailableGuild = exports.TypedEmitter = exports.ThreadChannel = exports.TextChannel = exports.TextableChannel = exports.Team = exports.StageInstance = void 0;
// Channel and Interaction MUST be at the top due to circular imports
var Channel_1 = require("./structures/Channel");
Object.defineProperty(exports, "Channel", { enumerable: true, get: function () { return __importDefault(Channel_1).default; } });
var Interaction_1 = require("./structures/Interaction");
Object.defineProperty(exports, "Interaction", { enumerable: true, get: function () { return __importDefault(Interaction_1).default; } });
var AnnouncementChannel_1 = require("./structures/AnnouncementChannel");
Object.defineProperty(exports, "AnnouncementChannel", { enumerable: true, get: function () { return __importDefault(AnnouncementChannel_1).default; } });
var AnnouncementThreadChannel_1 = require("./structures/AnnouncementThreadChannel");
Object.defineProperty(exports, "AnnouncementThreadChannel", { enumerable: true, get: function () { return __importDefault(AnnouncementThreadChannel_1).default; } });
var Application_1 = require("./structures/Application");
Object.defineProperty(exports, "Application", { enumerable: true, get: function () { return __importDefault(Application_1).default; } });
var ApplicationCommand_1 = require("./structures/ApplicationCommand");
Object.defineProperty(exports, "ApplicationCommand", { enumerable: true, get: function () { return __importDefault(ApplicationCommand_1).default; } });
var Attachment_1 = require("./structures/Attachment");
Object.defineProperty(exports, "Attachment", { enumerable: true, get: function () { return __importDefault(Attachment_1).default; } });
var AuditLogEntry_1 = require("./structures/AuditLogEntry");
Object.defineProperty(exports, "AuditLogEntry", { enumerable: true, get: function () { return __importDefault(AuditLogEntry_1).default; } });
var AutocompleteInteraction_1 = require("./structures/AutocompleteInteraction");
Object.defineProperty(exports, "AutocompleteInteraction", { enumerable: true, get: function () { return __importDefault(AutocompleteInteraction_1).default; } });
var AutoModerationRule_1 = require("./structures/AutoModerationRule");
Object.defineProperty(exports, "AutoModerationRule", { enumerable: true, get: function () { return __importDefault(AutoModerationRule_1).default; } });
var Base_1 = require("./structures/Base");
Object.defineProperty(exports, "Base", { enumerable: true, get: function () { return __importDefault(Base_1).default; } });
var Bucket_1 = require("./rest/Bucket");
Object.defineProperty(exports, "Bucket", { enumerable: true, get: function () { return __importDefault(Bucket_1).default; } });
var CategoryChannel_1 = require("./structures/CategoryChannel");
Object.defineProperty(exports, "CategoryChannel", { enumerable: true, get: function () { return __importDefault(CategoryChannel_1).default; } });
var Client_1 = require("./Client");
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return __importDefault(Client_1).default; } });
var ClientApplication_1 = require("./structures/ClientApplication");
Object.defineProperty(exports, "ClientApplication", { enumerable: true, get: function () { return __importDefault(ClientApplication_1).default; } });
__exportStar(require("./Constants"), exports);
exports.Constants = __importStar(require("./Constants"));
var CommandInteraction_1 = require("./structures/CommandInteraction");
Object.defineProperty(exports, "CommandInteraction", { enumerable: true, get: function () { return __importDefault(CommandInteraction_1).default; } });
var Collection_1 = require("./util/Collection");
Object.defineProperty(exports, "TypedCollection", { enumerable: true, get: function () { return __importDefault(Collection_1).default; } });
var collections_1 = require("@augu/collections");
Object.defineProperty(exports, "Collection", { enumerable: true, get: function () { return collections_1.Collection; } });
var ComponentInteraction_1 = require("./structures/ComponentInteraction");
Object.defineProperty(exports, "ComponentInteraction", { enumerable: true, get: function () { return __importDefault(ComponentInteraction_1).default; } });
var DiscordHTTPError_1 = require("./rest/DiscordHTTPError");
Object.defineProperty(exports, "DiscordHTTPError", { enumerable: true, get: function () { return __importDefault(DiscordHTTPError_1).default; } });
var DiscordRESTError_1 = require("./rest/DiscordRESTError");
Object.defineProperty(exports, "DiscordRESTError", { enumerable: true, get: function () { return __importDefault(DiscordRESTError_1).default; } });
var ExtendedUser_1 = require("./structures/ExtendedUser");
Object.defineProperty(exports, "ExtendedUser", { enumerable: true, get: function () { return __importDefault(ExtendedUser_1).default; } });
var GatewayError_1 = require("./gateway/GatewayError");
Object.defineProperty(exports, "GatewayError", { enumerable: true, get: function () { return __importDefault(GatewayError_1).default; } });
var GroupChannel_1 = require("./structures/GroupChannel");
Object.defineProperty(exports, "GroupChannel", { enumerable: true, get: function () { return __importDefault(GroupChannel_1).default; } });
var Guild_1 = require("./structures/Guild");
Object.defineProperty(exports, "Guild", { enumerable: true, get: function () { return __importDefault(Guild_1).default; } });
var GuildChannel_1 = require("./structures/GuildChannel");
Object.defineProperty(exports, "GuildChannel", { enumerable: true, get: function () { return __importDefault(GuildChannel_1).default; } });
var GuildPreview_1 = require("./structures/GuildPreview");
Object.defineProperty(exports, "GuildPreview", { enumerable: true, get: function () { return __importDefault(GuildPreview_1).default; } });
var GuildScheduledEvent_1 = require("./structures/GuildScheduledEvent");
Object.defineProperty(exports, "GuildScheduledEvent", { enumerable: true, get: function () { return __importDefault(GuildScheduledEvent_1).default; } });
var GuildTemplate_1 = require("./structures/GuildTemplate");
Object.defineProperty(exports, "GuildTemplate", { enumerable: true, get: function () { return __importDefault(GuildTemplate_1).default; } });
var Integration_1 = require("./structures/Integration");
Object.defineProperty(exports, "Integration", { enumerable: true, get: function () { return __importDefault(Integration_1).default; } });
var InteractionOptionsWrapper_1 = require("./util/InteractionOptionsWrapper");
Object.defineProperty(exports, "InteractionOptionsWrapper", { enumerable: true, get: function () { return __importDefault(InteractionOptionsWrapper_1).default; } });
var Invite_1 = require("./structures/Invite");
Object.defineProperty(exports, "Invite", { enumerable: true, get: function () { return __importDefault(Invite_1).default; } });
var Member_1 = require("./structures/Member");
Object.defineProperty(exports, "Member", { enumerable: true, get: function () { return __importDefault(Member_1).default; } });
var Message_1 = require("./structures/Message");
Object.defineProperty(exports, "Message", { enumerable: true, get: function () { return __importDefault(Message_1).default; } });
var ModalSubmitInteraction_1 = require("./structures/ModalSubmitInteraction");
Object.defineProperty(exports, "ModalSubmitInteraction", { enumerable: true, get: function () { return __importDefault(ModalSubmitInteraction_1).default; } });
var PartialApplication_1 = require("./structures/PartialApplication");
Object.defineProperty(exports, "PartialApplication", { enumerable: true, get: function () { return __importDefault(PartialApplication_1).default; } });
var Permission_1 = require("./structures/Permission");
Object.defineProperty(exports, "Permission", { enumerable: true, get: function () { return __importDefault(Permission_1).default; } });
var PermissionOverwrite_1 = require("./structures/PermissionOverwrite");
Object.defineProperty(exports, "PermissionOverwrite", { enumerable: true, get: function () { return __importDefault(PermissionOverwrite_1).default; } });
var PingInteraction_1 = require("./structures/PingInteraction");
Object.defineProperty(exports, "PingInteraction", { enumerable: true, get: function () { return __importDefault(PingInteraction_1).default; } });
var PrivateChannel_1 = require("./structures/PrivateChannel");
Object.defineProperty(exports, "PrivateChannel", { enumerable: true, get: function () { return __importDefault(PrivateChannel_1).default; } });
var PrivateThreadChannel_1 = require("./structures/PrivateThreadChannel");
Object.defineProperty(exports, "PrivateThreadChannel", { enumerable: true, get: function () { return __importDefault(PrivateThreadChannel_1).default; } });
var PublicThreadChannel_1 = require("./structures/PublicThreadChannel");
Object.defineProperty(exports, "PublicThreadChannel", { enumerable: true, get: function () { return __importDefault(PublicThreadChannel_1).default; } });
var RESTManager_1 = require("./rest/RESTManager");
Object.defineProperty(exports, "RESTManager", { enumerable: true, get: function () { return __importDefault(RESTManager_1).default; } });
var Role_1 = require("./structures/Role");
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return __importDefault(Role_1).default; } });
exports.Routes = __importStar(require("./util/Routes"));
var SequentialBucket_1 = require("./rest/SequentialBucket");
Object.defineProperty(exports, "SequentialBucket", { enumerable: true, get: function () { return __importDefault(SequentialBucket_1).default; } });
var Shard_1 = require("./gateway/Shard");
Object.defineProperty(exports, "Shard", { enumerable: true, get: function () { return __importDefault(Shard_1).default; } });
var ShardManager_1 = require("./gateway/ShardManager");
Object.defineProperty(exports, "ShardManager", { enumerable: true, get: function () { return __importDefault(ShardManager_1).default; } });
var StageChannel_1 = require("./structures/StageChannel");
Object.defineProperty(exports, "StageChannel", { enumerable: true, get: function () { return __importDefault(StageChannel_1).default; } });
var StageInstance_1 = require("./structures/StageInstance");
Object.defineProperty(exports, "StageInstance", { enumerable: true, get: function () { return __importDefault(StageInstance_1).default; } });
var Team_1 = require("./structures/Team");
Object.defineProperty(exports, "Team", { enumerable: true, get: function () { return __importDefault(Team_1).default; } });
var TextableChannel_1 = require("./structures/TextableChannel");
Object.defineProperty(exports, "TextableChannel", { enumerable: true, get: function () { return __importDefault(TextableChannel_1).default; } });
var TextChannel_1 = require("./structures/TextChannel");
Object.defineProperty(exports, "TextChannel", { enumerable: true, get: function () { return __importDefault(TextChannel_1).default; } });
var ThreadChannel_1 = require("./structures/ThreadChannel");
Object.defineProperty(exports, "ThreadChannel", { enumerable: true, get: function () { return __importDefault(ThreadChannel_1).default; } });
var TypedEmitter_1 = require("./util/TypedEmitter");
Object.defineProperty(exports, "TypedEmitter", { enumerable: true, get: function () { return __importDefault(TypedEmitter_1).default; } });
var UnavailableGuild_1 = require("./structures/UnavailableGuild");
Object.defineProperty(exports, "UnavailableGuild", { enumerable: true, get: function () { return __importDefault(UnavailableGuild_1).default; } });
var User_1 = require("./structures/User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return __importDefault(User_1).default; } });
var Util_1 = require("./util/Util");
Object.defineProperty(exports, "Util", { enumerable: true, get: function () { return __importDefault(Util_1).default; } });
var VoiceChannel_1 = require("./structures/VoiceChannel");
Object.defineProperty(exports, "VoiceChannel", { enumerable: true, get: function () { return __importDefault(VoiceChannel_1).default; } });
var VoiceState_1 = require("./structures/VoiceState");
Object.defineProperty(exports, "VoiceState", { enumerable: true, get: function () { return __importDefault(VoiceState_1).default; } });
var Webhook_1 = require("./structures/Webhook");
Object.defineProperty(exports, "Webhook", { enumerable: true, get: function () { return __importDefault(Webhook_1).default; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQThCO0FBQzlCLHFFQUFxRTtBQUNyRSxnREFBMEQ7QUFBakQsbUhBQUEsT0FBTyxPQUFXO0FBQzNCLHdEQUFrRTtBQUF6RCwySEFBQSxPQUFPLE9BQWU7QUFDL0Isd0VBQWtGO0FBQXpFLDJJQUFBLE9BQU8sT0FBdUI7QUFDdkMsb0ZBQThGO0FBQXJGLHVKQUFBLE9BQU8sT0FBNkI7QUFDN0Msd0RBQWtFO0FBQXpELDJIQUFBLE9BQU8sT0FBZTtBQUMvQixzRUFBZ0Y7QUFBdkUseUlBQUEsT0FBTyxPQUFzQjtBQUN0QyxzREFBZ0U7QUFBdkQseUhBQUEsT0FBTyxPQUFjO0FBQzlCLDREQUFzRTtBQUE3RCwrSEFBQSxPQUFPLE9BQWlCO0FBQ2pDLGdGQUEwRjtBQUFqRixtSkFBQSxPQUFPLE9BQTJCO0FBQzNDLHNFQUFnRjtBQUF2RSx5SUFBQSxPQUFPLE9BQXNCO0FBQ3RDLDBDQUFvRDtBQUEzQyw2R0FBQSxPQUFPLE9BQVE7QUFDeEIsd0NBQWtEO0FBQXpDLGlIQUFBLE9BQU8sT0FBVTtBQUMxQixnRUFBMEU7QUFBakUsbUlBQUEsT0FBTyxPQUFtQjtBQUNuQyxtQ0FBNkM7QUFBcEMsaUhBQUEsT0FBTyxPQUFVO0FBQzFCLG9FQUE4RTtBQUFyRSx1SUFBQSxPQUFPLE9BQXFCO0FBQ3JDLDhDQUE0QjtBQUM1Qix5REFBeUM7QUFDekMsc0VBQWdGO0FBQXZFLHlJQUFBLE9BQU8sT0FBc0I7QUFDdEMsZ0RBQStEO0FBQXRELDhIQUFBLE9BQU8sT0FBbUI7QUFDbkMsaURBQStDO0FBQXRDLHlHQUFBLFVBQVUsT0FBQTtBQUNuQiwwRUFBb0Y7QUFBM0UsNklBQUEsT0FBTyxPQUF3QjtBQUN4Qyw0REFBc0U7QUFBN0QscUlBQUEsT0FBTyxPQUFvQjtBQUNwQyw0REFBc0U7QUFBN0QscUlBQUEsT0FBTyxPQUFvQjtBQUNwQywwREFBb0U7QUFBM0QsNkhBQUEsT0FBTyxPQUFnQjtBQUNoQyx1REFBaUU7QUFBeEQsNkhBQUEsT0FBTyxPQUFnQjtBQUNoQywwREFBb0U7QUFBM0QsNkhBQUEsT0FBTyxPQUFnQjtBQUNoQyw0Q0FBc0Q7QUFBN0MsK0dBQUEsT0FBTyxPQUFTO0FBQ3pCLDBEQUFvRTtBQUEzRCw2SEFBQSxPQUFPLE9BQWdCO0FBQ2hDLDBEQUFvRTtBQUEzRCw2SEFBQSxPQUFPLE9BQWdCO0FBQ2hDLHdFQUFrRjtBQUF6RSwySUFBQSxPQUFPLE9BQXVCO0FBQ3ZDLDREQUFzRTtBQUE3RCwrSEFBQSxPQUFPLE9BQWlCO0FBQ2pDLHdEQUFrRTtBQUF6RCwySEFBQSxPQUFPLE9BQWU7QUFDL0IsOEVBQXdGO0FBQS9FLHVKQUFBLE9BQU8sT0FBNkI7QUFDN0MsOENBQXdEO0FBQS9DLGlIQUFBLE9BQU8sT0FBVTtBQUMxQiw4Q0FBd0Q7QUFBL0MsaUhBQUEsT0FBTyxPQUFVO0FBQzFCLGdEQUEwRDtBQUFqRCxtSEFBQSxPQUFPLE9BQVc7QUFDM0IsOEVBQXdGO0FBQS9FLGlKQUFBLE9BQU8sT0FBMEI7QUFDMUMsc0VBQWdGO0FBQXZFLHlJQUFBLE9BQU8sT0FBc0I7QUFDdEMsc0RBQWdFO0FBQXZELHlIQUFBLE9BQU8sT0FBYztBQUM5Qix3RUFBa0Y7QUFBekUsMklBQUEsT0FBTyxPQUF1QjtBQUN2QyxnRUFBMEU7QUFBakUsbUlBQUEsT0FBTyxPQUFtQjtBQUNuQyw4REFBd0U7QUFBL0QsaUlBQUEsT0FBTyxPQUFrQjtBQUNsQywwRUFBb0Y7QUFBM0UsNklBQUEsT0FBTyxPQUF3QjtBQUN4Qyx3RUFBa0Y7QUFBekUsMklBQUEsT0FBTyxPQUF1QjtBQUN2QyxrREFBNEQ7QUFBbkQsMkhBQUEsT0FBTyxPQUFlO0FBQy9CLDBDQUFvRDtBQUEzQyw2R0FBQSxPQUFPLE9BQVE7QUFDeEIsd0RBQXdDO0FBQ3hDLDREQUFzRTtBQUE3RCxxSUFBQSxPQUFPLE9BQW9CO0FBQ3BDLHlDQUFtRDtBQUExQywrR0FBQSxPQUFPLE9BQVM7QUFDekIsdURBQWlFO0FBQXhELDZIQUFBLE9BQU8sT0FBZ0I7QUFDaEMsMERBQW9FO0FBQTNELDZIQUFBLE9BQU8sT0FBZ0I7QUFDaEMsNERBQXNFO0FBQTdELCtIQUFBLE9BQU8sT0FBaUI7QUFDakMsMENBQW9EO0FBQTNDLDZHQUFBLE9BQU8sT0FBUTtBQUN4QixnRUFBMEU7QUFBakUsbUlBQUEsT0FBTyxPQUFtQjtBQUNuQyx3REFBa0U7QUFBekQsMkhBQUEsT0FBTyxPQUFlO0FBQy9CLDREQUFzRTtBQUE3RCwrSEFBQSxPQUFPLE9BQWlCO0FBQ2pDLG9EQUE4RDtBQUFyRCw2SEFBQSxPQUFPLE9BQWdCO0FBQ2hDLGtFQUE0RTtBQUFuRSxxSUFBQSxPQUFPLE9BQW9CO0FBQ3BDLDBDQUFvRDtBQUEzQyw2R0FBQSxPQUFPLE9BQVE7QUFDeEIsb0NBQThDO0FBQXJDLDZHQUFBLE9BQU8sT0FBUTtBQUN4QiwwREFBb0U7QUFBM0QsNkhBQUEsT0FBTyxPQUFnQjtBQUNoQyxzREFBZ0U7QUFBdkQseUhBQUEsT0FBTyxPQUFjO0FBQzlCLGdEQUEwRDtBQUFqRCxtSEFBQSxPQUFPLE9BQVcifQ==