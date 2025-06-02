import type { Page } from '@playwright/test';

import { CanvasPage } from './CanvasPage';
import { CredentialViewComponent } from './page-components/CredentialViewComponent';
import { NodeDisplayViewComponent } from './page-components/NodeDisplayViewComponent';
import { ProjectSettingsPage } from './ProjectSettingsPage';
import { ProjectWorkflowsPage } from './ProjectWorkflowsPage';
import { WorkflowsPage } from './WorkflowsPage';

export class n8nPage {
	readonly page: Page;
	readonly canvas: CanvasPage;
	readonly ndv: NodeDisplayViewComponent;
	readonly projectWorkflows: ProjectWorkflowsPage;
	readonly projectSettings: ProjectSettingsPage;
	readonly workflows: WorkflowsPage;
	readonly credentialView: CredentialViewComponent;

	constructor(page: Page) {
		this.page = page;
		this.canvas = new CanvasPage(page);
		this.ndv = new NodeDisplayViewComponent(page);
		this.projectWorkflows = new ProjectWorkflowsPage(page);
		this.projectSettings = new ProjectSettingsPage(page);
		this.workflows = new WorkflowsPage(page);
		this.credentialView = new CredentialViewComponent(page);
	}

	async goHome() {
		await this.page.goto('/');
	}
}
