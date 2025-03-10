import { Page, expect } from '@playwright/test';
import { step } from '../../helpers/step';
import { refreshUntill } from '../../helpers/refreshUntill';

export default class NetworkOrdersPage {
  constructor(readonly page: Page) {}

  private async getIframe() {
    return this.page.locator('#globalIFrame').contentFrame();
  }

  @step('Select create new order')
  async selectCreateNewOrder() {
    const iframe = await this.getIframe();
    await iframe.getByText('Utwórz nowy dokument').click();
  }

  @step('Select full order')
  async selectFullOrder() {
    const iframe = await this.getIframe();
    await iframe.getByRole('button', { name: 'Pełne' }).click();
  }

  @step('Select supplier')
  async selectSupplier(suplplier: string) {
    const iframe = await this.getIframe();
    await iframe
      .locator("//input[contains(@name,'supplier.orgUnit.fullName')]")
      .fill(suplplier);
    await iframe.locator('.lookup').first().click();
  }

  @step('Refresh untill order visable')
  async refreshForOrder() {
    const iframe = await this.getIframe();
    await refreshUntill(
      this.page,
      iframe.locator("//td/span[contains(text(), 'ORD')]").first(),
    );
  }

  @step('Go to order')
  async enterOrder() {
    const iframe = await this.getIframe();
    await iframe.locator("//td/span[contains(text(), 'ORD')]").first().click();
  }

  @step('Enter comments')
  async enterComments(comment: string) {
    const iframe = await this.getIframe();
    await iframe.locator('#middlePanel').click();
    await iframe
      .locator(
        "//input[contains(@name,'editForm:form-content:documentData:documentFields:tabs:panel:text')]",
      )
      .fill(comment);
  }

  @step('Enter the quantity of the first article')
  async enterQuantityFirstArticle(count: number) {
    const iframe = await this.getIframe();
    await iframe.locator("//input[contains(@name,'rows:1:cells:9')]").clear();

    await iframe
      .locator("//input[contains(@name,'rows:1:cells:9')]")
      .fill(`${count}`);
  }

  @step('Send order')
  async sendOrder() {
    const iframe = await this.getIframe();
    await iframe.getByRole('button', { name: 'Wyślij' }).click();
  }

  @step('Verify order is sent')
  async isSent() {
    const iframe = await this.getIframe();
    await refreshUntill(
      this.page,
      iframe.locator('.window_header').getByText('Do wysłania'),
    );
    await expect(
      iframe.locator('.window_header').getByText('Do wysłania'),
    ).toBeVisible();
  }
}
