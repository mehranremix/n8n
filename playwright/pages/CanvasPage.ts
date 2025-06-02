import type { Page, Locator } from '@playwright/test';

export class CanvasPage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	get canvasPlusButton(): Locator {
		return this.page.getByTestId('canvas-plus-button');
	}

	get nodeCreatorPlusButton(): Locator {
		return this.page.getByTestId('node-creator-plus-button');
	}

	get saveWorkflowButton(): Locator {
		return this.page.getByRole('button', { name: 'Save' });
	}

	get nodeCreatorSearchBar(): Locator {
		return this.page.getByTestId('node-creator-search-bar');
	}

	nodeCreatorItemByName(text: string): Locator {
		return this.page.getByText(text);
	}

	nodeCreatorSubItem(subItemText: string): Locator {
		return this.page.getByTestId('item-iterator-item').filter({
			has: this.page.getByTestId('node-creator-item-name').getByText(subItemText),
		});
	}

	nodeCreatorSubItemButton(subItemText: string): Locator {
		return this.nodeCreatorSubItem(subItemText)
			.getByTestId('node-creator-item-name')
			.getByText(subItemText);
	}

	nodeByName(nodeName: string): Locator {
		return this.page.locator(`[data-node-name="${nodeName}"]`);
	}

	nodeToolbar(nodeName: string): Locator {
		return this.nodeByName(nodeName).getByTestId('canvas-node-toolbar');
	}

	nodeDeleteButton(nodeName: string): Locator {
		return this.nodeToolbar(nodeName).getByTestId('delete-node-button');
	}

	async clickCanvasPlusButton(): Promise<void> {
		await this.canvasPlusButton.click();
	}

	async clickNodeCreatorPlusButton(): Promise<void> {
		await this.nodeCreatorPlusButton.click();
	}

	async clickSaveWorkflowButton(): Promise<void> {
		await this.saveWorkflowButton.click();
	}

	async fillNodeCreatorSearchBar(text: string): Promise<void> {
		await this.nodeCreatorSearchBar.fill(text);
	}

	async clickNodeCreatorItemName(text: string): Promise<void> {
		await this.nodeCreatorItemByName(text).click();
	}

	async addNodeToCanvas(text: string): Promise<void> {
		await this.clickNodeCreatorPlusButton();
		await this.fillNodeCreatorSearchBar(text);
		await this.clickNodeCreatorItemName(text);
	}

	async addNodeToCanvasWithSubItem(searchText: string, subItemText: string): Promise<void> {
		await this.addNodeToCanvas(searchText);
		await this.nodeCreatorSubItemButton(subItemText).click();
	}

	async deleteNodeByName(nodeName: string): Promise<void> {
		await this.nodeDeleteButton(nodeName).click();
	}

	async saveWorkflow(): Promise<void> {
		await this.clickSaveWorkflowButton();
	}
}
