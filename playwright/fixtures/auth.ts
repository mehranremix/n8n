// fixtures/auth.fixture.ts
import { test as base, expect } from '@playwright/test';

import type { UserCredentials } from '../config/test-users';
import {
	INSTANCE_OWNER_CREDENTIALS,
	INSTANCE_ADMIN_CREDENTIALS,
	INSTANCE_MEMBER_CREDENTIALS,
} from '../config/test-users';
import { n8nPage } from '../pages/n8nPage';
import type { LoginResponseData } from '../services/e2e-setup.service';
import { ApiHelpers } from '../services/e2e-setup.service';

const AUTH_TAGS = {
	ADMIN: '@auth:admin',
	OWNER: '@auth:owner',
	MEMBER: '@auth:member',
	NONE: '@auth:none',
} as const;

type AuthHelpers = {
	signinAsOwner: () => Promise<LoginResponseData>;
	signinAsAdmin: () => Promise<LoginResponseData>;
	signinAsMember: (index?: number) => Promise<LoginResponseData>;
};

type MyFixtures = {
	auth: AuthHelpers;
	api: ApiHelpers;
	databaseSetup;
	n8n: n8nPage;
};

function getCredentialsForRole(role: string): UserCredentials {
	switch (role) {
		case 'admin':
			return INSTANCE_ADMIN_CREDENTIALS;
		case 'owner':
			return INSTANCE_OWNER_CREDENTIALS;
		case 'member':
			return INSTANCE_MEMBER_CREDENTIALS?.[0];
		default:
			throw new ApplicationError();
	}
}

function getRoleFromTags(tags: string[]): string | null {
	const lowerTags = tags.map((tag) => tag.toLowerCase());

	if (lowerTags.includes(AUTH_TAGS.ADMIN.toLowerCase())) return 'admin';
	if (lowerTags.includes(AUTH_TAGS.OWNER.toLowerCase())) return 'owner';
	if (lowerTags.includes(AUTH_TAGS.MEMBER.toLowerCase())) return 'member';
	if (lowerTags.includes(AUTH_TAGS.NONE.toLowerCase())) return null;
	return 'owner';
}

const NEEDS_DB_RESET_TAG = '@db:reset';

export const test = base.extend<MyFixtures>({
	api: async ({ context }, use) => {
		const apiHelpers = new ApiHelpers(context.request);
		await use(apiHelpers);
	},
	n8n: async ({ page }, use) => {
		const n8n = new n8nPage(page);
		await use(n8n);
	},
	databaseSetup: [
		async ({ context }, use, testInfo) => {
			const tags = testInfo.tags.map((tag) => tag.toLowerCase());
			const apiHelpers = new ApiHelpers(context.request);

			if (tags.includes(NEEDS_DB_RESET_TAG)) {
				console.log(`Test "${testInfo.title}" requires DB reset. Resetting...`);
				await apiHelpers.resetDatabase();
			}
			await use();
		},
		{ auto: true, scope: 'test' },
	],
	auth: [
		async ({ context }, use, testInfo) => {
			const apiHelpers = new ApiHelpers(context.request);

			const role = getRoleFromTags(testInfo.tags);
			if (role) {
				const credentials = getCredentialsForRole(role);
				await apiHelpers.loginAndSetCookies(credentials);
			}

			const authHelpers: AuthHelpers = {
				signinAsOwner: async () => await apiHelpers.loginAndSetCookies(INSTANCE_OWNER_CREDENTIALS),
				signinAsAdmin: async () => await apiHelpers.loginAndSetCookies(INSTANCE_ADMIN_CREDENTIALS),
				signinAsMember: async (index = 0) => {
					if (!INSTANCE_MEMBER_CREDENTIALS || index >= INSTANCE_MEMBER_CREDENTIALS.length) {
						throw new ApplicationError();
					}
					return await apiHelpers.loginAndSetCookies(INSTANCE_MEMBER_CREDENTIALS[index]);
				},
			};
			await use(authHelpers);
		},
		{ auto: true, scope: 'test' },
	],
});

export { expect };
