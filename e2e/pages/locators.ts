import { type Locator, type Page, expect } from "@playwright/test";
import { waitForPageToLoad } from "../utils";

export class StoreLocator {
  readonly page: Page;

  readonly locatorsListSection: Locator;
  readonly searchLocationsInput: Locator;
  readonly searchLocationsButton: Locator;
  readonly viewAllLocationsButton: Locator;
  readonly deliveryButton: Locator;
  readonly pickupButton: Locator;
  readonly searchDeliveryAddressInput: Locator;

  currentCard?: Locator;
  currentLocationName?: string | null;
  currentLocationAddress?: string | null;
  currentLocationPhone?: string | null;

  constructor(page: Page) {
    this.page = page;

    this.locatorsListSection = this.page.getByTestId("locators-list-section");
    this.searchLocationsInput = this.page.locator("#address");
    this.searchLocationsButton = this.page.getByTestId(
      "search-address-submit-button"
    );
    this.viewAllLocationsButton = this.page.getByTestId(
      "view-all-locations-link"
    );
    this.deliveryButton = this.page.getByRole("tab", { name: "Delivery" });
    this.pickupButton = this.page.getByRole("tab", { name: "Pickup" });
    this.searchDeliveryAddressInput = this.page.locator(
      "[id^='autocomplete-delivery-address']"
    );
  }

  async selectCard(cardPosition: number) {
    const index = cardPosition - 1;
    const allCards = await this.getAllLocationCards();
    const card = allCards.nth(index);

    await card.waitFor();
    await card.scrollIntoViewIfNeeded();

    this.currentCard = card;

    this.currentLocationAddress = await this.currentCard
      .getByTestId("locations-card-address-container")
      .textContent();

    this.currentLocationName = await this.currentCard
      .getByRole("heading")
      .textContent();

    this.currentLocationPhone = await this.currentCard
      .getByTestId("location-phone")
      .textContent();
  }

  async clickOnLocationCardOrderNowCTA({
    cardPosition,
  }: {
    cardPosition: number;
  }) {
    await this.selectCard(cardPosition);

    const orderNowButtonLocator = this.currentCard?.getByTestId(
      "link-button-pickup-order"
    );

    if (orderNowButtonLocator) {
      await orderNowButtonLocator.click();
      await this.page.waitForURL(/store/);
    } else {
      throw new Error("orderNowButtonLocator is undefined.");
    }
  }

  async clickOnLocationCardOrderDeliveryCTA({
    cardPosition,
    delivery,
  }: {
    cardPosition: number;
    delivery: { day: number; timeslot: number };
  }) {
    await this.selectCard(cardPosition);

    const orderDeliveryButtonLocator =
      this.currentCard?.getByText("Order Delivery");

    if (orderDeliveryButtonLocator) {
      await orderDeliveryButtonLocator.click();

      const orderDeliveryDateWanted = this.page.locator("#day_wanted");
      await orderDeliveryDateWanted.selectOption({ index: delivery.day });

      const orderDeliveryTimeWanted = this.page.locator("#time_wanted");
      await orderDeliveryTimeWanted.selectOption({ index: delivery.timeslot });

      const orderDeliveryAddressInputField =
        this.page.getByPlaceholder("Enter your address");
      await orderDeliveryAddressInputField.focus();

      const address = this.currentLocationAddress;
      if (address !== null && address !== undefined) {
        await orderDeliveryAddressInputField.type(address, { delay: 200 });
        await this.page.keyboard.press("ArrowDown");
        await this.page.keyboard.press("Enter");
      } else {
        throw new Error(
          "currentLocationAddress is null or undefined. Unable to type."
        );
      }

      const orderContinueButton = this.page.getByTestId("delivery_form_submit");
      await orderContinueButton.click();

      await this.page.waitForURL(/store/);
    } else {
      throw new Error("orderDeliveryButtonLocator is undefined.");
    }
  }

  async searchLocationsByGivenAddress(address: string) {
    await waitForPageToLoad(this.page);

    await this.searchLocationsInput.fill(address);

    await this.searchLocationsButton.click();

    await this.locatorsListSection.waitFor();

    await expect(this.locatorsListSection).toBeVisible();
  }

  async clickOnViewAllLocations() {
    await waitForPageToLoad(this.page);

    await this.viewAllLocationsButton.click();

    await waitForPageToLoad(this.page);

    await expect(this.locatorsListSection).toBeVisible();
  }

