import { test as base } from "@playwright/test";
import { Account } from "../pages/account";
import { Basket } from "../pages/basket";
import { Checkout } from "../pages/checkout";
import { Header } from "../pages/header";
import { StoreLocator } from "../pages/locators";
import { OrderConfirmation } from "../pages/orderConfirmation";
import { OrderHistory } from "../pages/orderHistory";
import { ProductDetails } from "../pages/productDetails";
import { Signin } from "../pages/signin";
import { Signup } from "../pages/signup";
import { Store } from "../pages/store";

/** The very base Fixture that is should be used to inherit from for creating other fixtures
 * {@url https://playwright.dev/docs/test-fixtures}
 * This fixture is used as lifecycle hooks for all tests: if can be used as beforeEach, afterEach
 * What goes before await use() is executed before each test
 * What goes after await use() is executed after each test
 *
 * createTestRailReport is a custom hook that is used to attach screenshots to the test in TestRail
 */
export const test = base.extend<{
  createTestRailReport: void;
  baseUrl: string;
  headerPage: Header;
  storeLocatorsPage: StoreLocator;
  storePage: Store;
  basketPage: Basket;
  checkoutPage: Checkout;
  orderConfirmationPage: OrderConfirmation;
  signUpPage: Signup;
  signInPage: Signin;
  productDetailsPage: ProductDetails;
  accountPage: Account;
  orderHistoryPage: OrderHistory;
}>({
  /**
    * custom hook that lets to attach screenshots to the test in TestRail report
    * auto: true - means that this fixture will be applied to all tests

    * We pass a tuple to specify fixtures options.
   */
  createTestRailReport: [
    async ({ page }, use, testInfo) => {
      // apply fixture logic to the test
      await use();

      // if the test failed, take a screenshot and attach it to the test
      if (testInfo.status !== testInfo.expectedStatus) {
        const screenshotPath = `./playwright-screenshots/screenshot-${Date.now()}.png`;

        await page.screenshot({ path: screenshotPath });

        testInfo.annotations.push({
          type: "testrail_attachment",
          description: screenshotPath,
        });
      }
    },
    { auto: true },
  ],
  /* Overriding baseURL from playwright.config.ts so we could use it in tests.
   * We also don't have to pass it as parameter for page.goto method when we want to navigate to the specific resource
   */
  baseURL: async ({}, use) => {
    await use(process.env.TEST_BASE_URL);
  },
  headerPage: async ({ page }, use) => {
    const headerPage = new Header(page);

    await use(headerPage);
  },
  storeLocatorsPage: async ({ page }, use) => {
    const storeLocatorsPage = new StoreLocator(page);

    await use(storeLocatorsPage);
  },
  storePage: async ({ page, productDetailsPage }, use) => {
    const storePage = new Store(page, productDetailsPage);

    await use(storePage);
  },
  basketPage: async ({ page, productDetailsPage }, use) => {
    const basketPage = new Basket(page, productDetailsPage);

    await use(basketPage);
  },
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new Checkout(page);

    await use(checkoutPage);
  },
  orderConfirmationPage: async ({ page }, use) => {
    const orderConfirmationPage = new OrderConfirmation(page);

    await use(orderConfirmationPage);
  },
  signUpPage: async ({ page, headerPage }, use) => {
    const signUpPage = new Signup(page, headerPage);

    await use(signUpPage);
  },
  signInPage: async ({ page, headerPage }, use) => {
    const signInPage = new Signin(page, headerPage);

    await use(signInPage);
  },
  productDetailsPage: async ({ page }, use) => {
    const productDetailsPage = new ProductDetails(page);

    await use(productDetailsPage);
  },
  accountPage: async ({ page }, use) => {
    const accountPage = new Account(page);

    await use(accountPage);
  },
  orderHistoryPage: async ({ page }, use) => {
    const orderHistoryPage = new OrderHistory(page);

    await use(orderHistoryPage);
  },
});
