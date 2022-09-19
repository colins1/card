/**
 * @jest-environment jsdom
 */
import puppeteer from 'puppeteer-core';
import Widget from '../src/js/Widget';
import Validator from '../src/js/Validator';

const { fork } = require('child_process');

jest.setTimeout(30000);

describe('Credit Card Validator form', () => {
  let browser = null;
  let page = null;
  let server = null;

  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });
    browser = await puppeteer.launch({
      // headless: false, // show gui
      // slowMo: 250,
      // devtools: true, // show devTools
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await page.close();
    await browser.close();
    server.kill();
  });

  test('should add do something', async () => {
    new Widget();
    Validator.Validate('widget-card-input');
    await page.goto(baseUrl);
    const input = await page.$('.widget-card-input');
    await input.type('6011991626216935');
    const button = await page.$('.widget-card-input-button');
    await button.click();

    await page.waitForSelector('.widget-hint');
    const hint = await page.$('.widget-hint');
    const value = await page.evaluate((el) => el.textContent, hint);
    expect(value).toBe('This card is Valid');
  });

  test('should add do something', async () => {
    new Widget();
    Validator.Validate('widget-card-input');
    await page.goto(baseUrl);
    const input = await page.$('.widget-card-input');
    await input.type('6011991626216936');
    const button = await page.$('.widget-card-input-button');
    await button.click();

    await page.waitForSelector('.widget-hint');
    const hint = await page.$('.widget-hint');
    const value = await page.evaluate((el) => el.textContent, hint);
    expect(value).toBe('This card is invalid');
  });
});
