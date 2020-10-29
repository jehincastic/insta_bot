/* eslint-disable import/first */
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

dotenv.config();

import Instagram from './pages/Instagram/Instagram';
import { job } from './config';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      height: 768,
      width: 1363,
    },
  });
  const instaPage = new Instagram(browser);
  await instaPage.authenticate();
  for (let i = 0; i < job.hashtags.length; i += 1) {
    const tag = job.hashtags[i];
    const postArr = await instaPage.getPostsByTag(tag);
    await instaPage.openAllPosts(postArr);
  }
})();
