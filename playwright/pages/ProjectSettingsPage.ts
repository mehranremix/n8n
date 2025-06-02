import { type Page, type Locator } from '@playwright/test';

import { ProjectTabsComponent } from './page-components/ProjectTabsComponent';

export class ProjectSettingsPage {
	readonly page: Page;

	readonly projectTabsComponent: ProjectTabsComponent;

	readonly projectSettingsNameInput: Locator;

	readonly projectSettingsSaveButton: Locator;

	constructor(page: Page) {
		this.page = page;
		this.projectTabsComponent = new ProjectTabsComponent(page);
		this.projectSettingsNameInput = page
			.getByTestId('project-settings-name-input')
			.locator('input');
		this.projectSettingsSaveButton = page.getByTestId('project-settings-save-button');
	}

	async fillProjectName(name: string) {
		await this.projectSettingsNameInput.fill(name);
	}

	async clickSaveButton() {
		await this.projectSettingsSaveButton.click();
	}
}
