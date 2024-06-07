import { type Locator, type Page } from "@playwright/test";

export class ProductDetails {
  readonly page: Page;
  readonly addToBagButton: Locator;
  readonly productDetailsModal: Locator;
  readonly increaseProductQuantityButton: Locator;
  readonly decreaseProductQuantityButton: Locator;
  readonly productDetailHeader: Locator;
  readonly productDetailParagraph: Locator;
  readonly guestAmountPlaceholder: Locator;
  readonly receiptNamePlaceholder: Locator;
  readonly productCalories: Locator;
  readonly productCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productDetailsModal = this.page.getByTestId("product-details-modal");
    this.addToBagButton = this.page.getByTestId("add-product-to-basket-button");
    this.increaseProductQuantityButton = this.page.locator(
      "button[aria-label='Increase the quantity by one']"
    );
    this.decreaseProductQuantityButton = this.page.locator(
      "button[aria-label='Decrease the quantity by one']"
    );
    this.productDetailHeader = this.page.locator(
      "//div[@id='Item-Detail-Header']"
    );
    this.productDetailParagraph = this.page.locator(
      "div[id='Item-Detail-Header'] p"
    );
    this.guestAmountPlaceholder = this.page.getByPlaceholder(
      "Enter Guest Amount Here"
    );
    this.receiptNamePlaceholder = this.page.getByPlaceholder(
      "Enter recipient (32 character limit)"
    );
    this.productCalories = this.page.locator("p[aria-live='polite']");
    this.productCloseButton = this.page.locator(
      "//div[@data-testid='product-details-modal']//button['1']"
    );
  }

  async clickAddProductToBasket() {
    await this.addToBagButton.click();
  }

  async selectEveryFirstOptions() {
    const optionGroupsLocator = this.page.getByTestId("option-group");
    const groupCount = await optionGroupsLocator.count();

    for (let i = 0; i < groupCount; i++) {
      const optionsLocator = optionGroupsLocator
        .nth(i)
        .getByTestId("option-container");
      const firstOptionInGroup = optionsLocator.nth(0);
      void firstOptionInGroup.scrollIntoViewIfNeeded();

      await firstOptionInGroup.click();
    }
  }
  async selectEverySecondOptions() {
    const optionGroupsLocator = this.page.getByTestId("option-group");
    const groupCount = await optionGroupsLocator.count();
    const optionsNamesArray: string[] = [];

    for (let i = 0; i < groupCount; i++) {
      const optionsLocator = optionGroupsLocator
        .nth(i)
        .getByTestId("option-container");
      const secondOptionInGroup = optionsLocator.nth(1);

      void secondOptionInGroup.scrollIntoViewIfNeeded();

      await secondOptionInGroup.click();
      const optionName = await secondOptionInGroup.innerText();

      optionsNamesArray.push(optionName);

      await this.page.waitForTimeout(3000);
    }
    return optionsNamesArray;
  }

  async increaseProductQuantity() {
    await this.increaseProductQuantityButton.click();
    await this.clickAddProductToBasket();
    await this.page.waitForTimeout(5000);
  }
  async decreaseproductQuantity() {
    await this.decreaseProductQuantityButton.click();
    await this.clickAddProductToBasket();
    await this.page.waitForTimeout(2000);
  }
  async selectProductWithRequiredOption() {
    await this.addToBagButton.click();

    const pageErrorHeader = this.page
      .getByText("Please make the required selection")
      .locator("xpath=..")
      .locator("xpath=..");

    const optionGroupsLocator = pageErrorHeader.getByTestId("option-group");
    const firstOptionInGroup = optionGroupsLocator
      .getByTestId("option-container")
      .nth(0);
    await this.page.waitForTimeout(2000);

    await firstOptionInGroup.click();
    await this.addToBagButton.click();
    const pageErrorHeaders = this.page.getByText(
      "Please make the required selection"
    );
    const errorTextCount = await pageErrorHeaders.count();

    for (let i = 0; i < errorTextCount; i++) {
      const dynamicFirstOptionInGroup = pageErrorHeaders
        .nth(i)
        .locator("xpath=..")
        .locator("xpath=..")
        .getByTestId("option-group")
        .getByTestId("option-container")
        .nth(0);

      await dynamicFirstOptionInGroup.click();
      await this.addToBagButton.click();
    }
  }

  async guestAmountAdd(guestAmount: string) {
    void this.guestAmountPlaceholder.scrollIntoViewIfNeeded();
    await this.guestAmountPlaceholder.type(guestAmount);
    await this.clickAddProductToBasket();
    await this.page.waitForTimeout(2000);
  }

  async receiptNameAdd(name: string) {
    void this.guestAmountPlaceholder.scrollIntoViewIfNeeded();
    await this.receiptNamePlaceholder.type(name);
    await this.clickAddProductToBasket();
    await this.page.waitForTimeout(2000);
  }

  async productDetailsPageClose() {
    await this.productCloseButton.nth(0).click();
  }
}
