import { AuthMockApi } from 'app/mock-api/common/auth/api';
import { ContactsMockApi } from 'app/mock-api/apps/contacts/api';
import { IconsMockApi } from 'app/mock-api/ui/icons/api';
import { MessagesMockApi } from 'app/mock-api/common/messages/api';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { NotificationsMockApi } from 'app/mock-api/common/notifications/api';
import { ShortcutsMockApi } from 'app/mock-api/common/shortcuts/api';
import { UserMockApi } from 'app/mock-api/common/user/api';

export const mockApiServices = [
  AuthMockApi,
  ContactsMockApi,
  IconsMockApi,
  MessagesMockApi,
  NavigationMockApi,
  NotificationsMockApi,
  ShortcutsMockApi,
  UserMockApi
];
