import { test as setup, expect } from "@playwright/test";

const authFile = "e2e/.auth/user.json";

setup("authenticate", async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "TEST_USER_EMAIL / TEST_USER_PASSWORD env vars are not set — " +
        "the dedicated e2e test account's credentials must be set persistently " +
        "before running the e2e suite.",
    );
  }

  await page.goto("/login");
  await page.getByPlaceholder("you@example.com").fill(email);
  await page.getByPlaceholder("••••••••").fill(password);
  await page.getByText("Sign In", { exact: true }).click();

  // Wait until the auth guard has moved us off the login screen.
  await expect(page).not.toHaveURL(/login/, { timeout: 15_000 });

  await page.context().storageState({ path: authFile });
});
