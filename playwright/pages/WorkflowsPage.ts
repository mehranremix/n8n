import { type Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { ProjectTabsComponent } from './page-components/ProjectTabsComponent';
import { resolveFromRoot } from '../utils/path-helper';

export class WorkflowsPage {
	readonly page: Page;

	readonly projectTabs: ProjectTabsComponent;

	constructor(page: Page) {
		this.page = page;
		this.projectTabs = new ProjectTabsComponent(page);
	}

	async clickAddFirstProjectButton() {
		await this.page.getByTestId('add-first-project-button').click();
	}

	/**
	 * Import a workflow from a fixture file
	 * @param fixtureKey - The key of the fixture file to import
	 * @param workflowName - The name of the workflow to import
	 * Naming the file causes the workflow to save so we don't need to click save
	 */
	async importWorkflow(fixtureKey: string, workflowName: string) {
		await this.page.getByTestId('workflow-menu').click();

		const [fileChooser] = await Promise.all([
			this.page.waitForEvent('filechooser'),
			this.page.getByText('Import from File...').click(),
		]);
		await fileChooser.setFiles(resolveFromRoot('workflows', fixtureKey));

		await this.page.getByTestId('inline-edit-preview').click();
		await this.page.getByTestId('inline-edit-input').fill(workflowName);
		await this.page.getByTestId('inline-edit-input').press('Enter');
	}

	async workflowTags(): Promise<string[]> {
		const tagsLocator = this.page.getByTestId('workflow-tags').locator('.el-tag');
		return await tagsLocator.allTextContents();
	}
}
