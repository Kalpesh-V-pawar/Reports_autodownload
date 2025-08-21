from playwright.sync_api import sync_playwright
import os, time

def run():
    SITE_USER = os.getenv("SITE_USER")
    SITE_PASS = os.getenv("SITE_PASS")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("Navigating to login page...")
        page.goto("https://sopan.kpix.io/login", wait_until="networkidle")

        try:
            # Try CSS selector first (simpler)
            page.wait_for_selector("#exampleInputEmail", timeout=60000)
            page.fill("#exampleInputEmail", SITE_USER)
            page.fill("#exampleInputPassword", SITE_PASS)

        except Exception as e:
            print("⚠️ Login field not found. Dumping HTML for debugging...")
            html = page.content()
            with open("reports/debug_login.html", "w", encoding="utf-8") as f:
                f.write(html)
            raise e

        # Continue login
        page.click("button[type=submit]")
        page.wait_for_load_state("networkidle")

        print("✅ Logged in. Continuing to report download...")

        # TODO: Add navigation to report & download logic here

        context.close()
        browser.close()

if __name__ == "__main__":
    run()
