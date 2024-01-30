import { test, expect } from '@playwright/test';
import axios from 'axios';
import { parse } from 'csv-parse';
import { parse as parseSync } from 'csv-parse/sync';
import fs from 'node:fs';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('loads from web CSV', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // This relies on two extra libraries: axios and csv-parse

  // fetch CSV from URL with axios
  const response = await axios.get("https://github.com/glitchassassin/playwright-csv-demo/raw/main/sources.csv");

  // parse CSV with csv-parse
  // automatically checks for headers in the first row - if the first row doesn't
  // contain headers, set "columns: false"
  const records = parseSync(response.data, { columns: true, skip_empty_lines: true });

  // records are now objects with headers as keys
  // [ { role: 'link', count: '1' }, { role: 'heading', count: '2' } ]
  // note that all cells are loaded as strings
  for (const { role, count } of records) {
    await expect(page.getByRole(role)).toHaveCount(
      // convert string to int
      parseInt(count)
    );
  }
})

test('loads from local CSV', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // This relies on one extra library: csv-parse

  // load CSV from local file system and parse CSV with csv-parse
  // automatically checks for headers in the first row - if the first row doesn't
  // contain headers, set "columns: false"
  const records = fs.createReadStream("./sources.csv").pipe(parse({ columns: true, skip_empty_lines: true }));

  // this creates an async iterator (hence the `for await`)

  // records are now objects with headers as keys
  // [ { role: 'link', count: '1' }, { role: 'heading', count: '2' } ]
  // note that all cells are loaded as strings
  for await (const { role, count } of records) {
    await expect(page.getByRole(role)).toHaveCount(
      // convert string to int
      parseInt(count)
    );
  }
})