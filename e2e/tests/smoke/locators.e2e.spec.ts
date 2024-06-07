import { test, expect } from "@playwright/test";
import { test as testWithFixture } from "../../fixtures/base";

test.describe("StoreLocator", () => {
  testWithFixture.beforeEach(async ({ page }) => {
    await page.goto(`/locations`);

    await page.evaluate(() => window.localStorage.clear());
  });

  testWithFixture(
    `should load all collapsed location cards after clicking on View All Locations`,
    async ({ storeLocatorsPage }) => {
      await storeLocatorsPage.clickOnViewAllLocations();

      const cardsLocator =
        await storeLocatorsPage.getAllCollapsedLocationCards();

      const count = await cardsLocator.count();

      expect(count).toBeGreaterThan(0);
    }
  );

  testWithFixture(
    "should load not collapsed location cards after typing valid zip code in search field",
    async ({ storeLocatorsPage }) => {
      await storeLocatorsPage.searchLocationsByGivenAddress("10001");

      const cardsLocator = await storeLocatorsPage.getAllLocationCards();

      const count = await cardsLocator.count();

      expect(count).toBeGreaterThan(0);
    }
  );

  testWithFixture(
    "Should load all the locations in 10 miles(default radius) area after typing valid zip code in search field",
    async ({ storeLocatorsPage }) => {
      await storeLocatorsPage.searchLocationsByGivenAddress("10001");

      await storeLocatorsPage.searchLocationsByDefaultRadius();

      const cardsLocator = await storeLocatorsPage.getAllLocationCards();

      const count = await cardsLocator.count();

      expect(count).toBeGreaterThan(0);
    }
  );

  testWithFixture(
    "Should load all the locations in 1 miles area after typing valid zip code in search field",
    async ({ storeLocatorsPage }) => {
      await storeLocatorsPage.searchLocationsByGivenAddress("10001");

      await storeLocatorsPage.searchLocationsByChangingRadius(0);

      const cardsLocator = await storeLocatorsPage.getAllLocationCards();

      const count = await cardsLocator.count();

      expect(count).toBeGreaterThan(0);
    }
  );

  testWithFixture(
    "Should verify map presence, interaction with map and load all the location by searching from the map",
    async ({ storeLocatorsPage }) => {
      await storeLocatorsPage.clickHoldAndSearchFromMap();

      const cardsLocator = await storeLocatorsPage.getAllLocationCards();

      const count = await cardsLocator.count();

      expect(count).toBeGreaterThan(0);
    }
  );

  testWithFixture(
    "should navigate to menu page when clicking Order Now from searched location",
    async ({ page, storeLocatorsPage }) => {
      await storeLocatorsPage.searchLocationsByGivenAddress("10004");

      await storeLocatorsPage.clickOnLocationCardOrderNowCTA({
        cardPosition: 1,
      });

      const url = page.url();

      expect(url).toContain("/store/");
    }
  );

  testWithFixture(
    "should navigate to menu page when clicking Order Delivery button and inputting delivery information from searched location",
    async ({ page, storeLocatorsPage }) => {
      await storeLocatorsPage.searchLocationsByGivenAddress("10004");

      await storeLocatorsPage.clickOnLocationCardOrderDeliveryCTA({
        cardPosition: 1,
        delivery: { day: 2, timeslot: 3 },
      });

      const url = page.url();

      expect(url).toContain("/store/");
    }
  );

  testWithFixture(
    "should navigate to menu page when searched delivery by valid address",
    async ({ page, storeLocatorsPage }) => {
      await storeLocatorsPage.searchDeliveryByGivenAddress("26 Broadway, NY");

      const url = page.url();

      expect(url).toContain("/store/");
    }
  );
});
