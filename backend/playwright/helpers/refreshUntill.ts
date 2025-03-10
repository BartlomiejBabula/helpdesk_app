import { expect, Page, Locator } from "@playwright/test";

export const refreshUntill = async (page: Page, expectLocator: Locator) => {
  for (let step = 0; step <= 30; step++) {
    await page
      .locator("#globalIFrame")
      .contentFrame()
      .getByRole("button", { name: "Odśwież" })
      .click();
    try {
      await expect(expectLocator).toBeVisible({ timeout: 2000 });
      break;
    } catch {
      await page.waitForTimeout(2000);
    }
  }
};
