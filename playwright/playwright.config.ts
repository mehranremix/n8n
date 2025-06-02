import { defineConfig } from '@playwright/test';

export default defineConfig({
	globalSetup: require.resolve('./global-setup.ts'),
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 2 : undefined,

	// Enhanced reporter configuration for CI
	reporter: process.env.CI
		? [
				['list'],
				['github'],
				['junit', { outputFile: process.env.PLAYWRIGHT_JUNIT_OUTPUT_NAME || 'results.xml' }],
				['html', { open: 'never' }],
				['json', { outputFile: 'test-results.json' }],
			]
		: 'html',

	use: {
		baseURL: 'http://localhost:5678',
		trace: 'on',
		video: 'on',
		screenshot: 'on',
		testIdAttribute: 'data-test-id',
		headless: true,
	},

	projects: [
		{
			name: 'Full Parallel Tests',
			grepInvert: /@db:reset/,
		},
		{
			name: 'Sequential Tests',
			grep: /@db:reset/,
			workers: 1, // CRITICAL: Ensures tests in this project run one after another within their shard.
			dependencies: ['Full Parallel Tests'],
		},
	],

	webServer: {
		command: 'cd .. && pnpm start',
		url: 'http://localhost:5678/favicon.ico',
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
		env: {
			E2E_TESTS: 'true',
		},
	},
});
