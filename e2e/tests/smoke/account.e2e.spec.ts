import { test, expect } from "@playwright/test";
import { registeredUser2 } from "../../data/common/user";
import { test as testWithFixture } from "../../fixtures/base";
import { generateRandomString, generateRandomUSPhoneNumber } from "../../utils";

test.describe("Account", () => {
  testWithFixture.beforeEach(async ({ page, signInPage, headerPage }) => {
    await page.goto(`/login`);

    await page.evaluate(() => window.localStorage.clear());

    await signInPage.signinUser(registeredUser2);

    const url = page.url();

    expect(url).not.toContain("login");
    expect(url).toMatch(/\/$/);

    await headerPage.navigateToAccount();
  });

  testWithFixture(
    `Verify email should be static and phone number should be editable`,
    async ({ accountPage }) => {
      await accountPage.clickEditInfo();
      await expect(accountPage.emailField).toBeDisabled();
      await expect(accountPage.phoneNumberField).toBeEditable();
    }
  );

  testWithFixture(
    `Should update Contact Information when user input all the valid information and verify updated Contact Information is displaying`,
    async ({ accountPage }) => {
      const firstName = generateRandomString(5);
      const lastName = generateRandomString(6);
      const phone = generateRandomUSPhoneNumber();
      // Format the phone number as (XXX) XXX-XXXX
      const formattedPhoneNumber = `(${phone.slice(0, 3)}) ${phone.slice(
        3,
        6
      )}-${phone.slice(6)}`;
      await accountPage.clickEditInfo();
      const toastReceive = await accountPage.updateUserInfo(
        firstName,
        lastName,
        phone
      );
      expect(toastReceive).toContain("Your profile was successfully updated!");
      await expect(accountPage.contactInformationBlock).toContainText(
        firstName
      );
      await expect(accountPage.contactInformationBlock).toContainText(lastName);
      await expect(accountPage.contactInformationBlock).toContainText(
        formattedPhoneNumber
      );
    }
  );

  testWithFixture(
    `Should transfer user to the Store Menu page when user hit the order now from fav location card`,
    async ({ page, accountPage }) => {
      await accountPage.navigateToStoreFromFavouriteLocation();

      const url = page.url();
      expect(url).not.toContain("account");
    }
  );

  testWithFixture(
    `Should update favourite location when user edit Favourite Location on account page`,
    async ({ accountPage }) => {
      const locationName = await accountPage.editFavouriteLocation();
      expect(accountPage.favouriteLocationName.textContent).not.toBe(
        locationName
      );
    }
  );

  testWithFixture(
    `Should update password successfully when user change the login password`,
    async ({ accountPage }) => {
      const toastReceived = await accountPage.changeLoginPassword(
        registeredUser2.password,
        registeredUser2.password
      );
      expect(toastReceived).toContain("Your profile was successfully updated!");
    }
  );
});
