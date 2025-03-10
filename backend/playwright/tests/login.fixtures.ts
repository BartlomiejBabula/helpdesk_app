import { test as baseTest } from '@playwright/test';
import LoginPage from '../pages/login.page';

const userName = process.env.USER_NAME ? process.env.USER_NAME : '';
const password = process.env.PASSWORD ? process.env.PASSWORD : '';
const store = process.env.STORE ? process.env.STORE : '203';
const esamboURL = process.env.ESAMBO_URL
  ? process.env.ESAMBO_URL
  : 'http://100.106.215.3:17013/esambo/login?0';

export const test = baseTest.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      (window as any).Playwright = true;
    });
    const loginPage = new LoginPage(page);
    await loginPage.openEsambo(esamboURL);
    await loginPage.enterUsername(userName);
    await loginPage.enterPassword(password);
    await loginPage.clickLoginButon();
    await loginPage.enterStore(store);
    await loginPage.clickLoginButon();
    await loginPage.verifyUserLogged();
    use(page);
  },
});
export { expect } from '@playwright/test';
