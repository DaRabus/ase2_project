import { expect, test } from '@playwright/test';

const NameToCategory: {
  [key: number]: string;
} = {
  103: 'Bars and lounges in the Zurich region',
  101: 'Eating out in Zurich',
  96: 'Culture in the Zurich region',
  136: 'Museums in the Zurich region',
  162: 'Nightlife: clubs in Zurich'
};

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForTimeout(5000);
});

test('Check if all 5 categories are loaded', async ({ page }) => {
  for (const key of Object.keys(NameToCategory)) {
    await expect(page.getByTestId(`expand-button-${key}`)).toBeVisible();
  }

  for (const value of Object.values(NameToCategory)) {
    await expect(page.locator(`text=${value}`)).toBeVisible();
  }
});

test('Check if categories is opening and if it shows the amount of elements configured also on page switch', async ({
  page
}) => {
  const firstElement = Object.keys(NameToCategory)[0];

  console.log('firstElement', firstElement);

  await page.getByTestId(`expand-button-${firstElement}`).click();

  await page
    .getByLabel(`store-element`)
    .count()
    .then((count) => {
      expect(count).toBe(3);
    });

  await page.getByTestId(`pagination-${firstElement}`).getByText('2').click();

  await page
    .getByLabel(`store-element`)
    .count()
    .then((count) => {
      expect(count).toBe(3);
    });

  // Switch page size selector

  await page.getByTestId(`page-size-select`).click();
  await page.getByTestId(`page-size-5`).click();

  await page
    .getByLabel(`store-element`)
    .count()
    .then((count) => {
      expect(count).toBe(5);
    });
});
