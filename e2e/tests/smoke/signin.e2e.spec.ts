import { expect, test } from "@playwright/test";
import { registeredUser } from "../../data/common/user";
import { test as testWithFixture } from "../../fixtures/base";

test.describe("Signin", () => {
  testWithFixture.beforeEach(async ({ page }) => {
    await page.goto(`/login`);

    await page.evaluate(() => window.localStorage.clear());
  });

  testWithFixture(
    `should successfully sign in user with the following fields: email, password`,
    async ({ page, signInPage }) => {
      await signInPage.signinUser(registeredUser);
      // check that user gets navigated away

      const url = page.url();

      //NOTE: i could not use toHaveUrl() here because it returns "" when running tests headless
      expect(url).not.toContain("login");
      expect(url).toMatch(/\/$/);
    }
  );
});
