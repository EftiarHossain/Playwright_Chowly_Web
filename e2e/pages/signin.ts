import { type Locator, type Page } from "@playwright/test";
import { type Header } from "../pages/header";
import { waitForPageToLoad } from "../utils";
import { type User } from "e2e/types";

export class Signin {
  readonly page: Page;
  readonly headerPage: Header;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signinButton: Locator;

  constructor(page: Page, headerPage: Header) {
    this.page = page;
    this.headerPage = headerPage;

    this.emailInput = page.getByPlaceholder("Email");
    this.passwordInput = page.getByPlaceholder("Password");
    this.signinButton = page.getByTestId("signin-button");
  }

  async signinUser(user: User) {
    await waitForPageToLoad(this.page);

    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);

    await this.signinButton.click();

    await waitForPageToLoad(this.page);

    await this.headerPage.accountDropdownButton.waitFor({ state: "visible" });
  }
}
