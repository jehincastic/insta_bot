import puppeteer from 'puppeteer';

import Page from '../../Page';
import { getRandomNumber } from '../../common/utils';

class Post extends Page {
  private postLink = '';

  constructor(link: string, browser: puppeteer.Browser) {
    super(browser);
    this.postLink = link;
    this.baseUrl = 'https://www.instagram.com';
  }

  async navigateToPage() {
    try {
      this.page = await this.getPage(this.postLink);
    } catch (err) {
      throw err;
    }
  }

  async isPostLiked() {
    try {
      const likedButton = await this.page.$('svg[aria-label="Unlike"][width="24"]');
      return likedButton !== null;
    } catch (err) {
      throw err;
    }
  }

  async likePost() {
    try {
      await this.waitFor(getRandomNumber(400, 800));
      const likedButton = await this.page.$('svg[aria-label="Like"][width="24"]');
      await likedButton?.click();
      return;
    } catch (err) {
      throw err;
    }
  }
}

export default Post;
