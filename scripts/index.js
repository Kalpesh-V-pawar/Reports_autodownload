const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // ----------------------------
  // Step 0: Go to login page
  // ----------------------------
  console.log("➡️ Navigating to login page...");
  await page.goto("https://sopan.kpix.io/login", { waitUntil: "networkidle2" });

  // ----------------------------
  // Step 1: Fill login
  // ----------------------------
  console.log("✅ Filling login credentials...");
  await page.type("input[name='username'], input[type='text'], #username", "kalpesh.pawar@sopan.co.in");
  await page.type("input[name='password'], input[type='password'], #password", "Kalpesh@20019");

  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2" }),
    page.click("button[type='submit'], .login-btn, input[type='submit']"),
  ]);

  console.log("➡️ Logged in successfully, going to Reports page...");
  await page.goto("https://sopan.kpix.io/applications/SopanCMS/reports", { waitUntil: "networkidle2" });

  // ----------------------------
  // Step 2: Type asset number
// ----------------------------
  // Step 2: Open asset dropdown & type asset
  // ----------------------------
  console.log("📌 Typing asset number...");
  const assetInputSelector = "#liveDataSelectAsset input";
  
  // Wait for input
  await page.waitForSelector(assetInputSelector, { timeout: 20000 });
  await page.click(assetInputSelector);
  await page.type(assetInputSelector, "21074", { delay: 100 });
  
  // Wait for dropdown options (retry for robustness)
  let option = null;
  for (let i = 0; i < 3; i++) {
    try {
      option = await page.waitForSelector("ng-dropdown-panel .ng-option", { timeout: 5000 });
      if (option) break;
    } catch (e) {
      console.log(`⏳ Retry ${i + 1}: No dropdown yet, typing again...`);
      await page.click(assetInputSelector, { clickCount: 3 });
      await page.type(assetInputSelector, "21074", { delay: 100 });
    }
  }
  
  if (option) {
    console.log("✅ Selecting first asset option...");
    await option.click();
  } else {
    throw new Error("❌ Asset dropdown options never appeared!");
  }



  // ----------------------------
  // Step 3: Select report type
  // ----------------------------
  console.log("📑 Selecting report type...");
  await page.waitForSelector("#report_type");
  await page.select(
    "#report_type",
    await page.$eval("#report_type option:nth-child(2)", (o) => o.value)
  );

  // ----------------------------
  // Step 4: Pick date
  // ----------------------------
  console.log("📅 Picking date...");
  const dateInputSel = "#custom form app-date-range-picker input";
  await page.waitForSelector(dateInputSel);
  await page.click(dateInputSel);
  await page.waitForTimeout(1500);
  const dateOptionSel = "body > div:nth-of-type(2) ul li:nth-child(10)";
  if (await page.$(dateOptionSel)) await page.click(dateOptionSel);

  // ----------------------------
  // Step 5: Select property
  // ----------------------------
  console.log("⌨️ Selecting property...");
  const propInputSel = "#custom form div:nth-of-type(2) ng-select div div div:nth-of-type(2) input";
  await page.waitForSelector(propInputSel);
  await page.type(propInputSel, "Some Property", { delay: 100 });
  await page.waitForTimeout(1500);

  if (await page.$("ng-dropdown-panel .ng-option")) {
    await page.click("ng-dropdown-panel .ng-option");
  }

  // ----------------------------
  // Step 6: Check sampling
  // ----------------------------
  console.log("☑️ Checking sampling...");
  const samplingSel = "#checkbox";
  if (await page.$(samplingSel)) {
    const isChecked = await page.$eval(samplingSel, (el) => el.checked);
    if (!isChecked) await page.click(samplingSel);
  }

  // ----------------------------
  // Step 7: Select duration
  // ----------------------------
  console.log("⏱ Selecting duration...");
  await page.waitForSelector("#samplingFormat");
  await page.select(
    "#samplingFormat",
    await page.$eval("#samplingFormat option:nth-child(3)", (o) => o.value)
  );

  // ----------------------------
  // Step 8: Click search
  // ----------------------------
  console.log("🔍 Clicking search...");
  const searchBtnSel = "#custom form div:nth-of-type(6) button em";
  if (await page.$(searchBtnSel)) {
    await page.click(searchBtnSel);
    await page.waitForTimeout(20000);
  }

  // ----------------------------
  // Step 9: Download CSV
  // ----------------------------
  console.log("⬇️ Clicking CSV Download...");
  const csvBtnSel = "#custom div:nth-of-type(2) h5 a em";
  const csvBtn = await page.$(csvBtnSel);

  if (csvBtn) {
    const downloadPath = path.resolve("./downloads");
    if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath);
    await page._client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath,
    });
    await csvBtn.click();
    await page.waitForTimeout(5000);
  }

  console.log("✅ Automation complete, CSV saved to ./downloads");
  await browser.close();
})();
