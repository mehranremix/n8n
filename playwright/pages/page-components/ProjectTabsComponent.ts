import { type Page } from '@playwright/test';

export class ProjectTabsComponent {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async navigateToWorkflows() {
		await this.page.getByRole('link', { name: 'Workflows' }).click();
	}

	async navigateToCredentials() {
		await this.page.getByRole('link', { name: 'Credentials' }).click();
	}

	async navigateToExecutions() {
		await this.page.getByRole('link', { name: 'Executions' }).click();
	}

	async navigateToProjectSettings() {
		await this.page.getByRole('link', { name: 'Project settings' }).click();
	}
}
