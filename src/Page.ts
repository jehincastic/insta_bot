import puppeteer from 'puppeteer';

import { getRandomNumber } from './common/utils';
import { typeSelctor } from './types';

class Page {
  protected browser: puppeteer.Browser;

  protected page: puppeteer.Page;

  protected baseUrl = '';

  constructor(browser: puppeteer.Browser) {
    this.browser = browser;
  }

  protected getUrl(endpoint: string) {
    return this.baseUrl + endpoint;
  }

  protected async getPage(endpoint: string) {
    let page: puppeteer.Page | undefined;
    try {
      const url = this.getUrl(endpoint);
      page = await this.browser.newPage();
      await page.goto(url, { waitUntil: 'load', timeout: 0 });
      return page;
    } catch (e) {
      if (page) {
        await page.close();
      }
      throw e;
    }
  }

  protected async typeInSelector(selectorArr: typeSelctor[], delay = 100) {
    try {
      for (let i = 0; i < selectorArr.length; i += 1) {
        const selector: typeSelctor = selectorArr[i];
        const input = await this.page.$(selector.selector);
        if (input) {
          await input.type(selector.value, { delay });
        } else {
          throw new Error('Auth Failed!.');
        }
      }
      return;
    } catch (err) {
      throw err;
    }
  }

  protected async clickButton(selector: string) {
    try {
      const button = await this.page.$(selector);
      if (button) {
        return button.click();
      }
      throw new Error('Auth Failed!.');
    } catch (err) {
      throw err;
    }
  }

  protected async findButtonsByInnerText(selector: string, innerText: string) {
    try {
      const buttons = await this.page.$$(selector);
      if (buttons.length > 0) {
        for (let i = 0; i < buttons.length; i += 1) {
          const element = buttons[i];
          const textContent = await element.evaluate(((node) => node.textContent));
          if (textContent === innerText) {
            return element;
          }
        }
      }
      return undefined;
    } catch (err) {
      throw err;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  protected waitFor(ms: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  protected async scroll(distance: number) {
    try {
      await this.waitFor(getRandomNumber(400, 800));
      return this.page.evaluate(`window.scrollTo(0, ${distance})`);
    } catch (err) {
      throw err;
    }
  }

  async closePage() {
    try {
      await this.waitFor(getRandomNumber(500, 2000));
      return this.page.close();
    } catch (err) {
      throw err;
    }
  }

  closeBrowser() {
    return this.browser.close();
  }
}

export default Page;
