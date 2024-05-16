import { expect, test } from '@playwright/test';

const NameToCategoryEnglish: {
  [key: number]: string;
} = {
  103: 'Bars and lounges in the Zurich region',
  101: 'Eating out in Zurich',
  96: 'Culture in the Zurich region',
  136: 'Museums in the Zurich region',
  162: 'Nightlife: clubs in Zurich'
};

const NameToCategoryGerman: {
  [key: number]: string
} = {
  103: 'Bars und Lounges in der Region Zürich',
  101: 'Essen gehen in Zürich',
  96: 'Kultur in der Region Zürich',
  136: 'Museen in der Region Zürich',
  162: 'Nachtleben: Clubs in Zürich'
}

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForTimeout(5000);
});

test('Check if all 5 categories are loaded', async ({ page }) => {
  for (const key of Object.keys(NameToCategoryEnglish)) {
    await expect(page.getByTestId(`expand-button-${key}`)).toBeVisible();
  }

  for (const value of Object.values(NameToCategoryEnglish)) {
    await expect(page.locator(`text=${value}`)).toBeVisible();
  }
});

test('Check if all 5 category names are updated after language switch', async ({page}) => {
  // Switch language selector
  await page.getByTestId(`language-select`).click();
  await page.getByTestId(`language-de`).click();

  for (const value of Object.values(NameToCategoryGerman)) {
    await expect(page.locator(`text=${value}`)).toBeVisible();
  }

})

test('Check if categories is opening and if it shows the amount of elements configured also on page switch', async ({
  page
}) => {
  const firstElement = Object.keys(NameToCategoryEnglish)[0];

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

test('Check if category items are added to favorites and saved to local storage', async ({ page }) => {
  const firstElement = Object.keys(NameToCategoryEnglish)[0];
  
  await page.getByTestId(`expand-button-${firstElement}`).click();
  
  await page.getByTestId(`heart-light`).first().click();
  
  await expect(page.getByTestId(`heart-fill`).first()).toBeVisible();
  
  await page.reload();
  await page.getByTestId(`expand-button-${firstElement}`).click();
  await expect(page.getByTestId(`heart-fill`).first()).toBeVisible();
});

