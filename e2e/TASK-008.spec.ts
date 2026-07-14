import { test, expect } from "@playwright/test";

// Uses a separate, dedicated not-yet-onboarded test account (rather than the
// primary e2e account) since AuthGuard redirects onboarded users away from
// /onboarding entirely — this task's screen is only reachable pre-onboarding.
// Starts with a clean (logged-out) storage state, overriding the project
// default which reuses the primary account's saved session.
test.use({ storageState: { cookies: [], origins: [] } });

test("Step4Savings preview is labeled as an estimate, not the authoritative total", async ({
  page,
}) => {
  const email = process.env.TEST_ONBOARDING_USER_EMAIL;
  const password = process.env.TEST_ONBOARDING_USER_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "TEST_ONBOARDING_USER_EMAIL / TEST_ONBOARDING_USER_PASSWORD env vars are not set.",
    );
  }

  await page.goto("/login");
  await page.getByPlaceholder("you@example.com").fill(email);
  await page.getByPlaceholder("••••••••").fill(password);
  await page.getByText("Sign In", { exact: true }).click();

  // Step 1: Full Name + Country are required to continue.
  await page.getByPlaceholder("Enter your full name").waitFor({ timeout: 15_000 });
  await page.getByPlaceholder("Enter your full name").fill("E2E Test User");
  await page.getByText("India", { exact: true }).click();
  await page.getByText("Continue", { exact: false }).click();

  // Step 2: enter an income amount so totalIncome > 0 (Step4's preview only
  // renders when totalIncome > 0).
  await page.getByPlaceholder("Primary Salary").waitFor({ timeout: 10_000 });
  await page.getByPlaceholder("Primary Salary").fill("Primary Job");
  await page.locator('input[placeholder="0"]').first().fill("50000");
  await page.getByText("Continue", { exact: false }).click();

  // Step 3: skip credit cards.
  await page.getByText("Skip", { exact: false }).waitFor({ timeout: 10_000 });
  await page.getByText("Skip", { exact: false }).click();

  // Step 4: the screen under test.
  await expect(page.getByText("Set your savings goal")).toBeVisible({
    timeout: 10_000,
  });
  await page.locator('input[placeholder="0"]').first().fill("10000");

  // Acceptance criterion: no standalone "totalIncome - goal" figure presented
  // as the authoritative total — it must be labeled as an estimate.
  await expect(page.getByText("Estimated Available for Spending")).toBeVisible();
  await expect(page.getByText(/Estimate only/i)).toBeVisible();
  // The un-labeled "Available for Spending" (without "Estimated"/"Estimate")
  // must not exist as a standalone authoritative label.
  await expect(page.getByText("Available for Spending", { exact: true })).toHaveCount(0);
});
