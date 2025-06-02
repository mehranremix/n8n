import path from 'path';
import { test, expect } from '../fixtures/auth';

test.describe('Workflows @db:reset', () => {
	test.beforeEach(async ({ n8n }) => {
		await n8n.goHome();
	});

	test('should create a new workflow using empty state card', async ({ n8n }) => {
		await n8n.workflows.page.getByTestId('new-workflow-card').click();
		await n8n.workflows.importWorkflow('Test_workflow_1.json', 'Empty State Card Workflow');
		const tags = await n8n.workflows.workflowTags();
		expect(tags).toEqual(expect.arrayContaining(['some-tag-1', 'some-tag-2']));
	});
});
