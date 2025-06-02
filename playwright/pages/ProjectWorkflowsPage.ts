import type { Page } from '@playwright/test';

import { ProjectTabsComponent } from './page-components/ProjectTabsComponent';

export class ProjectWorkflowsPage {
	readonly page: Page;

	readonly projectTabs: ProjectTabsComponent;

	constructor(page: Page) {
		this.page = page;
		this.projectTabs = new ProjectTabsComponent(page);
	}

	async clickCreateWorkflowButton() {
		await this.page.getByTestId('add-resource-workflow').click();
	}

	async clickProjectMenuItem(projectName: string) {
		await this.page
			.getByTestId('project-menu-item')
			.getByRole('link', { name: projectName })
			.click();
	}
}
