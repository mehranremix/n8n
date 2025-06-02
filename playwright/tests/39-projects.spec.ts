import { test, expect } from '../fixtures/auth';
import { n8nPage } from '../pages/n8nPage';

const PROJECT_NAME = 'Dev';
const MANUAL_TRIGGER_NODE_NAME = 'Manual trigger';
const EXECUTE_WORKFLOW_NODE_NAME = 'Execute Sub-workflow';
const NOTION_NODE_NAME = 'Notion';
const NOTION_API_KEY = 'abc123Playwright';

test.describe('Workflow Sharing @db:reset', () => {
	test.beforeEach(async ({ api, n8n }) => {
		await api.enableFeature('sharing');
		await api.enableFeature('folders');
		await api.enableFeature('advancedPermissions');
		await api.enableFeature('projectRole:admin');
		await api.enableFeature('projectRole:editor');
		await api.setMaxTeamProjectsQuota(-1);
		await n8n.goHome();
	});
	test('should not show project add button and projects to a member if not invited to any project @auth:member', async ({
		n8n,
	}) => {
		await expect(n8n.page.getByTestId('add-project-menu-item')).not.toBeVisible();
		await expect(n8n.page.locator('[data-test-id="project-menu-item"]')).toHaveCount(0);
	});

	test('should create sub-workflow and credential in the sub-workflow in the same project @auth:owner', async ({
		n8n,
	}) => {
		// Add a project
		await n8n.workflows.clickAddFirstProjectButton();
		await n8n.projectSettings.fillProjectName(PROJECT_NAME);
		await n8n.projectSettings.clickSaveButton();
		await n8n.projectSettings.projectTabsComponent.navigateToWorkflows();

		// Add a workflow
		await n8n.projectWorkflows.clickCreateWorkflowButton();

		// Add manual trigger and subworkflow execute to workflow 1
		await n8n.canvas.addNodeToCanvas(MANUAL_TRIGGER_NODE_NAME);

		await n8n.canvas.saveWorkflow();

		await expect(
			n8n.page.getByText('Workflow successfully created', { exact: false }),
		).toBeVisible();

		await n8n.canvas.addNodeToCanvasWithSubItem(
			EXECUTE_WORKFLOW_NODE_NAME,
			'Execute A Sub Workflow',
		);

		const subWorkflowPagePromise = n8n.page.waitForEvent('popup');

		// This should bring us to a new tab with a new subworkflow, with the NDV open for the subworkflow trigger
		await n8n.ndv.selectWorkflowResource(`Create a Sub-Workflow in '${PROJECT_NAME}'`);

		const subn8n = new n8nPage(await subWorkflowPagePromise);
		await subn8n.ndv.clickBackToCanvasButton();

		await subn8n.canvas.deleteNodeByName('Replace me with your logic');
		await subn8n.canvas.addNodeToCanvasWithSubItem(NOTION_NODE_NAME, 'Append a block');

		await subn8n.credentialView.createAndSaveCredential('apiKey', NOTION_API_KEY);

		await subn8n.ndv.clickBackToCanvasButton();
		await subn8n.canvas.saveWorkflow();

		await subn8n.page.goto('/home/workflows');
		await subn8n.projectWorkflows.clickProjectMenuItem(PROJECT_NAME);
		await subn8n.projectWorkflows.projectTabs.navigateToWorkflows();

		// Get Workflow Count

		await expect(subn8n.page.locator('[data-test-id="resources-list-item-workflow"]')).toHaveCount(
			2,
		);

		// Assert that the sub-workflow is in the list
		await expect(subn8n.page.getByRole('heading', { name: 'My Sub-Workflow' })).toBeVisible();

		// Navigate to Credentials
		await subn8n.page.getByRole('link', { name: 'Credentials' }).click();

		// Assert that the credential is in the list
		await expect(subn8n.page.locator('[data-test-id="resources-list-item"]')).toHaveCount(1);
		await expect(subn8n.page.getByRole('heading', { name: 'Notion account' })).toBeVisible();
	});
});
