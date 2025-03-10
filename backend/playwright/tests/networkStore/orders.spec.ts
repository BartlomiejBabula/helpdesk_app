import { test } from '../login.fixtures';
import Dashboard from '../../pages/dashboard';
import NetworkOrdersPage from '../../pages/networkStore/orders.page';
import { step } from '../helpers/step';

const supplier = process.env.SUPPLIER ? process.env.SUPPLIER : '9793';

test(`NetworStore create full order and send`, async ({ page }) => {
  const dashboard = new Dashboard(page);
  const networkOrdersPage = new NetworkOrdersPage(page);
  await dashboard.selectArticleMenu();
  await dashboard.selectOrdersMenu();
  await networkOrdersPage.selectCreateNewOrder();
  await networkOrdersPage.selectFullOrder();
  await networkOrdersPage.selectSupplier(supplier);
  await dashboard.pressConfirmButton();
  await networkOrdersPage.refreshForOrder();
  await networkOrdersPage.enterOrder();
  await networkOrdersPage.enterComments('SeleniumTest');
  await networkOrdersPage.enterQuantityFirstArticle(2);
  await networkOrdersPage.sendOrder();
  await networkOrdersPage.isSent();
});
