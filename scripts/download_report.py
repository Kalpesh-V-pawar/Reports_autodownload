import os
from playwright.sync_api import sync_playwright

def run():
    USERNAME = os.getenv("SITE_USER")
    PASSWORD = os.getenv("SITE_PASS")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(accept_downloads=True)
        page = context.new_page()

        # 1. Login
        page.goto("https://sopan.kpix.io/login")  # <-- replace with real URL
        page.fill('xpath=//*[@id="exampleInputEmail"]', USERNAME)
        page.fill('xpath=//*[@id="exampleInputPassword"]', PASSWORD)
        page.click('xpath=//*[@id="routeWrapperDiv"]/app-rdm-login/div/div/div/div[3]/div[1]/form/div[2]/button')
        page.wait_for_load_state("networkidle")

        # 2. Open Reports tab
        page.click('xpath=//*[@id="accordionSidebar"]/li[8]/a')

        # 3. Select asset
        page.click('xpath=//*[@id="dd-open"]/button')
        page.fill('xpath=//*[@id="liveDataSelectAsset"]/ng-select/div/div/div[2]/input', "21074")
        page.click('xpath=//*[@id="acb6e9c38878-36"]/span')

        # 4. Select report type
        page.click('xpath=//*[@id="report_type"]')
        page.click('xpath=//*[@id="report_type"]/option[2]')

        # 5. Enter duration
        page.click('xpath=//*[@id="custom"]/div[1]/form/app-date-range-picker/div/input')
        page.click('xpath=/html/body/div[2]/div[1]/ul/li[10]')

        # 6. Select properties
        page.fill('xpath=//*[@id="custom"]/div[1]/form/div[2]/ng-select/div/div/div[2]/input', "Property1")
        page.click('xpath=//*[@id="a3afc57cf506"]/div[1]/ul/li/a')

        # 7. Sampling checkbox
        page.click('xpath=//*[@id="checkbox"]')

        # 8. Duration dropdown (hour)
        page.click('xpath=//*[@id="samplingFormat"]')
        page.click('xpath=//*[@id="samplingFormat"]/option[3]')

        # 9. Search
        page.click('xpath=//*[@id="custom"]/div[1]/form/div[6]/button/em')

        # 10. Download CSV
        with page.expect_download() as download_info:
            page.click('xpath=//*[@id="custom"]/div[2]/h5/a/em')
        download = download_info.value
        download.save_as("reports/report.csv")

        browser.close()

if __name__ == "__main__":
    run()
