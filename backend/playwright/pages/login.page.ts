import { Page, expect } from '@playwright/test';
import { step } from '../helpers/step';

export default class LoginPage {
  constructor(readonly page: Page) {}

  @step('Open eSambo')
  async openEsambo(adress: string) {
    await this.page.goto(adress);
  }

  @step('Fill the username')
  async enterUsername(username: string) {
    await this.page.locator('#username-parameter').click();
    await this.page.locator('#username-parameter').fill(username);
  }

  @step('Fill the password')
  async enterPassword(password: string) {
    await this.page.locator('#password-parameter').click();
    await this.page.locator('#password-parameter').fill(password);
    await this.page.locator('.logo-custom').click();
  }

  @step('Select store')
  async enterStore(store: string) {
    await this.page.locator("//span[@name='store']").isEnabled();
    await this.page.waitForTimeout(1000);
    await this.page.locator("//span[@name='store']").click();
    await this.page.locator('//li/span').getByText(store).isEnabled();
    await this.page.waitForTimeout(1000);
    await this.page.locator('//li/span').getByText(store).click();
  }

  @step('Press login button')
  async clickLoginButon() {
    await this.page.getByRole('button', { name: 'Zaloguj' }).click();
  }

  @step('Verify user logged')
  async verifyUserLogged() {
    await expect(
      this.page.locator('#globalIFrame').contentFrame().locator('#middlePanel'),
    ).toBeVisible();
  }
}
