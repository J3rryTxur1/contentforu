const API_URL = "https://contentforu-api.vercel.app/api/generate";

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const toast = $("#toast");
const fileInput = $("#fileInput");
const fileInfo = $("#fileInfo");

let selectedFile = null;

let generatedData = {
  caption: "",
  short: "",
  hashtags: "",
  ad: "",
  product_highlights: [],
  ctas: []
};

function show(message) {
  if (toast) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.__toastTimer);

    window.__toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);
  }
}

function getActiveText(selector, fallback = "") {
  const element = document.querySelector(
    `${selector}.active`
  );

  return element
    ? element.textContent.trim()
    : fallback;
}

function imageToDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(
        new Error("No image selected.")
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(
        new Error("Unable to read image.")
      );
    };

    reader.readAsDataURL(file);
  });
}

function updateDesignPreviewImage(file) {
  if (!file) return;

  const url = URL.createObjectURL(file);

  const previewImages =
    document.querySelectorAll(
      "[data-product-image]"
    );

  previewImages.forEach((img) => {
    img.src = url;
    img.style.display = "block";
  });

  const preview =
    document.querySelector(
      ".design-preview img"
    );

  if (preview) {
    preview.src = url;
    preview.style.display = "block";
  }
}

function updateDesignPreview(data = {}) {
  const {
    productName = "",
    price = "",
    description = "",
    highlights = [],
    ctas = [],
    style = "Premium"
  } = data;

  const nameElements =
    document.querySelectorAll(
      "[data-product-name]"
    );

  nameElements.forEach((el) => {
    el.textContent =
      productName || "Product";
  });

  const priceElements =
    document.querySelectorAll(
      "[data-product-price]"
    );

  priceElements.forEach((el) => {
    el.textContent =
      price || "";
  });

  const descriptionElements =
    document.querySelectorAll(
      "[data-product-description]"
    );

  descriptionElements.forEach((el) => {
    el.textContent =
      description || "";
  });

  const styleElements =
    document.querySelectorAll(
      "[data-design-style]"
    );

  styleElements.forEach((el) => {
    el.textContent = style;
  });

  const highlightContainer =
    document.querySelector(
      "[data-product-highlights]"
    );

  if (highlightContainer) {
    highlightContainer.innerHTML =
      "";

    const list =
      Array.isArray(highlights)
        ? highlights
        : [];

    list.slice(0, 6).forEach((item) => {
      const div =
        document.createElement("div");

      div.textContent =
        "✦ " + item;

      highlightContainer.appendChild(
        div
      );
    });
  }

  const ctaContainer =
    document.querySelector(
      "[data-product-cta]"
    );

  if (
    ctaContainer &&
    Array.isArray(ctas) &&
    ctas.length
  ) {
    ctaContainer.textContent =
      ctas[0];
  }
}

function renderContent(type = "caption") {
  const contentBox =
    document.querySelector(
      "#contentText"
    ) ||
    document.querySelector(
      ".content-text"
    ) ||
    document.querySelector(
      "[data-content]"
    );

  if (!contentBox) return;

  let text = "";

  if (type === "caption") {
    text =
      generatedData.caption || "";
  }

  if (type === "short") {
    text =
      generatedData.short || "";
  }

  if (type === "hashtags") {
    text =
      generatedData.hashtags || "";
  }

  if (type === "ad") {
    text =
      generatedData.ad || "";
  }

  contentBox.textContent =
    text;
}

function renderHighlights() {
  const container =
    document.querySelector(
      "#highlights"
    ) ||
    document.querySelector(
      ".highlights"
    ) ||
    document.querySelector(
      "[data-highlights]"
    );

  if (!container) return;

  container.innerHTML = "";

  const items =
    Array.isArray(
      generatedData.product_highlights
    )
      ? generatedData.product_highlights
      : [];

  items.forEach((item) => {
    const div =
      document.createElement("div");

    div.textContent =
      "✦ " + item;

    container.appendChild(div);
  });
}

/* =========================
   FILE UPLOAD
========================= */

