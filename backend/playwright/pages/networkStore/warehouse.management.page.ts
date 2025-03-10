import { Page, expect } from '@playwright/test';
import { step } from '../../helpers/step';

export default class WarehouseManagementPage {
  constructor(readonly page: Page) {}

  private async getIframe() {
    return this.page.locator('#globalIFrame').contentFrame();
  }

  @step('Select delivery menu')
  async selectDeliveryMenu() {
    const iframe = await this.getIframe();
    await iframe
      .getByRole('tab', { name: 'Ukryj Dostawy' })
      .locator('a')
      .click();
  }

  @step('Select create new delivery')
  async selectCreateNewDelivery() {
    const iframe = await this.getIframe();
    await iframe
      .getByLabel('Dostawy')
      .getByText('Utwórz nowy dokument')
      .click();
  }

  @step('Select PZ without order')
  async selectPZWithoutOrder() {
    const iframe = await this.getIframe();
    await iframe.getByRole('button', { name: 'PZ bez zamówienia' }).click();
    await expect(
      iframe.locator('.window_header').getByText('W przygotowaniu'),
    ).toBeVisible();
  }

  @step('Select supplier')
  async selectSupplier(supplier: string) {
    const iframe = await this.getIframe();
    await iframe
      .locator('.supplier-orgUnit-fullName')
      .getByRole('textbox')
      .fill(supplier);
    await iframe.getByRole('button', { name: 'Wybierz' }).click();
  }

  @step('Select supplier department')
  async selectSupplierDepartment(department: string) {
    const iframe = await this.getIframe();
    await iframe
      .locator("//select[contains(@name,'supplier')]")
      .selectOption(department);
  }

  @step('Enter PZ basis')
  async enterPZBasis(comment: string) {
    const iframe = await this.getIframe();
    await iframe.locator('#middlePanel').click();
    await iframe.locator('.docDelivery').getByRole('textbox').fill(comment);
  }

  @step('Enter document comments')
  async enterComments() {
    const iframe = await this.getIframe();
    await iframe.locator('#middlePanel').click();
    await iframe
      .locator('.comments')
      .getByRole('textbox')
      .fill('Selenium test PZ without delivery');
  }

  @step('Enter first article')
  async enterFirstArticle(article: string) {
    const iframe = await this.getIframe();
    await iframe.locator('#middlePanel').click();
    await iframe
      .locator('td.nameOfGood')
      .getByRole('textbox')
      .first()
      .fill(article);
    await iframe.locator('#middlePanel').click();
    await iframe
      .locator('td.nameOfGood')
      .getByRole('button', { name: 'Wybierz' })
      .first()
      .click();
  }

  @step('Enter the quantity of the first article')
  async enterQuantityFirstArticle(quantity: number) {
    const iframe = await this.getIframe();
    await iframe.locator('#middlePanel').click();
    await iframe
      .locator('td.supplierQuantity')
      .getByRole('textbox')
      .first()
      .fill(`${quantity}`);
    await iframe.locator('#middlePanel').click();
    await iframe
      .locator('td.quantity')
      .getByRole('textbox')
      .first()
      .fill(`${quantity}`);
    await iframe.locator('#middlePanel').click();
  }
}
