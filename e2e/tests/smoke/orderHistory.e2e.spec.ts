import { test, expect } from "@playwright/test";
import { registeredUser } from "../../data/common/user";
import { test as testWithFixture } from "../../fixtures/base";

test.describe("Reorder", () => {
  testWithFixture.beforeEach(async ({ page, signInPage, headerPage }) => {
    await page.goto(`/login`);

    await page.evaluate(() => window.localStorage.clear());

    await signInPage.signinUser(registeredUser);

    const url = page.url();

    expect(url).not.toContain("login");
    expect(url).toMatch(/\/$/);

    await headerPage.navigateToOrderHistory();
  });
  testWithFixture(
    `When user clicks on reorder should successfully navigates to checkout page and verify all the items are added`,
    async ({ orderHistoryPage, checkoutPage }) => {
      const expectedMenus = await orderHistoryPage.getMenuFromCart();
      const normalizedExpectedMenus = expectedMenus
        .map((item) => item.replace(/\s/g, ""))
        .join("");

      await orderHistoryPage.reorder();

      await expect(checkoutPage.menuListSection.nth(0)).toBeVisible();
      const actualMenus = await checkoutPage.getAllMenus();
      const normalizedActualMenus = actualMenus
        .map((item) => item.replace(/\s/g, ""))
        .join("");
      for (let i = 0; i < expectedMenus.length; i++) {
        await expect(normalizedActualMenus[i]).toBe(normalizedExpectedMenus[i]);
      }
    }
  );

  testWithFixture(
    `When user clicks on view recipt should successfully navigates to receipt page and shows the correct menu list`,
    async ({ orderHistoryPage, orderConfirmationPage }) => {
      const expectedMenus = await orderHistoryPage.getMenuFromCart();
      const normalizedExpectedMenus = expectedMenus
        .map((item) => item.replace(/\s/g, ""))
        .join("");
      await orderHistoryPage.navigateToReceiptPage();
      await expect(orderConfirmationPage.menuListSection.nth(0)).toBeVisible();
      const actualMenus = await orderConfirmationPage.getMenuItems();
      const normalizedActualMenus = actualMenus
        .map((item) => item.replace(/\s/g, ""))
        .join("");
      for (let i = 0; i < expectedMenus.length; i++) {
        await expect(normalizedActualMenus[i]).toBe(normalizedExpectedMenus[i]);
      }
    }
  );
});
