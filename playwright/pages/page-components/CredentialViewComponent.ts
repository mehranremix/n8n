import type { Page } from '@playwright/test';

export class CredentialViewComponent {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async openCredentialSelector() {
		await this.page.getByRole('combobox', { name: 'Select Credential' }).click();
	}

	async createNewCredential() {
		await this.page.getByText('Create new credential').click();
	}

	async fillCredentialField(fieldName: string, value: string) {
		const field = this.page
			.getByTestId(`parameter-input-${fieldName}`)
			.getByTestId('parameter-input-field');
		await field.click();
		await field.fill(value);
	}

	async saveCredential() {
		await this.page.getByRole('button', { name: 'Save' }).click();
	}

	async closeCredentialDialog() {
		await this.page.getByRole('button', { name: 'Close this dialog' }).click();
	}

	async createAndSaveCredential(fieldName: string, value: string) {
		await this.openCredentialSelector();
		await this.createNewCredential();
		await this.fillCredentialField(fieldName, value);
		await this.saveCredential();
		await this.closeCredentialDialog();
	}
}
