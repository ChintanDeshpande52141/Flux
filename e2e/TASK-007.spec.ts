import { test, expect } from "@playwright/test";

function parseRupees(text: string): number {
  return Number(text.replace(/[₹,]/g, ""));
}

test("budget-settings breakdown either reconciles or surfaces the discrepancy", async ({
  page,
}) => {
  await page.getByText("Profile", { exact: true }).click();
  await page.getByText("Budget Settings", { exact: true }).click();

  await expect(page.getByText("Current Safe-to-Spend")).toBeVisible();

  const income = parseRupees(
    await page.getByText("Monthly Income").locator("..").locator("text=/₹/").textContent() ?? "0",
  );
  const bills = parseRupees(
    await page.getByText("– Fixed Bills").locator("..").locator("text=/₹/").textContent() ?? "0",
  );
  const savings = parseRupees(
    await page.getByText("– Savings Goal").locator("..").locator("text=/₹/").textContent() ?? "0",
  );
  const safeToSpendRow = parseRupees(
    await page.getByText("= Safe-to-Spend").locator("..").locator("text=/₹/").textContent() ?? "0",
  );

  const localSum = Math.round((income - bills - savings) * 100) / 100;
  const reconciles = Math.round(safeToSpendRow * 100) / 100 === localSum;

  const discrepancyBanner = page.getByText(
    "out of sync with your latest safe-to-spend",
  );
  const bannerVisible = await discrepancyBanner.isVisible().catch(() => false);

  // The core invariant from TASK-007: never show mismatched numbers as if
  // reconciled. Either they actually add up, or the discrepancy is surfaced.
  expect(reconciles || bannerVisible).toBe(true);

  // The "= Safe-to-Spend" row must always be the API value, never a separate
  // client-side recomputation — confirmed structurally since both this row
  // and the hero total are the same `safeToSpend` variable in the component.
  const heroAmount = parseRupees(
    (await page.locator("text=/^₹/").first().textContent()) ?? "0",
  );
  expect(heroAmount).toBe(safeToSpendRow);
});
