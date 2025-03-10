import { expect, Page } from '@playwright/test';
import { step } from '../helpers/step';
import { refreshUntill } from '../helpers/refreshUntill';

export default class Dashboard {
  constructor(readonly page: Page) {}

  private async getIframe() {
    return this.page.locator('#globalIFrame').contentFrame();
  }

  @step('Select articles menu')
  async selectArticleMenu() {
    const iframe = await this.getIframe();
    await iframe.getByRole('link', { name: 'Towary' }).click();
  }

  @step('Select orders menu')
  async selectOrdersMenu() {
    const iframe = await this.getIframe();
    await iframe.getByText('Zamówienia').click();
  }

  @step('Select warehouse management menu')
  async selectWarehouseManagementMenu() {
    const iframe = await this.getIframe();
    await iframe.getByText('Gospodarka magazynowa').click();
  }

  @step('Press confirm button')
  async pressConfirmButton() {
    const iframe = await this.getIframe();
    await iframe.getByRole('button', { name: 'Zatwierdź' }).click();
  }

  @step('Verify if the document is confirmed')
  async isConfirm() {
    const iframe = await this.getIframe();
    await refreshUntill(
      this.page,
      iframe.locator('.window_header').getByText('Zatwierdzone'),
    );
    await expect(
      iframe.locator('.window_header').getByText('Zatwierdzone'),
    ).toBeVisible();
  }
}
