(function () {
  console.log("⏳ Content script running...");


  // ✅ Step 0: Redirect if on root domain
  if (window.location.hostname === "sopan.kpix.io" && window.location.pathname === "/") {
    console.log("➡️ On root domain, redirecting to login...");
    window.location.href = "https://sopan.kpix.io/login";
    return; // stop here after redirect
  }

  function fillAndLogin() {
    // Detect login page
    if (window.location.href.includes("/login")) {
      console.log("✅ Login page detected...");

      // Select username & password fields
      const usernameInput = document.querySelector("input[name='username'], input[type='text'], #username");
      const passwordInput = document.querySelector("input[name='password'], input[type='password'], #password");
      const loginButton = document.querySelector("button[type='submit'], .login-btn, input[type='submit']");

      if (usernameInput && passwordInput && loginButton) {
        console.log("✅ Found login elements...");

        // Set values and trigger input events
        usernameInput.value = "kalpesh.pawar@sopan.co.in";
        usernameInput.dispatchEvent(new Event("input", { bubbles: true }));

        passwordInput.value = "Kalpesh@20019";
        passwordInput.dispatchEvent(new Event("input", { bubbles: true }));

        // Small delay before clicking login
        setTimeout(() => {
          console.log("🔘 Clicking login...");
          loginButton.click();

          // ✅ After login, automatically go to Reports page
          setTimeout(() => {
            console.log("➡️ Redirecting to Reports page...");
            window.location.href = "https://sopan.kpix.io/applications/SopanCMS/reports";
          }, 4000); // give 4s for login to finish
        }, 1000);
      } else {
        console.log("❌ Could not find username/password/login button!");
      }
    }
  }

  // --- Reports download logic ---
  let reportsHandled = false; // ✅ Global flag

  function handleReportsDownload() {
    if (reportsHandled) return; // ✅ Prevent running again
    if (window.location.href.includes("/applications/SopanCMS/reports")) {
      console.log("📂 Reports page detected...");

      // Step 1: Open asset dropdown
      const assetDropdown = document.evaluate(
        '//*[@id="dd-open"]/button',
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
      ).singleNodeValue;

      if (assetDropdown) {
        console.log("📌 Opening asset dropdown...");
        assetDropdown.click();
      }

      reportsHandled = true; // ✅ run only once
    




      // Step 3: Select report type
      setTimeout(() => {
        const reportType = document.evaluate(
          '//*[@id="report_type"]',
          document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        if (reportType) {
          console.log("📑 Selecting report type...");
          const option = document.evaluate(
            '//*[@id="report_type"]/option[2]',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
          ).singleNodeValue;
          if (option) option.selected = true;
          reportType.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }, 4000);

      // Step 4: Pick a date
      setTimeout(() => {
        const dateBox = document.evaluate(
          '//*[@id="custom"]/div[1]/form/app-date-range-picker/div/input',
          document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        if (dateBox) {
          console.log("📅 Opening date picker...");
          dateBox.click();
          setTimeout(() => {
            const dateOption = document.evaluate(
              '/html/body/div[2]/div[1]/ul/li[10]',
              document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
            ).singleNodeValue;
            if (dateOption) {
              console.log("📌 Selecting date...");
              dateOption.click();
            }
          }, 1500);
        }
      }, 6000);

      // ===== Step 5: Select properties (robust) =====
      setTimeout(() => {
        const propBox = document.evaluate(
          '//*[@id="custom"]/div[1]/form/div[2]/ng-select/div/div/div[2]/input',
          document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;

        if (!propBox) {
          console.log("❌ Property input not found (Step 5)");
          return;
        }

        console.log("⌨️ Typing property...");
        propBox.value = "Some Property"; // <-- change this to the property text you expect
        propBox.dispatchEvent(new Event("input", { bubbles: true }));

        // Wait & select from dropdown
        setTimeout(() => {
          const candidates = Array.from(
            document.querySelectorAll(
              "ng-dropdown-panel div.ng-option, ng-dropdown-panel ul li a, .ng-dropdown-panel .ng-option"
            )
          );

          if (candidates.length > 0) {
            console.log("📌 Found property options, clicking first one...");
            candidates[0].click(); // ✅ clicks the first visible option
          } else {
            console.log("❌ No property options found in dropdown!");
          }
        }, 1500);
      }, 7500);
      // ===== end Step 5 =====


      // Step 6: Check sampling
      setTimeout(() => {
        const samplingCheck = document.evaluate(
          '//*[@id="checkbox"]',
          document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        if (samplingCheck && !samplingCheck.checked) {
          console.log("☑️ Checking sampling box...");
          samplingCheck.click();
        }
      }, 8500);

      // Step 7: Select duration (hour)
      setTimeout(() => {
        const durationBox = document.evaluate(
          '//*[@id="samplingFormat"]',
          document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        if (durationBox) {
          console.log("⏱ Selecting sampling duration...");
          const option = document.evaluate(
            '//*[@id="samplingFormat"]/option[3]',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
          ).singleNodeValue;
          if (option) option.selected = true;
          durationBox.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }, 9500);

      // Step 8: Click search
      setTimeout(() => {
        const searchBtn = document.evaluate(
          '//*[@id="custom"]/div[1]/form/div[6]/button/em',
          document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        if (searchBtn) {
          console.log("🔍 Clicking search...");
          searchBtn.click();
        }
      }, 11000);

      // Step 9: Download CSV
      setTimeout(() => {
        const csvBtn = document.evaluate(
          '//*[@id="custom"]/div[2]/h5/a/em',
          document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        if (csvBtn) {
          console.log("⬇️ Clicking CSV Download...");
          csvBtn.click();
        }
      }, 31000);



      // Step 2: Type asset number
      // ===== REPLACE Step 2: Type asset number & select first option (robust) =====
      setTimeout(() => {
        const assetInput = document.evaluate(
          '//*[@id="liveDataSelectAsset"]/ng-select/div/div/div[2]/input',
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;

        if (!assetInput) {
          console.log("❌ asset input not found (Step 2)");
          return;
        }

        console.log("⌨️ Typing asset number...");
        assetInput.value = "21074";
        assetInput.dispatchEvent(new Event("input", { bubbles: true }));

        // helper: is element visible
        function isVisible(el) {
          if (!el) return false;
          const r = el.getBoundingClientRect();
          return !!(r.width || r.height) && window.getComputedStyle(el).visibility !== "hidden" && el.offsetParent !== null;
        }

        // polling function to find first visible option
        (async function waitAndSelectOption(timeoutMs = 6000, pollInterval = 250) {
          const start = Date.now();
          const selectors = [
            'ng-dropdown-panel .ng-option',
            '.ng-dropdown-panel .ng-option',
            'ng-dropdown-panel div.ng-option span',
            'div.ng-dropdown-panel div.ng-option',
            '.ng-option',
            'div[role="option"]'  // generic
          ];

          while (Date.now() - start < timeoutMs) {
            // gather candidates
            let candidates = [];
            for (const sel of selectors) {
              try {
                const list = Array.from(document.querySelectorAll(sel));
                if (list.length) candidates = candidates.concat(list);
              } catch (e) { /* ignore invalid selectors */ }
            }

            // filter visible candidates
            const visible = candidates.filter(isVisible);
            if (visible.length > 0) {
              console.log("📌 Found dropdown options, clicking first visible one:", visible[0]);
              visible[0].click();
              return true;
            }

            // sometimes the dropdown options are not direct children — also try searching by text nodes inside panels
            const panelSpans = Array.from(document.querySelectorAll('ng-dropdown-panel span, .ng-dropdown-panel span'));
            const vis2 = panelSpans.filter(isVisible);
            if (vis2.length > 0) {
              console.log("📌 Found dropdown spans, clicking first:", vis2[0]);
              vis2[0].click();
              return true;
            }

            // wait and retry
            await new Promise(r => setTimeout(r, pollInterval));
          }

          // fallback: try keyboard navigation (ArrowDown + Enter)
          console.log("⚠️ Options not found by DOM query — trying keyboard navigation fallback");
          try {
            assetInput.focus();
            assetInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            assetInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            // give time for selection to apply
            await new Promise(r => setTimeout(r, 500));
            // verify if selection occurred: try to detect dropdown closed or an element showing selection
            return true;
          } catch (e) {
            console.log("❌ Keyboard fallback failed:", e);
            return false;
          }
        })();
      }, 2000);
      // ===== end replacement =====




 
    }
  }

  // Run login detection
  setTimeout(fillAndLogin, 2000);
  let interval = setInterval(fillAndLogin, 5000);

  // Run reports automation detection
  setInterval(handleReportsDownload, 4000);
})();
