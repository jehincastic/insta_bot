import puppeteer from 'puppeteer';

import Page from '../../Page';
import {
  auth,
  postInfo,
} from '../../config';
import { typeSelctor } from '../../types';
import {
  getRandomElements,
  getRandomNumber,
} from '../../common/utils';
import Post from './Post';
import User from './User';

class Instagram extends Page {
  constructor(browser: puppeteer.Browser) {
    super(browser);
    this.baseUrl = 'https://www.instagram.com';
  }

  private async skipAlerts() {
    try {
      const rememberMeButton = await this.findButtonsByInnerText('button[type="button"]', 'Not Now');
      await rememberMeButton?.click();
      await this.page.waitForNavigation();
      await this.waitFor(getRandomNumber(400, 1000));
      const notificationButton = await this.findButtonsByInnerText('div[role="dialog"] button', 'Not Now');
      await notificationButton?.click();
      return;
    } catch (err) {
      throw err;
    }
  }

  async authenticate() {
    try {
      this.page = await this.getPage('');
      const selectors: typeSelctor[] = [
        {
          selector: 'input[name="username"]',
          value: auth.username,
        }, {
          selector: 'input[name="password"]',
          value: auth.password,
        },
      ];
      await this.page.waitForSelector('input[name="username"]');
      await this.typeInSelector(selectors);
      await this.clickButton('button[type="submit"]');
      await this.page.waitForNavigation();
      await this.waitFor(getRandomNumber(500, 1500));
      return this.skipAlerts();
    } catch (err) {
      throw err;
    }
  }

  async getPostsByTag(tag: string) {
    try {
      const { numberOfPosts } = postInfo;
      await this.waitFor(getRandomNumber(1200, 2500));
      if (this.page) {
        await this.page.close();
      }
      this.page = await this.getPage(`/explore/tags/${tag}`);
      if (numberOfPosts > 20) {
        await this.scroll(300 + (350 * 33) + (350 * numberOfPosts - 20));
      }
      const divs = await this.page.$$('article h2+div');
      if (divs.length >= 2) {
        const posts = await divs[1].$$('a');
        let postUrl: (string | null)[] = [];
        if (posts.length > 0) {
          const promArr: Promise<string | null>[] = [];
          for (let i = 0; i < posts.length; i += 1) {
            const element = posts[i];
            promArr.push(element.evaluate(((node) => node.getAttribute('href'))));
          }
          postUrl = await Promise.all(promArr);
        }
        return getRandomElements(postUrl, numberOfPosts);
      }
      throw new Error('Could not scape posts');
    } catch (err) {
      throw err;
    }
  }

  async openAllPosts(posts: (string | null)[]) {
    try {
      for (let i = 0; i < posts.length; i += 1) {
        const postUrl = posts[i];
        if (postUrl) {
          await this.waitFor(getRandomNumber(500, 2000));
          const post = new Post(postUrl, this.browser);
          await post.navigateToPage();
          const isPostLiked = await post.isPostLiked();
          if (!isPostLiked) {
            await post.likePost();
          }
          await post.closePage();
        }
      }
      // eslint-disable-next-line no-console
      console.log('Done All');
      return;
    } catch (err) {
      throw err;
    }
  }

  async getUserProfile(username: string) {
    try {
      const user = new User(username, this.browser);
      await user.getInfo();
      await user.followUser();
    } catch (err) {
      throw err;
    }
  }
}

export default Instagram;