if (fileInput) {
  fileInput.addEventListener(
    "change",
    async (event) => {

      const file =
        event.target.files?.[0];

      if (!file) return;

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        show(
          "❌ Image file ပဲရွေးပေးပါ"
        );

        fileInput.value = "";
        return;
      }

      selectedFile = file;

      if (fileInfo) {
        fileInfo.textContent =
          file.name;
      }

      updateDesignPreviewImage(
        selectedFile
      );

      show(
        "✅ Product ပုံထည့်ပြီးပါပြီ"
      );
    }
  );
}

/* =========================
   REMOVE IMAGE
========================= */

const removeButtons =
  document.querySelectorAll(
    "[data-remove-image]"
  );

removeButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      selectedFile = null;

      if (fileInput) {
        fileInput.value = "";
      }

      if (fileInfo) {
        fileInfo.textContent =
          "";
      }

      show(
        "Product ပုံကို ဖယ်ရှားပြီးပါပြီ"
      );
    }
  );

});

/* =========================
   AUDIENCE
========================= */

$$(".audience").forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        $$(".audience").forEach(
          (item) =>
            item.classList.remove(
              "active"
            )
        );

        button.classList.add(
          "active"
        );
      }
    );

  }
);

/* =========================
   TONE
========================= */

$$(".tone").forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        $$(".tone").forEach(
          (item) =>
            item.classList.remove(
              "active"
            )
        );

        button.classList.add(
          "active"
        );
      }
    );

  }
);

/* =========================
   DESIGN STYLE
========================= */

$$(".style").forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        $$(".style").forEach(
          (item) =>
            item.classList.remove(
              "active"
            )
        );

        button.classList.add(
          "active"
        );

        updateDesignPreview({
          productName:
            $("#productName")
              ?.value
              ?.trim() || "",

          price:
            $("#price")
              ?.value
              ?.trim() || "",

          description:
            $("#description")
              ?.value
              ?.trim() || "",

          style:
            button.textContent.trim()
        });
      }
    );

  }
);

/* =========================
   DESIGN VARIATIONS
========================= */

$$(".variation").forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        $$(".variation").forEach(
          (item) =>
            item.classList.remove(
              "active"
            )
        );

        button.classList.add(
          "active"
        );
      }
    );

  }
);

/* =========================
   CONTENT TABS
========================= */

$$(".tab").forEach(
  (tab) => {

    tab.addEventListener(
      "click",
      () => {

        $$(".tab").forEach(
          (item) =>
            item.classList.remove(
              "active"
            )
        );

        tab.classList.add(
          "active"
        );

        const type =
          tab.dataset.tab ||
          "caption";

        renderContent(type);
      }
    );

  }
);

/* =========================
   COPY CONTENT
========================= */

const copyButtons =
  document.querySelectorAll(
    "[data-copy]"
  );

copyButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      async () => {

        const type =
          button.dataset.copy ||
          "caption";

        let text = "";

        if (type === "caption") {
          text =
            generatedData.caption;
        }

        if (type === "short") {
          text =
            generatedData.short;
        }

        if (type === "hashtags") {
          text =
            generatedData.hashtags;
        }

        if (type === "ad") {
          text =
            generatedData.ad;
        }

        if (!text) {
          show(
            "ကူးယူစရာ Content မရှိသေးပါ"
          );
          return;
        }

        try {

          await navigator.clipboard.writeText(
            text
          );

          show(
            "✅ Content ကူးပြီးပါပြီ"
          );

        } catch (error) {

          console.error(error);

          show(
            "❌ Copy မလုပ်နိုင်ပါ"
          );
        }

      }
    );

  }
);

/* =========================
   GENERATE
========================= */

const generateButton =
  $("#generate");

