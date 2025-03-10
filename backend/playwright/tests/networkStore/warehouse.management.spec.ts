import { test } from "../login.fixtures";
import Dashboard from "../../pages/dashboard";
import WarehouseManagementPage from "../../pages/networkStore/warehouse.management.page";

const article = process.env.ARTICLE ? process.env.ARTICLE : "126447";
const supplier = process.env.PZ_SUPPLIER ? process.env.PZ_SUPPLIER : "348";
const supplierDepartment = process.env.PZ_SUPPLIER_DEPARTMENT
  ? process.env.PZ_SUPPLIER_DEPARTMENT
  : "348D01";

test(`NetworStore create PZ without order and confirm`, async ({ page }) => {
  const dashboard = new Dashboard(page);
  const warehouseManagementPage = new WarehouseManagementPage(page);
  await dashboard.selectArticleMenu();
  await dashboard.selectWarehouseManagementMenu();
  await warehouseManagementPage.selectDeliveryMenu();
  await warehouseManagementPage.selectCreateNewDelivery();
  await warehouseManagementPage.selectPZWithoutOrder();
  await warehouseManagementPage.enterPZBasis("SeleniumTest");
  await warehouseManagementPage.selectSupplier(supplier);
  await warehouseManagementPage.selectSupplierDepartment(supplierDepartment);
  await warehouseManagementPage.enterComments();
  await warehouseManagementPage.enterFirstArticle(article);
  await warehouseManagementPage.enterQuantityFirstArticle(2);
  await dashboard.pressConfirmButton();
  await dashboard.isConfirm();
});
