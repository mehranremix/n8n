import { Container } from '@n8n/di';
import { OIDC_CLIENT_SECRET_REDACTED_VALUE } from '../../../src/sso.ee/oidc/constants';
import { OidcService } from '../../../src/sso.ee/oidc/oidc.service.ee';
import { SettingsRepository } from '@n8n/db';

describe('OIDC service', () => {
	const oidcService = new OidcService(
		Container.get(SettingsRepository),
		Container.get(AuthIdentityRepository),
		Container.get(UrlService),
		Container.get(GlobalConfig),
		Container.get(UserRepository),
		Container.get(Cipher),
		Container.get(Logger),
	);

	beforeAll(async () => {
		await oidcService.init();
	});

	it('should initialize with default config', () => {
		expect(oidcService.getRedactedConfig()).toEqual({
			clientId: '',
			clientSecret: OIDC_CLIENT_SECRET_REDACTED_VALUE,
			discoveryEndpoint: 'http://n8n.io/not-set',
			loginEnabled: false,
		});
	});

	it('should generate a valid callback URL', () => {
		const callbackUrl = oidcService.getCallbackUrl();
		expect(callbackUrl).toContain('/sso/oidc/callback');
	});

	it('should load and update OIDC configuration', async () => {
		const newConfig: OidcConfigDto = {
			clientId: 'test-client-id',
			clientSecret: 'test-client-secret',
			discoveryEndpoint: 'https://example.com/.well-known/openid-configuration',
			loginEnabled: true,
		};

		await oidcService.updateConfig(newConfig);
		const loadedConfig = await oidcService.loadConfig();

		expect(loadedConfig).toEqual({
			clientId: 'test-client-id',
			clientSecret: 'test-client-secret',
			discoveryEndpoint: new URL('https://example.com/.well-known/openid-configuration'),
			loginEnabled: true,
		});
	});
});
