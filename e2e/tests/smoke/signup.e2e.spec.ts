import { test, expect } from "@playwright/test";
import { signupUserWithZipAndTerms } from "../../data/common/user";
import { test as testWithFixture } from "../../fixtures/base";

test.describe("Signup", () => {
  testWithFixture.beforeEach(async ({ page }) => {
    await page.goto(`/sign-up`);

    await page.evaluate(() => window.localStorage.clear());
  });

  testWithFixture(
    `should successfully sign up user with the following fields: first, last names, zip code, password, email, favorite location, phone`,
    async ({ page, signUpPage }) => {
      await signUpPage.signupUser(signupUserWithZipAndTerms);

      const url = page.url();

      //NOTE: i could not use toHaveUrl() here because it returns "" when running tests headless
      expect(url).not.toContain("sign-up");
      expect(url).toMatch(/\/$/);
    }
  );
});
