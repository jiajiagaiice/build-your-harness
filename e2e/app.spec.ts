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

  const palette = page.locator('.palette');
  const expandedPaletteWidth = (await palette.boundingBox())?.width ?? 0;
  await page.getByRole('button', { name: 'Collapse skill palette' }).click();
  await expect(palette).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('button', { name: 'Expand skill palette' })).toBeVisible();
  await expect.poll(async () => (await palette.boundingBox())?.width ?? expandedPaletteWidth).toBeLessThan(expandedPaletteWidth);
  await page.getByRole('button', { name: 'Expand skill palette' }).click();
  await expect(palette).toHaveAttribute('aria-expanded', 'true');

  const expandedEditorWidth = (await skillEditor.boundingBox())?.width ?? 0;
  await page.getByRole('button', { name: 'Collapse skill editor' }).click();
  await expect(skillEditor).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('button', { name: 'Expand skill editor' })).toBeVisible();
  await expect.poll(async () => (await skillEditor.boundingBox())?.width ?? expandedEditorWidth).toBeLessThan(expandedEditorWidth);
  await page.getByRole('button', { name: 'Expand skill editor' }).click();
  await expect(skillEditor).toHaveAttribute('aria-expanded', 'true');

  await page.evaluate(() => {
    (window as unknown as { openedSkillSourceUrl?: string; open: Window['open'] }).open = (url?: string | URL) => {
      (window as unknown as { openedSkillSourceUrl?: string }).openedSkillSourceUrl = String(url);
      return null;
    };
  });
  await skillEditor.getByRole('button', { name: /Open SKILL\.md/ }).click();
  const openedSkillSource = await page.evaluate(async () => {
    const url = (window as unknown as { openedSkillSourceUrl?: string }).openedSkillSourceUrl;
    return url ? fetch(url).then((response) => response.text()) : '';
  });
  expect(openedSkillSource).toContain('browser-review');
});
