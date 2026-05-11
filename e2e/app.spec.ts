import { expect, test } from '@playwright/test';

test('starts blank, validates, and edits a my-skill template', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Build Your Harness' })).toBeVisible();
  await expect(page.locator('.skill-node')).toHaveCount(0);

  await page.getByRole('button', { name: /Validate/ }).click();
  await expect(page.getByText('Workflow is valid')).toBeVisible();

  await expect(page.getByText('Use Superpowers')).toHaveCount(0);
  await page.getByRole('button', { name: /My Skill/ }).click();

  const skillEditor = page.getByRole('complementary').filter({ has: page.getByRole('heading', { name: 'Skill Editor' }) });
  await expect(skillEditor.getByText('Detected metadata')).toBeVisible();
  await expect(skillEditor.locator('.inspector__metadata-card strong')).toHaveText('My Skill');
  await expect(skillEditor.getByLabel('SKILL.md content')).toHaveValue(/name: my-skill/);

  await skillEditor.getByLabel('SKILL.md content').fill(`---
name: browser-review
description: Run browser automation before handoff.
---

# Browser Review
`);
  await expect(skillEditor.locator('.inspector__metadata-card strong')).toHaveText('Browser Review');
  await expect(skillEditor.locator('.inspector__metadata-card p')).toHaveText('Run browser automation before handoff.');
  await expect(skillEditor.getByText('AI assistant prompt')).toHaveCount(0);
});
