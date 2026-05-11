import { expect, test } from '@playwright/test';

test('validates the default workflow and edits a newly added skill', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Build Your Harness' })).toBeVisible();

  await page.getByRole('button', { name: /Validate/ }).click();
  await expect(page.getByText('Workflow is valid')).toBeVisible();

  await expect(page.getByText('Use Superpowers')).toHaveCount(0);
  await page.getByLabel('Search skills').fill('review');
  await page.getByRole('button', { name: 'Add Quality Review' }).click();

  const skillEditor = page.getByRole('complementary').filter({ has: page.getByRole('heading', { name: 'Skill Editor' }) });
  await expect(skillEditor.getByLabel('Label')).toHaveValue('Quality Review');

  await skillEditor.getByLabel('Description').fill('Run browser automation before handoff.');
  await expect(skillEditor.getByLabel('Description')).toHaveValue('Run browser automation before handoff.');

  await skillEditor.getByLabel('Write SKILL.md here').check();
  await skillEditor.getByRole('button', { name: 'Generate draft with AI helper' }).click();
  await expect(skillEditor.getByLabel('SKILL.md content')).toHaveValue(/# Quality Review/);
});
