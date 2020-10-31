/* eslint-disable import/first */
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

dotenv.config();

import Instagram from './pages/Instagram/Instagram';
import { postInfo } from './config';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const instaPage = new Instagram(browser);
  await instaPage.authenticate();
  for (let i = 0; i < postInfo.hashtags.length; i += 1) {
    const tag = postInfo.hashtags[i];
    const postArr = await instaPage.getPostsByTag(tag);
    await instaPage.openAllPosts(postArr);
  }
})();
