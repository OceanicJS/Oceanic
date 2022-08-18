import Base from "./Base";
import Channel from "./Channel";
import Guild from "./Guild";
import type ScheduledEvent from "./ScheduledEvent";
import type User from "./User";
import { PartialApplication } from "./PartialApplication";
import type CategoryChannel from "./CategoryChannel";
import type {
	AnyGuildChannel,
	AnyThreadChannel,
	InviteChannel,
	InviteStageInstance,
	PartialInviteChannel,
	RawInvite,
	RawInviteWithMetadata
} from "../types/channels";
import type Client from "../Client";
import type { InviteTargetTypes } from "../Constants";
import { ChannelTypes } from "../Constants";
import type { RawGuild, RawMember } from "../types/guilds";

// for the love of god find a way to make this not so shit
export type InviteInfoTypes = "withMetadata" | "withCounts" | "withoutCounts" | "withExpiration" | "withoutExpiration";
/** Represents an invite. */
export default class Invite<T extends InviteInfoTypes = "withMetadata", CH extends InviteChannel = InviteChannel> extends Base {
	private _createdAt?: Date;
	approximateMemberCount?: number;
	approximatePresenceCount?: number;
	channel?: CH | PartialInviteChannel;
	code: string;
	expiresAt?: T extends "withMetadata" | "withoutExpiration" ? never : Date;
	guild?: Guild;
	guildScheduledEvent?: ScheduledEvent;
	inviter?: User;
	maxAge: T extends "withMetadata" ? number : never;
	maxUses: T extends "withMetadata" ? number : never;
	memberCount: T extends "withMetadata" | "withoutCounts" ? never : number;
	presenceCount: T extends "withMetadata" | "withoutCounts" ? never : number;
	/** @deprecated */
	stageInstance?: InviteStageInstance;
	targetApplication?: PartialApplication;
	targetType?: InviteTargetTypes;
	targetUser?: User;
	temporary: T extends "withMetadata" ? boolean : never;
	uses: T extends "withMetadata" ? number : never;
	constructor(data: RawInvite | RawInviteWithMetadata, client: Client) {
		// technical constraint, easier to pretend `code` is an id rather than make id optional
		super(data.code, client);
		this.update(data);
	}

	protected update(data: RawInvite | RawInviteWithMetadata) {
		this.approximateMemberCount = data.approximate_member_count;
		this.approximatePresenceCount = data.approximate_presence_count;
		this.code = data.code;
		this.expiresAt = (!data.expires_at ? undefined : new Date(data.expires_at)) as never;
		this.targetType = data.target_type;

		let guild: Guild | undefined;
		if (data.guild) {
			if (this._client.guilds.has(data.guild.id)) guild = this._client.guilds.update(data.guild as RawGuild);
			else guild = new Guild(data.guild as RawGuild, this._client);

			this.guild = guild;
		}

		let channel: Channel | PartialInviteChannel | undefined;
		if (data.channel) {
			channel = this._client.getChannel<Exclude<AnyGuildChannel, CategoryChannel | AnyThreadChannel>>(data.channel.id);
			if (channel && channel instanceof Channel) channel["update"](data.channel);
			else if (data.channel.type === ChannelTypes.GROUP_DM) channel = data.channel as PartialInviteChannel;
			else channel = Channel.from(data.channel, this._client);
			this.channel = channel as CH;
		}
		if (data.inviter) this.inviter = this._client.users.update(data.inviter);
		if (data.stage_instance) this.stageInstance = {
			members: data.stage_instance.members.map(m => {
				const member = m as RawMember & { id: string; };
				member.id = member.user.id;
				return guild!.members.update(member, guild!.id);
			}),
			participantCount: data.stage_instance.participant_count,
			speakerCount:     data.stage_instance.speaker_count,
			topic:            data.stage_instance.topic
		};
		if (data.target_application) this.targetApplication = new PartialApplication(data.target_application, this._client);
		if (data.guild_scheduled_event) this.guildScheduledEvent = guild!.scheduledEvents.update(data.guild_scheduled_event);
		if (data.target_user) this.targetUser = this._client.users.update(data.target_user);
		if ("created_at" in data) {
			this._createdAt = new Date(data.created_at);
			this.uses = data.uses as never;
			this.maxUses = data.max_uses as never;
			this.maxAge = data.max_age as never;
			this.temporary = data.temporary as never;
		}
	}

	// @ts-expect-error Base has a `createdAt` getter
	override get createdAt(): T extends "withMetadata" ? Date : undefined { return this._createdAt as never; }
}
