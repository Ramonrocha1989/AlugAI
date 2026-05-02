import { test, expect } from '@playwright/test';

test.describe('smoke', () => {
  test('home loads with main heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(
      page.getByText('Compre, venda ou troca máquinas agrícolas e de construção')
    ).toBeVisible();
  });

  test('como-funciona page loads', async ({ page }) => {
    await page.goto('/como-funciona');
    await expect(
      page.getByRole('heading', { name: 'Como Funciona', exact: true })
    ).toBeVisible();
  });

  test('forgot-password page loads', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(
      page.getByRole('heading', { name: 'Esqueci minha senha', exact: true })
    ).toBeVisible();
  });

  test('blog index loads', async ({ page }) => {
    await page.goto('/blog');
    await expect(
      page.getByRole('heading', { name: 'Blog BaitaBriq', exact: true })
    ).toBeVisible();
  });

  test('politica de privacidade loads', async ({ page }) => {
    await page.goto('/politica-privacidade');
    await expect(
      page.getByRole('heading', {
        name: 'Política de Privacidade',
        exact: true,
      })
    ).toBeVisible();
  });

  test('termos de uso load', async ({ page }) => {
    await page.goto('/termos-de-uso');
    await expect(
      page.getByRole('heading', { name: 'Termos de Uso', exact: true })
    ).toBeVisible();
  });

  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Entrar na sua conta', exact: true })
    ).toBeVisible();
  });
});
