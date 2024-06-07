import { type Locator, type Page, expect } from "@playwright/test";

export class Header {
  readonly page: Page;

  readonly accountDropdownButton: Locator;
  readonly accountDropDownTitle: Locator;
  readonly accountDropdownFavouritesLink: Locator;
  readonly accountDropdownOrderHistoryLink: Locator;
  readonly accountDropdownAccountLink: Locator;
  readonly accountDropdownLogoutLink: Locator;
  readonly accountDropdownClose: Locator;
  readonly headerHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.accountDropdownButton = this.page.getByLabel(
      "Click to view more Account links"
    );
    this.accountDropDownTitle = page.locator("#account-menu-label");
    this.accountDropdownFavouritesLink = page.getByLabel(
      "Go to Favorites page"
    );
    this.accountDropdownOrderHistoryLink = page.getByLabel(
      "Go to Order History page"
    );
    this.accountDropdownAccountLink = page.getByLabel("Go to Account page");
    this.accountDropdownLogoutLink = page.getByLabel("Click to Sign Out");
    this.accountDropdownClose = page.getByLabel(
      "Click to close Close dropdown"
    );
    this.headerHomeButton = page.getByTestId("nav-logo-link");
  }

  async navigateToAccount() {
    await this.accountDropdownButton.click();
    expect(this.accountDropDownTitle).toBeVisible();
    await this.accountDropdownAccountLink.click();
    await this.page.waitForURL(/account/);
  }

  async navigateToFavourites() {
    await this.accountDropdownButton.click();
    expect(this.accountDropDownTitle).toBeVisible();
    await this.accountDropdownFavouritesLink.click();
    await this.page.waitForURL(/favorites/);
  }

  async navigateToOrderHistory() {
    await this.accountDropdownButton.click();
    expect(this.accountDropDownTitle).toBeVisible();
    await this.accountDropdownOrderHistoryLink.click();
    await this.page.waitForURL(/order-history/);
  }

  async signOutUser() {
    await this.accountDropdownButton.click();
    expect(this.accountDropDownTitle).toBeVisible();
    await this.accountDropdownLogoutLink.click();
  }

  async closeAccountDropdown() {
    await this.accountDropdownButton.click();
    expect(this.accountDropDownTitle).toBeVisible();
    await this.accountDropdownClose.click();
  }
}
