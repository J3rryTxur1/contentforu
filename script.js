/* =========================
   GENERATE
========================= */

const generateButton = $("#generate");

if (generateButton) {
  generateButton.addEventListener("click", async () => {

    if (!selectedFile) {
      show("အရင်ဆုံး Product ပုံတင်ပေးပါ");
      return;
    }

    const productName =
      $("#productName")?.value?.trim() || "";

    const price =
      $("#price")?.value?.trim() || "";

    const description =
      $("#description")?.value?.trim() || "";

    const audience = getActiveText(
      ".audience",
      "မြန်မာ Customer"
    );

    const tone = getActiveText(
      ".tone",
      "သဘာဝဆန်ဆန်"
    );

    const selectedStyle =
      $(".style.active")?.textContent?.trim() ||
      "Premium";

    const font =
      $(".font-row select")?.value ||
      "Noto Sans Myanmar";

    if (!productName) {
      show("Product Name ထည့်ပေးပါ");
      $("#productName")?.focus();
      return;
    }

    const originalText =
      generateButton.innerHTML;

    try {

      generateButton.disabled = true;

      generateButton.innerHTML =
        "⏳ AI က Product ကို ခွဲခြမ်းနေပါတယ်...";

      show(
        "AI ကို Product ပုံပို့နေပါတယ်..."
      );

      /* =========================
         IMAGE CONVERT
      ========================= */

      const imageData =
        await imageToDataURL(selectedFile);

      /* =========================
         UPDATE PREVIEW
      ========================= */

      updateDesignPreview({
        productName,
        price,
        description,
        style: selectedStyle
      });

      updateDesignPreviewImage(
        selectedFile
      );

      /* =========================
         API REQUEST
      ========================= */

      let response;

      try {

        response = await fetch(API_URL, {
          method: "POST",
          mode: "cors",
          cache: "no-store",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            imageData,
            productName,
            price,
            description,
            audience,
            tone,
            platform: "Facebook",
            designStyle: selectedStyle,
            font
          })
        });

      } catch (fetchError) {

        console.error(
          "FETCH FAILED:",
          fetchError
        );

        throw new Error(
          `API Fetch Failed: ${
            fetchError?.name || "Error"
          } - ${
            fetchError?.message ||
            "Unknown fetch error"
          }`
        );
      }

      /* =========================
         READ RESPONSE
      ========================= */

      let rawResponse = "";

      try {

        rawResponse =
          await response.text();

      } catch (readError) {

        console.error(
          "RESPONSE READ FAILED:",
          readError
        );

        throw new Error(
          `API Response Read Failed: ${
            readError?.message ||
            "Unknown response error"
          }`
        );
      }

      console.log(
        "API STATUS:",
        response.status
      );

      console.log(
        "API RAW RESPONSE:",
        rawResponse
      );

      /* =========================
         PARSE JSON
      ========================= */

      let result = null;

      if (rawResponse) {

        try {

          result =
            JSON.parse(rawResponse);

        } catch (jsonError) {

          console.error(
            "JSON PARSE ERROR:",
            jsonError
          );

          throw new Error(
            `API returned non-JSON response (${response.status}): ${rawResponse.slice(
              0,
              500
            )}`
          );
        }
      }

      /* =========================
         API ERROR
      ========================= */

      if (!response.ok) {

        const serverMessage =
          result?.error ||
          result?.message ||
          rawResponse ||
          `API Error (${response.status})`;

        throw new Error(
          `API ${response.status}: ${serverMessage}`
        );
      }

      /* =========================
         BACKEND SUCCESS FALSE
      ========================= */

      if (result?.success === false) {

        throw new Error(
          result?.error ||
          "Backend returned success:false"
        );
      }

      /* =========================
         EMPTY RESPONSE
      ========================= */

      if (!result) {

        throw new Error(
          "AI က အကြောင်းပြန်ချက်မရပါ"
        );
      }

      /* =========================
         SAVE AI CONTENT
      ========================= */

      generatedData = {

        caption:
          result.caption || "",

        short:
          result.short_caption || "",

        hashtags:
          result.hashtags || "",

        ad:
          result.ad_copy || "",

        product_highlights:
          Array.isArray(
            result.product_highlights
          )
            ? result.product_highlights
            : [],

        ctas:
          Array.isArray(result.ctas)
            ? result.ctas
            : []
      };

      /* =========================
         RENDER CONTENT
      ========================= */

      renderContent("caption");

      renderHighlights();

      /* =========================
         UPDATE DESIGN PREVIEW
      ========================= */

      updateDesignPreview({

        productName,
        price,
        description,

        highlights:
          generatedData.product_highlights,

        ctas:
          generatedData.ctas,

        style:
          selectedStyle
      });

      updateDesignPreviewImage(
        selectedFile
      );

      /* =========================
         MAIN CAPTION TAB
      ========================= */

      $$(".tab").forEach((tab) => {

        tab.classList.remove(
          "active"
        );

      });

      const captionTab =
        document.querySelector(
          '.tab[data-tab="caption"]'
        );

      if (captionTab) {

        captionTab.classList.add(
          "active"
        );
      }

      /* =========================
         SUCCESS
      ========================= */

      show(
        "✨ မြန်မာဈေးကွက်အတွက် AI Content ဖန်တီးပြီးပါပြီ"
      );

      /* =========================
         MOBILE SCROLL
      ========================= */

      const contentPanel =
        $(".content-panel");

      if (contentPanel) {

        setTimeout(() => {

          contentPanel.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }, 300);
      }

    } catch (error) {

      console.error(
        "GENERATE ERROR:",
        error
      );

      let message =
        error?.message ||
        "တစ်ခုခုမှားနေပါတယ်";

      /* =========================
         OPENAI KEY ERROR
      ========================= */

      if (
        message
          .toLowerCase()
          .includes("openai_api_key")
      ) {

        message =
          "Vercel မှာ OPENAI_API_KEY မတွေ့ပါ";
      }

      /* =========================
         IMPORTANT
         DO NOT HIDE REAL ERROR
      ========================= */

      show(
        "❌ " + message
      );

    } finally {

      generateButton.disabled =
        false;

      generateButton.innerHTML =
        originalText;
    }
  });
}