  async getAllCollapsedLocationCards() {
    const cardsLocator = this.locatorsListSection.getByRole("region");

    // Wait for the first card to be visible
    await cardsLocator.nth(1).waitFor();

    return cardsLocator;
  }

  async getAllLocationCards() {
    const cardsLocator = this.locatorsListSection.getByTestId(
      "location-card-container"
    );

    // Wait for the first card to be visible
    await cardsLocator.nth(1).waitFor();

    return cardsLocator;
  }

  async searchDeliveryByGivenAddress(address: string) {
    await this.deliveryButton.click();

    await this.searchDeliveryAddressInput.waitFor();

    await this.searchDeliveryAddressInput.focus();

    // For some reason we need to have to wait for the page to load here - my assumption is that we need to wait for the autocomplete script to load
    await waitForPageToLoad(this.page);

    // simulate user typing
    await this.searchDeliveryAddressInput.type(address, { delay: 200 });

    // select first available autocomplete option
    await this.page.keyboard.press("ArrowDown");
    await this.page.keyboard.press("Enter");

    await this.page.waitForURL(/store/);
  }

  /**
   * Searches for locations by changing the search radius value and ensures the selected
   * radius value is different from the default value.
   *
   * @param {number} value - The index of the option to select as the new search radius.
   * @returns {Promise<void>} - Resolves once the search radius is changed and validated.
   * @throws {Error} - If the selected radius value is the same as the default value.
   */
  async searchLocationsByChangingRadius(value: number) {
    /**
     * Changes the search radius by selecting an option from the dropdown.
     * @type {import('playwright').Locator}
     */
    const searchRadius = this.page.locator("#search-radius");
    await searchRadius.selectOption({
      index: value,
    });

    /**
     * Retrieves the selected value from the search radius dropdown.
     * @type {string}
     */
    const selectedValue = await searchRadius.evaluate(
      (element) => (element as HTMLSelectElement).value
    );

    //check selected value is not equal the default value
    expect(selectedValue).not.toBe("10");
  }

  async searchLocationsByDefaultRadius() {
    const searchRadius = this.page.locator("#search-radius");
    await searchRadius.waitFor();

    const defaultValue = await searchRadius.evaluate(
      (element) => (element as HTMLSelectElement).value
    );

    // Assert the defaultValue
    expect(defaultValue).toBe("10");
  }

  /**
   * Simulates a click-and-hold interaction on the map, slides the mouse to a new position,
   * and triggers a search action within the interacted map area.
   *
   * @returns {Promise<void>} - Resolves once the interaction and search action are completed.
   * @throws {Error} - If the map element is not found or if the map bounding box is not available.
   */
  async clickHoldAndSearchFromMap() {
    const mouse = this.page.mouse;

    // Wait for the page to load completely
    await waitForPageToLoad(this.page);

    // Get the map element
    const mapElement = this.page.getByRole("region");

    // Wait for the map element to be available
    await mapElement.waitFor();

    // Get the bounding box of the map
    const mapBoundingBox = await mapElement.boundingBox();

    // Check if the map element exists
    if (!mapElement) {
      throw new Error("Map element not found.");
    }

    // Check if the mapBoundingBox is not null before proceeding
    if (!mapBoundingBox) {
      throw new Error("Map bounding box not available.");
    }

    // Calculate the coordinates for the click-and-hold action (e.g., the center of the map)
    const x = mapBoundingBox.x + mapBoundingBox.width / 2;
    const y = mapBoundingBox.y + mapBoundingBox.height / 2;

    // Click and hold on the map at the calculated coordinates
    await mouse.move(x, y);
    await mouse.down();

    // Move the mouse (slide) to a new position
    const newX = x + 10; // Adjust the values to define the distance to slide horizontally
    const newY = y + 10; // Adjust the values to define the distance to slide vertically
    await mouse.move(newX, newY);

    // Release the mouse (stop holding and sliding)
    await mouse.up();

    // Verifying the search button appearance on the map after interaction
    const mapSearchButton = this.page.getByText("Search This Area");
    await mapSearchButton.waitFor();

    // Click on the search button on the map
    await mapSearchButton.click();

    await this.locatorsListSection.waitFor();

    await expect(this.locatorsListSection).toBeVisible();
  }
}
