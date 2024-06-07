import { type FullConfig } from "@playwright/test";
import axios from "axios";
import { type BrandConfig } from "e2e/types";

async function globalSetup(config: FullConfig) {
  console.log("================ Global Setup START ================");

  const { baseURL } = config.projects[0].use;

  // NODE variable takes priority
  process.env.TEST_BASE_URL = process.env.TEST_BASE_URL ?? baseURL;

  let brand = "koala-labs";

  try {
    if (process.env.BRAND && process.env.GITHUB_PAT) {
      const brandConfigs = await axios.get<BrandConfig[]>(
        "https://raw.githubusercontent.com/koala-labs/koala-version-scraper/main/lib/brand-sites.json",
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: `token ${process.env.GITHUB_PAT}`,
          },
        }
      );

      const brandConfig = brandConfigs?.data.find(
        (brand) => brand.id === process.env.BRAND
      );
      const environment = (
        process.env.ENVIRONMENT ? process.env.ENVIRONMENT : "SANDBOX"
      ).toLowerCase();
      const baseUrl = brandConfig?.ordering?.find(
        (env) => env.env === environment
      )?.url;

      process.env.TEST_BASE_URL = baseUrl;
      brand = process.env.BRAND;
    } else {
      console.log(
        "\t GITHUB_PAT or BRAND is not provided - default settings are used for test run"
      );
    }
  } catch (error) {
    throw error;
  }

  console.log("\t BRAND:", brand);
  console.log("\t BASE URL:", process.env.TEST_BASE_URL);
  console.log("================ Global Setup END ================");
}

export default globalSetup;
