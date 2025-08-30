const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'
  ],
});

  const page = await browser.newPage();

  // Set viewport
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
  // Step 2: Open asset dropdown & type asset
  // ----------------------------
  console.log("📌 Typing asset number...");
  const assetXPath = '//*[@id="liveDataSelectAsset"]/ng-select/div/div/div[2]/input';
  await page.waitForXPath(assetXPath, { timeout: 10000 });
  const [assetInput] = await page.$x(assetXPath);
  await assetInput.type("21074", { delay: 100 });

  // Wait & select first visible option
  await page.waitForTimeout(1500);
  const firstOptionXPath = '//ng-dropdown-panel//div[contains(@class,"ng-option")]';
  const [firstOption] = await page.$x(firstOptionXPath);
  if (firstOption) await firstOption.click();

  // ----------------------------
  // Step 3: Select report type
  // ----------------------------
  console.log("📑 Selecting report type...");
  const reportTypeXPath = '//*[@id="report_type"]';
  await page.waitForXPath(reportTypeXPath);
  const [reportType] = await page.$x(reportTypeXPath);
  if (reportType) {
    await page.select('#report_type', (await page.$eval('#report_type option:nth-child(2)', o => o.value)));
  }

  // ----------------------------
  // Step 4: Pick date
  // ----------------------------
  console.log("📅 Picking date...");
  const dateInputXPath = '//*[@id="custom"]/div[1]/form/app-date-range-picker/div/input';
  await page.waitForXPath(dateInputXPath);
  const [dateInput] = await page.$x(dateInputXPath);
  await dateInput.click();
  await page.waitForTimeout(1500);
  const dateOptionXPath = '/html/body/div[2]/div[1]/ul/li[10]';
  const [dateOption] = await page.$x(dateOptionXPath);
  if (dateOption) await dateOption.click();

  // ----------------------------
  // Step 5: Select property
  // ----------------------------
  console.log("⌨️ Selecting property...");
  const propXPath = '//*[@id="custom"]/div[1]/form/div[2]/ng-select/div/div/div[2]/input';
  await page.waitForXPath(propXPath);
  const [propInput] = await page.$x(propXPath);
  await propInput.type("Some Property", { delay: 100 });
  await page.waitForTimeout(1500);
  const propOptionXPath = '//ng-dropdown-panel//div[contains(@class,"ng-option")]';
  const [propOption] = await page.$x(propOptionXPath);
  if (propOption) await propOption.click();

  // ----------------------------
  // Step 6: Check sampling
  // ----------------------------
  const samplingCheckboxXPath = '//*[@id="checkbox"]';
  const [samplingCheckbox] = await page.$x(samplingCheckboxXPath);
  if (samplingCheckbox) {
    const isChecked = await page.evaluate(el => el.checked, samplingCheckbox);
    if (!isChecked) await samplingCheckbox.click();
  }

  // ----------------------------
  // Step 7: Select duration
  // ----------------------------
  const durationXPath = '//*[@id="samplingFormat"]';
  const [durationSelect] = await page.$x(durationXPath);
  if (durationSelect) {
    await page.select('#samplingFormat', (await page.$eval('#samplingFormat option:nth-child(3)', o => o.value)));
  }

  // ----------------------------
  // Step 8: Click search
  // ----------------------------
  const searchBtnXPath = '//*[@id="custom"]/div[1]/form/div[6]/button/em';
  const [searchBtn] = await page.$x(searchBtnXPath);
  if (searchBtn) {
    console.log("🔍 Clicking search...");
    await searchBtn.click();
    await page.waitForTimeout(20000); // wait for results to load
  }

  // ----------------------------
  // Step 9: Download CSV
  // ----------------------------
  const csvBtnXPath = '//*[@id="custom"]/div[2]/h5/a/em';
  const [csvBtn] = await page.$x(csvBtnXPath);
  if (csvBtn) {
    console.log("⬇️ Clicking CSV Download...");
    const downloadPath = path.resolve('./downloads');
    if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath);
    await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath });
    await csvBtn.click();
    await page.waitForTimeout(5000);
  }

  console.log("✅ Automation complete, CSV saved to ./downloads");
  await browser.close();
})();
