import { type Locator, type Page } from "@playwright/test";
import { type Header } from "../pages/header";
import { waitForPageToLoad } from "../utils";
import { type SignupUser } from "e2e/types";

export class Signup {
  readonly page: Page;
  readonly headerPage: Header;

  readonly emailInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly signupButton: Locator;

  zipInput?: Locator;
  referralCodeInput?: Locator;
  birthdayInput?: Locator;
  favoriteLocationSelect?: Locator;
  termAndConditionsCheckbox?: Locator;
  optInCheckbox?: Locator;

  constructor(page: Page, headerPage: Header) {
    this.page = page;
    this.headerPage = headerPage;

    this.firstNameInput = page.getByPlaceholder("First Name");
    this.lastNameInput = page.getByPlaceholder("Last Name");
    this.emailInput = page.getByPlaceholder("Email");
    this.passwordInput = page.getByPlaceholder("Password");
    this.phoneInput = page.getByPlaceholder("Phone Number");

    this.signupButton = page.getByTestId("signup-button");
  }

  async signupUser(user: SignupUser) {
    await waitForPageToLoad(this.page);

    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.emailInput.fill(user.email);
    await this.phoneInput.fill(user.phoneNumber);
    await this.passwordInput.fill(user.password);

    if (user.zipCode) {
      this.zipInput = this.page.getByPlaceholder("Zip Code");

      await this.zipInput.fill(user.zipCode);
    }

    if (user.birthday) {
      this.birthdayInput = this.page.getByPlaceholder("Birthday");

      await this.birthdayInput.fill(user.birthday);
    }

    if (user.referralCode) {
      this.referralCodeInput = this.page.getByPlaceholder(
        "Referral Code (optional)"
      );
      await this.referralCodeInput?.fill(user.referralCode);
    }

    if (user.favoriteLocation !== undefined) {
      this.favoriteLocationSelect = this.page.getByLabel(
        "favorite_location_id"
      );

      await this.favoriteLocationSelect?.selectOption({
        index: user.favoriteLocation,
      });
    }

    if (user.optIn !== undefined) {
      this.optInCheckbox = this.page.getByTestId("opt-in-checkbox");
      if (user.optIn) {
        await this.optInCheckbox.click();
      }
    }

    if (user.termsAndConditions !== undefined) {
      this.termAndConditionsCheckbox = this.page.getByTestId(
        "terms-and-conditions-checkbox"
      );

      if (user.termsAndConditions) {
        await this.termAndConditionsCheckbox.click();
      }
    }

    await this.signupButton.click();

    await waitForPageToLoad(this.page);

    await this.headerPage.accountDropdownButton.waitFor({ state: "visible" });
  }
}
