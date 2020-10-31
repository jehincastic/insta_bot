import puppeteer from 'puppeteer';

import Page from '../../Page';
import { getRandomNumber } from '../../common/utils';
import { instaUserType } from '../../types';
import { followInfo } from '../../config';

class User extends Page {
  private username: string;

  private userInfo: instaUserType;

  constructor(username: string, browser: puppeteer.Browser) {
    super(browser);
    this.username = username;
    this.baseUrl = 'https://www.instagram.com';
  }

  async followUser() {
    try {
      await this.waitFor(getRandomNumber(600, 1200));
      if (!this.userInfo.isFollowed) {
        const followButton = await this.page.$('span button');
        const textContent = await followButton?.evaluate(((node) => node.textContent));
        if (textContent) {
          if (followInfo.followIfUserFollows && textContent.toLowerCase() === 'follow back') {
            await followButton?.click();
          } else {
            await followButton?.click();
          }
        } else {
          throw new Error('Fllow Button Not Found');
        }
      }
      return;
    } catch (err) {
      throw err;
    }
  }

  async getInfo() {
    try {
      await this.navigateToPage();
      await this.waitFor(getRandomNumber(600, 1200));
      const profileInfo = await Promise.all([
        this.getProfileInfo(),
        this.isFollowed(),
      ]);
      this.userInfo = {
        posts: profileInfo[0].posts,
        noOfFollowers: profileInfo[0].followers,
        noOfFollowing: profileInfo[0].following,
        isFollowed: profileInfo[1],
      };
    } catch (err) {
      throw err;
    }
  }

  private async navigateToPage() {
    try {
      this.page = await this.getPage(`/${this.username}`);
    } catch (err) {
      throw err;
    }
  }

  private async isFollowed() {
    try {
      const followingButton = await this.page.$('header button span[aria-label="Following"]');
      if (followingButton) {
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    }
  }

  private async getProfileInfo() {
    try {
      const promArr: Promise<string | null>[] = [];
      const information = await this.page.$$('div + ul li');
      information.forEach((info) => {
        promArr.push(info.evaluate(((node) => node.textContent)));
      });
      const [posts, followers, following] = await Promise.all(promArr);
      return {
        posts: posts || '',
        followers: followers || '',
        following: following || '',
      };
    } catch (err) {
      throw err;
    }
  }
}

export default User;
