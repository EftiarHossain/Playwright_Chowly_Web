import { type Locator, type Page } from "@playwright/test";
import { type ProductDetails } from "../pages/productDetails";
import { getNumberFromString, waitForPageToLoad } from "../utils";

export class Store {
  readonly page: Page;

  readonly basketButton: Locator;

  readonly popularProductsWidget: Locator;

  readonly menuNavigation: Locator;

  readonly productDetailsPage: ProductDetails;
  readonly searchProduct: Locator;
  readonly firstSearchOption: Locator;
  readonly pdpHeader: Locator;
  readonly noSearchResult: Locator;
  readonly dietaryPreferences: Locator;
  readonly updatePreferenceButton: Locator;
  readonly basketItem: Locator;
  readonly productOptionNamesInBasket: Locator;
  readonly menuCategories: Locator;
  readonly confirmationModalRemoveButton: Locator;
  readonly emptyCartText: Locator;

  readonly basketItemHeader: Locator;

  currentSelectedCategoryName?: string | null;
  currentSelectedProductName?: string | null;

  constructor(page: Page, productDetailsPage: ProductDetails) {
    this.page = page;
    this.productDetailsPage = productDetailsPage;

    this.basketButton = this.page.getByTestId("basket-button");

    this.popularProductsWidget = this.page.getByTestId("popular-items-widget");

    this.menuNavigation = this.page.getByTestId("menu-navigation");
    this.searchProduct = this.page.getByPlaceholder("Search Menu").nth(1);
    this.firstSearchOption = this.page.locator("//li[1]//button[1]");
    this.pdpHeader = this.page.locator("#Item-Detail-Header");
    this.noSearchResult = this.page.locator("//div[@aria-live='polite']");
    this.dietaryPreferences = this.page.locator("Dietary Preferences");
    this.updatePreferenceButton = this.page.locator(
      "//button[normalize-space()='Update Preferences']"
    );
    this.basketItem = this.page.locator(
      "//button[@data-testid='basket-item-label']"
    );
    this.productOptionNamesInBasket = this.page.locator(
      "//div[@data-testid='basket-item']//div[1]//div[2]//span[1]"
    );
    this.menuCategories = this.page.getByTestId("menu-navigation-category");
    this.confirmationModalRemoveButton = this.page.locator(
      "//button[normalize-space()='Remove']"
    );
    this.emptyCartText = this.page.locator(
      "//h2[normalize-space()='Your cart is empty']"
    );
    this.basketItemHeader = this.page.locator(
      ".koala__ui-side_cart-items-header-h3"
    );
  }

  async clickOnMenuProductCard({ cardPosition }: { cardPosition: number }) {
    await waitForPageToLoad(this.page);
    const index = cardPosition - 1;
    const allCards = this.page.getByTestId("menu-product-card");
    const card = allCards.nth(index);

    await card.waitFor();

    await card.scrollIntoViewIfNeeded();

    await card.click();
  }

  async getNumberOfItemsDisplayedOnBasket(): Promise<number> {
    const beforeBasketContent = await this.basketButton.innerText();
    const numberOfItemsInBasket = getNumberFromString(beforeBasketContent);

    return numberOfItemsInBasket ?? 0;
  }

  async clickBasketButton() {
    await this.basketButton.click();
  }

  async clickOnPopularProductCard({ cardPosition }: { cardPosition: number }) {
    await waitForPageToLoad(this.page);

    const index = cardPosition - 1;

    const allCards = this.popularProductsWidget.getByTestId(
      "popular-items-widget-card"
    );

    const card = allCards.nth(index);

    await card.waitFor();

    await card.click();
  }

  async addPopularProductToBasket({
    productPosition,
  }: {
    productPosition: number;
  }) {
    await waitForPageToLoad(this.page);
    await this.clickOnPopularProductCard({ cardPosition: productPosition });
    await this.productDetailsPage.selectEveryFirstOptions();
    await this.productDetailsPage.clickAddProductToBasket();
  }

  async addMenuProductToBasket({
    productPosition,
  }: {
    productPosition: number;
  }) {
    await waitForPageToLoad(this.page);
    await this.clickOnMenuProductCard({ cardPosition: productPosition });
    await this.productDetailsPage.selectEveryFirstOptions();
    await this.productDetailsPage.clickAddProductToBasket();
  }

  async clickOnCategory({ categoryPosition }: { categoryPosition: number }) {
    const index = categoryPosition - 1;

    const allCategories = this.menuNavigation.getByTestId(
      "menu-navigation-category"
    );
    const category = allCategories.nth(index);

    this.currentSelectedCategoryName = await category.textContent();
    await category.waitFor();
    await category.click();
  }
  async searchForProduct() {
    await this.page.waitForTimeout(5000);
    await this.searchProduct.click();
  }
  async clickProductFromSearchResult() {
    await this.firstSearchOption.click();
  }
  async openProductFromBasket() {
    await this.basketButton.click();
    await this.basketItem.click();
  }
}