if (generateButton) {

  generateButton.addEventListener(
    "click",
    async () => {

      if (!selectedFile) {

        show(
          "အရင်ဆုံး Product ပုံတင်ပေးပါ"
        );

        return;
      }

      const productName =
        $("#productName")
          ?.value
          ?.trim() || "";

      const price =
        $("#price")
          ?.value
          ?.trim() || "";

      const description =
        $("#description")
          ?.value
          ?.trim() || "";

      const audience =
        getActiveText(
          ".audience",
          "မြန်မာ Customer"
        );

      const tone =
        getActiveText(
          ".tone",
          "သဘာဝဆန်ဆန်"
        );

      const selectedStyle =
        $(".style.active")
          ?.textContent
          ?.trim() ||
        "Premium";

      const font =
        $(".font-row select")
          ?.value ||
        "Noto Sans Myanmar";

      if (!productName) {

        show(
          "Product Name ထည့်ပေးပါ"
        );

        $("#productName")
          ?.focus();

        return;
      }

      const originalText =
        generateButton.innerHTML;

      try {

        generateButton.disabled =
          true;

        generateButton.innerHTML =
          "⏳ AI က Product ကို ခွဲခြမ်းနေပါတယ်...";

        show(
          "AI ကို Product ပုံပို့နေပါတယ်..."
        );

        const imageData =
          await imageToDataURL(
            selectedFile
          );

        updateDesignPreview({
          productName,
          price,
          description,
          style:
            selectedStyle
        });

        updateDesignPreviewImage(
          selectedFile
        );

        let response;

        try {

          response =
            await fetch(
              API_URL,
              {
                method: "POST",

                mode: "cors",

                cache: "no-store",

                headers: {
                  "Content-Type":
                    "application/json"
                },

                body:
                  JSON.stringify({
                    imageData,
                    productName,
                    price,
                    description,
                    audience,
                    tone,
                    platform:
                      "Facebook",
                    designStyle:
                      selectedStyle,
                    font
                  })
              }
            );

        } catch (fetchError) {

          console.error(
            "FETCH FAILED:",
            fetchError
          );

          throw new Error(
            `API Fetch Failed: ${
              fetchError?.name ||
              "Error"
            } - ${
              fetchError?.message ||
              "Unknown fetch error"
            }`
          );
        }

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

        let result = null;

        if (rawResponse) {

          try {

            result =
              JSON.parse(
                rawResponse
              );

          } catch (
            jsonError
          ) {

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

        if (
          result?.success ===
          false
        ) {

          throw new Error(
            result?.error ||
            "Backend returned success:false"
          );
        }

        if (!result) {

          throw new Error(
            "AI က အကြောင်းပြန်ချက်မရပါ"
          );
        }

        generatedData = {

          caption:
            result.caption ||
            "",

          short:
            result.short_caption ||
            "",

          hashtags:
            result.hashtags ||
            "",

          ad:
            result.ad_copy ||
            "",

          product_highlights:
            Array.isArray(
              result.product_highlights
            )
              ? result.product_highlights
              : [],

          ctas:
            Array.isArray(
              result.ctas
            )
              ? result.ctas
              : []
        };

        renderContent(
          "caption"
        );

        renderHighlights();

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

        $$(".tab").forEach(
          (tab) => {

            tab.classList.remove(
              "active"
            );

          }
        );

        const captionTab =
          document.querySelector(
            '.tab[data-tab="caption"]'
          );

        if (captionTab) {

          captionTab.classList.add(
            "active"
          );
        }

        show(
          "✨ မြန်မာဈေးကွက်အတွက် AI Content ဖန်တီးပြီးပါပြီ"
        );

        const contentPanel =
          $(".content-panel");

        if (contentPanel) {

          setTimeout(() => {

            contentPanel.scrollIntoView({
              behavior:
                "smooth",

              block:
                "start"
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

        if (
          message
            .toLowerCase()
            .includes(
              "openai_api_key"
            )
        ) {

          message =
            "Vercel မှာ OPENAI_API_KEY မတွေ့ပါ";
        }

        show(
          "❌ " + message
        );

      } finally {

        generateButton.disabled =
          false;

        generateButton.innerHTML =
          originalText;
      }
    }
  );
}

/* =========================
   INITIAL CONTENT
========================= */

if (
  typeof renderContent ===
  "function"
) {
  renderContent(
    "caption"
  );
}

if (
  typeof renderHighlights ===
  "function"
) {
  renderHighlights();
}

updateDesignPreview({

  productName:
    $("#productName")
      ?.value
      ?.trim() || "",

  price:
    $("#price")
      ?.value
      ?.trim() || "",

  description:
    $("#description")
      ?.value
      ?.trim() || "",

  style:
    $(".style.active")
      ?.textContent
      ?.trim() ||
    "Premium"
});
