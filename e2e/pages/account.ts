import { type Locator, type Page, expect } from "@playwright/test";
import { waitForPageToLoad } from "../utils";

export class Account {
  readonly page: Page;

  readonly contactInfoForm: Locator;
  readonly contactInfoTitle: Locator;
  readonly contactInformationBlock: Locator;
  readonly editContactInfoButton: Locator;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly phoneNumberField: Locator;
  readonly emailField: Locator;
  readonly submitContactInfoButton: Locator;
  readonly cancelContactInfoEditButton: Locator;
  readonly favouriteLocationCard: Locator;
  readonly favouriteLocationCrudButton: Locator;
  readonly editFavouriteLocationButton: Locator;
  readonly favouriteLocationDropdown: Locator;
  readonly favouriteLocationDialog: Locator;
  readonly favouriteLocationEditSubmit: Locator;
  readonly favouriteLocationEditCancel: Locator;
  readonly favouriteLocationName: Locator;
  readonly favouriteCardOrderNowButton: Locator;
  readonly currentPasswordField: Locator;
  readonly newPasswordField: Locator;
  readonly confirmPasswordField: Locator;
  readonly submitChangePassword: Locator;
  readonly savedAddressBlock: Locator;
  readonly savedAddressFirstAdddressBlock: Locator;
  readonly savedAddressActionButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.contactInfoForm = page.getByTestId("contact-info-form");
    this.contactInfoTitle = page.getByText("Contact Information");
    this.contactInformationBlock = page.locator(
      '//*[@id="start-of-content"]/div/div/div/div[2]/div[1]/div[2]/div/div'
    );
    this.editContactInfoButton = page.getByText("Edit Your Info");
    this.firstNameField = this.contactInfoForm.locator("#first_name");
    this.lastNameField = this.contactInfoForm.locator("#last_name");
    this.phoneNumberField = this.contactInfoForm.locator("#phone");
    this.emailField = this.contactInfoForm.locator("#email");
    this.submitContactInfoButton = this.contactInfoForm.getByText("Submit");
    this.cancelContactInfoEditButton = this.contactInfoForm.getByText("Cancel");
    this.favouriteLocationCard = page.getByTestId("location-card-container");
    this.favouriteLocationCrudButton =
      this.favouriteLocationCard.getByRole("button");
    this.editFavouriteLocationButton = this.favouriteLocationCard.locator(
      "//div[contains(text(),'Edit Favorite Location')]"
    );
    this.favouriteLocationDialog = page.getByRole("dialog");
    this.favouriteLocationDropdown =
      this.favouriteLocationDialog.getByRole("combobox");
    this.favouriteLocationEditCancel = this.favouriteLocationDialog.locator(
      "//button[contains(text(),'Cancel')]"
    );
    this.favouriteLocationEditSubmit = this.favouriteLocationDialog.locator(
      "//button[contains(text(),'Save')]"
    );
    this.favouriteLocationName =
      this.favouriteLocationCard.getByLabel("Location name");
    this.favouriteCardOrderNowButton = this.favouriteLocationCard.getByTestId(
      "link-button-pickup-order"
    );
    this.currentPasswordField = page.locator("#current_password");
    this.newPasswordField = page.locator("#password");
    this.confirmPasswordField = page.locator("#password_confirmation");
    this.submitChangePassword = page.locator(
      "//button[contains(text(),'Submit')]"
    );
    this.savedAddressBlock = page.locator(
      "//body/div[1]/div[1]/div[1]/div[3]/div[1]/div[1]/div[1]/div[2]/div[3]"
    );
    this.savedAddressFirstAdddressBlock = this.savedAddressBlock.locator(
      "//body/div[1]/div[1]/div[1]/div[3]/div[1]/div[1]/div[1]/div[2]/div[3]/div[2]"
    );
    this.savedAddressActionButton =
      this.savedAddressFirstAdddressBlock.getByRole("button");
  }

  async clickEditInfo() {
    await waitForPageToLoad(this.page);
    await this.editContactInfoButton.click();
  }

  async updateUserInfo(firstName: string, lastName: string, phone: string) {
    await this.firstNameField.focus();
    await this.firstNameField.fill(firstName);
    await this.lastNameField.focus();
    await this.lastNameField.fill(lastName);
    await this.phoneNumberField.focus();
    await this.phoneNumberField.fill(phone);
    await this.submitContactInfoButton.click();
    const toastSelector = "#Global-Toast";
    await this.page.waitForSelector(toastSelector);
    const toastText = await this.page.textContent(toastSelector);
    return toastText;
  }

  async editFavouriteLocation() {
    await waitForPageToLoad(this.page);
    const locationName = await this.favouriteLocationName.textContent();
    await this.favouriteLocationCrudButton.click();
    await this.editFavouriteLocationButton.click();
    expect(this.favouriteLocationDropdown).toBeVisible();
    const randomNumber = Math.floor(Math.random() * 7);
    await this.favouriteLocationDropdown.selectOption({ index: randomNumber });
    const disabled = await this.favouriteLocationEditSubmit.isDisabled();
    if (disabled) {
      const secondRandomNumber = Math.floor(Math.random() * 7);
      await this.favouriteLocationDropdown.selectOption({
        index: secondRandomNumber,
      });
    }
    await this.favouriteLocationEditSubmit.click();
    return locationName;
  }

  async navigateToStoreFromFavouriteLocation() {
    await waitForPageToLoad(this.page);
    const locationName = await this.favouriteLocationName.textContent();
    await this.favouriteCardOrderNowButton.click();
    await this.page.waitForURL(/store/);
    return locationName;
  }

  async changeLoginPassword(password: string, newPassword: string) {
    await waitForPageToLoad(this.page);
    await this.currentPasswordField.fill(password);
    await this.newPasswordField.fill(newPassword);
    await this.confirmPasswordField.fill(newPassword);
    await this.submitChangePassword.click();
    const toastSelector = "#Global-Toast";
    const toastText = await this.page.textContent(toastSelector);
    return toastText;
  }
}
