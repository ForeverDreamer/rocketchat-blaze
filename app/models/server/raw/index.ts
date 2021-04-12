import SubscriptionsModel from '../models/Subscriptions';
import { SubscriptionsRaw } from './Subscriptions';
import SettingsModel from '../models/Settings';
import { SettingsRaw } from './Settings';
import UsersModel from '../models/Users';
import { UsersRaw } from './Users';
import RoomsModel from '../models/Rooms';
import { RoomsRaw } from './Rooms';
import MessagesModel from '../models/Messages';
import { MessagesRaw } from './Messages';
import RolesModel from '../models/Roles';
import { RolesRaw } from './Roles';
import PermissionsModel from '../models/Permissions';
import { PermissionsRaw } from './Permissions';
import LivechatInquiryModel from '../models/LivechatInquiry';
import { LivechatInquiryRaw } from './LivechatInquiry';
import LivechatDepartmentAgentsModel from '../models/LivechatDepartmentAgents';
import { LivechatDepartmentAgentsRaw } from './LivechatDepartmentAgents';
import UsersSessionsModel from '../models/UsersSessions';
import { UsersSessionsRaw } from './UsersSessions';
import LoginServiceConfigurationModel from '../models/LoginServiceConfiguration';
import { LoginServiceConfigurationRaw } from './LoginServiceConfiguration';
import InstanceStatusModel from '../models/InstanceStatus';
import { InstanceStatusRaw } from './InstanceStatus';
import IntegrationHistoryModel from '../models/IntegrationHistory';
import { IntegrationHistoryRaw } from './IntegrationHistory';
import IntegrationsModel from '../models/Integrations';
import { IntegrationsRaw } from './Integrations';
import EmailInboxModel from '../models/EmailInbox';
import { EmailInboxRaw } from './EmailInbox';

import { trash } from '../models/_BaseDb';
import { api } from '../../../../server/sdk/api';
import { initWatchers } from '../../../../server/modules/watchers/watchers.module';

const trashCollection = trash.rawCollection();

export const Subscriptions = new SubscriptionsRaw(SubscriptionsModel.model.rawCollection(), trashCollection);
export const Settings = new SettingsRaw(SettingsModel.model.rawCollection(), trashCollection);
export const Users = new UsersRaw(UsersModel.model.rawCollection(), trashCollection);
export const Rooms = new RoomsRaw(RoomsModel.model.rawCollection(), trashCollection);
export const Messages = new MessagesRaw(MessagesModel.model.rawCollection(), trashCollection);
export const Roles = new RolesRaw(RolesModel.model.rawCollection(), trashCollection, { Users, Subscriptions });
export const Permissions = new PermissionsRaw(PermissionsModel.model.rawCollection(), trashCollection);
export const LivechatInquiry = new LivechatInquiryRaw(LivechatInquiryModel.model.rawCollection(), trashCollection);
export const LivechatDepartmentAgents = new LivechatDepartmentAgentsRaw(LivechatDepartmentAgentsModel.model.rawCollection(), trashCollection);
export const UsersSessions = new UsersSessionsRaw(UsersSessionsModel.model.rawCollection(), trashCollection);
export const LoginServiceConfiguration = new LoginServiceConfigurationRaw(LoginServiceConfigurationModel.model.rawCollection(), trashCollection);
export const InstanceStatus = new InstanceStatusRaw(InstanceStatusModel.model.rawCollection(), trashCollection);
export const IntegrationHistory = new IntegrationHistoryRaw(IntegrationHistoryModel.model.rawCollection(), trashCollection);
export const Integrations = new IntegrationsRaw(IntegrationsModel.model.rawCollection(), trashCollection);
export const EmailInbox = new EmailInboxRaw(EmailInboxModel.model.rawCollection(), trashCollection);

const map = {
	[Messages.col.collectionName]: MessagesModel,
	[Users.col.collectionName]: UsersModel,
	[Subscriptions.col.collectionName]: SubscriptionsModel,
	[Settings.col.collectionName]: SettingsModel,
	[Roles.col.collectionName]: RolesModel,
	[Permissions.col.collectionName]: PermissionsModel,
	[LivechatInquiry.col.collectionName]: LivechatInquiryModel,
	[LivechatDepartmentAgents.col.collectionName]: LivechatDepartmentAgentsModel,
	[UsersSessions.col.collectionName]: UsersSessionsModel,
	[Rooms.col.collectionName]: RoomsModel,
	[LoginServiceConfiguration.col.collectionName]: LoginServiceConfigurationModel,
	[InstanceStatus.col.collectionName]: InstanceStatusModel,
	[IntegrationHistory.col.collectionName]: IntegrationHistoryModel,
	[Integrations.col.collectionName]: IntegrationsModel,
	[EmailInbox.col.collectionName]: EmailInboxModel,
};

if (!process.env.DISABLE_DB_WATCH) {
	const models = {
		Messages,
		Users,
		Subscriptions,
		Settings,
		LivechatInquiry,
		LivechatDepartmentAgents,
		UsersSessions,
		Permissions,
		Roles,
		Rooms,
		LoginServiceConfiguration,
		InstanceStatus,
		IntegrationHistory,
		Integrations,
		EmailInbox,
	};

	initWatchers(models, api.broadcastLocal.bind(api), (model, fn) => {
		const meteorModel = map[model.col.collectionName];
		if (!meteorModel) {
			return;
		}

		meteorModel.on('change', fn);
	});
}
