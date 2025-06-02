import type { Page } from '@playwright/test';

export class NodeDisplayViewComponent {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async clickBackToCanvasButton() {
		await this.page.getByTestId('back-to-canvas').click();
	}

	getParameterByLabel(labelName: string) {
		return this.page.locator('.parameter-item').filter({ hasText: labelName });
	}

	async selectWorkflowResource(createItemText: string, searchText: string = '') {
		await this.page.locator('[data-test-id="rlc-input"]').click();

		if (searchText) {
			await this.page.locator('[data-test-id="rlc-search"]').fill(searchText);
		}

		await this.page.getByText(createItemText, { exact: false }).click();
	}
}
