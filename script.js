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


/* =========================
   TOAST
========================= */

function show(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}


/* =========================
   SAFE HTML
========================= */

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================
   FILE SIZE
========================= */

function formatMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
}


/* =========================
   DESIGN PREVIEW IMAGE
========================= */

function updateDesignPreviewImage(file) {
  const previewImage = $("#previewProductImage");

  if (!previewImage || !file) return;

  const objectURL = URL.createObjectURL(file);

  previewImage.onload = () => {
    previewImage.style.display = "block";
    URL.revokeObjectURL(objectURL);
  };

  previewImage.onerror = () => {
    previewImage.style.display = "none";
    URL.revokeObjectURL(objectURL);
  };

  previewImage.src = objectURL;
}


/* =========================
   DESIGN PREVIEW
========================= */

function updateDesignPreview({
  productName = "",
  price = "",
  description = "",
  highlights = [],
  ctas = [],
  style = "Premium",
  variationTitle = ""
} = {}) {

  const previewName = $("#previewName");
  const previewPrice = $("#previewPrice");
  const previewDescription = $("#previewDescription");
  const previewFeatures = $("#previewFeatures");
  const previewCTA = $("#previewCTA");
  const previewTagline = $("#previewTagline");
  const previewTitle = $("#previewTitle");
  const preview = $("#designPreview");

  if (previewName) {
    previewName.textContent =
      productName || "PRODUCT NAME";
  }

  if (previewPrice) {
    previewPrice.textContent = price || "";
    previewPrice.style.display =
      price ? "block" : "none";
  }

  if (previewDescription) {

    const cleanDescription =
      String(description || "").trim();

    previewDescription.textContent =
      cleanDescription.length > 95
        ? cleanDescription.slice(0, 92) + "..."
        : cleanDescription ||
          "Product ပုံတင်ပြီး Generate လုပ်ပါ";
  }

  if (previewFeatures) {

    const list =
      Array.isArray(highlights)
        ? highlights
            .filter(Boolean)
            .slice(0, 3)
        : [];

    previewFeatures.innerHTML =
      list.length
        ? list
            .map(
              item =>
                `✦ ${escapeHTML(item)}`
            )
            .join("<br>")
        : "✦ AI-generated product highlights";
  }

  if (previewCTA) {

    previewCTA.textContent =
      Array.isArray(ctas) && ctas[0]
        ? ctas[0]
        : "အခုပဲ မှာယူပါ";
  }

  if (previewTagline) {

    previewTagline.textContent =
      `${style || "Premium"} · Ready-to-post Design`;
  }

  if (variationTitle && previewTitle) {

    const lines =
      String(variationTitle)
        .split(/\s+/)
        .filter(Boolean);

    if (lines.length > 2) {

      const midpoint =
        Math.ceil(lines.length / 2);

      previewTitle.innerHTML =
        escapeHTML(
          lines.slice(0, midpoint).join(" ")
        ) +
        "<br>" +
        escapeHTML(
          lines.slice(midpoint).join(" ")
        );

    } else {

      previewTitle.textContent =
        variationTitle;
    }
  }

  if (preview) {

    preview.dataset.style =
      String(style || "Premium")
        .toLowerCase()
        .replace(/\s+/g, "-");
  }
}


/* =========================
   IMAGE PREVIEW
========================= */

if (fileInput) {

  fileInput.addEventListener(
    "change",
    async (e) => {

      const file =
        e.target.files?.[0];

      if (!file) return;


      if (!file.type.startsWith("image/")) {

        show("ပုံဖိုင်ပဲ ရွေးပေးပါ");

        fileInput.value = "";

        return;
      }


      if (file.size > 10 * 1024 * 1024) {

        show("ပုံဖိုင် 10MB အောက်ဖြစ်ရပါမယ်");

        fileInput.value = "";

        return;
      }


      selectedFile = file;


      const fileName =
        $("#fileName");

      const fileSize =
        $("#fileSize");

      const thumb =
        $("#thumb");


      if (fileName) {

        fileName.textContent =
          file.name;
      }


      if (fileSize) {

        fileSize.textContent =
          formatMB(file.size);
      }


      if (thumb) {

        const objectURL =
          URL.createObjectURL(file);

        thumb.style.backgroundImage =
          `url("${objectURL}")`;

        setTimeout(() => {

          URL.revokeObjectURL(
            objectURL
          );

        }, 5000);
      }


      if (fileInfo) {

        fileInfo.classList.remove(
          "hidden"
        );
      }


      updateDesignPreviewImage(file);


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
            ?.trim() || "Premium"
      });


      show(
        "Product ပုံထည့်ပြီးပါပြီ"
      );
    }
  );
}


/* =========================
   REMOVE IMAGE
========================= */

const removeFileButton =
  $("#removeFile");

if (removeFileButton) {

  removeFileButton.onclick = () => {

    selectedFile = null;


    if (fileInput) {

      fileInput.value = "";
    }


    if (fileInfo) {

      fileInfo.classList.add(
        "hidden"
      );
    }


    const previewImage =
      $("#previewProductImage");


    if (previewImage) {

      previewImage.removeAttribute(
        "src"
      );

      previewImage.style.display =
        "none";
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
          ?.trim() || "Premium"
    });


    show(
      "ပုံဖယ်ပြီးပါပြီ"
    );
  };
}


/* =========================
   DRAG & DROP
========================= */

const dropzone =
  $("#dropzone");

if (dropzone) {

  dropzone.ondragover =
    (e) => {

      e.preventDefault();

      dropzone.style.borderColor =
        "#745cff";
    };


  dropzone.ondragleave =
    () => {

      dropzone.style.borderColor =
        "";
    };


  dropzone.ondrop =
    (e) => {

      e.preventDefault();

      dropzone.style.borderColor =
        "";

      const file =
        e.dataTransfer?.files?.[0];

      if (!file) return;


      try {

        const dataTransfer =
          new DataTransfer();

        dataTransfer.items.add(file);

        fileInput.files =
          dataTransfer.files;

        fileInput.dispatchEvent(
          new Event("change")
        );

      } catch {

        selectedFile = file;


        updateDesignPreviewImage(
          file
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
            $(".style.active")
              ?.textContent
              ?.trim() || "Premium"
        });


        show(
          "Product ပုံထည့်ပြီးပါပြီ"
        );
      }
    };
}


/* =========================
   AUDIENCE
   CHOOSE ONLY ONE
========================= */

$$(".audience .chip")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        $$(".audience .chip")
          .forEach((item) => {

            item.classList.remove(
              "active"
            );
          });


        button.classList.add(
          "active"
        );
      }
    );
  });


/* =========================
   TONE
   CHOOSE ONLY ONE
========================= */

$$(".tone .chip")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        $$(".tone .chip")
          .forEach((item) => {

            item.classList.remove(
              "active"
            );
          });


        button.classList.add(
          "active"
        );
      }
    );
  });


/* =========================
   GET ACTIVE VALUE
========================= */

function getActiveText(
  selector,
  fallback
) {

  const active =
    document.querySelector(
      `${selector} .active`
    );


  if (!active) {

    return fallback;
  }


  return active.textContent.trim();
}


/* =========================
   DESIGN STYLE
========================= */

$$(".style")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        $$(".style")
          .forEach((item) => {

            item.classList.remove(
              "active"
            );
          });


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

          highlights:
            generatedData
              .product_highlights,

          ctas:
            generatedData.ctas,

          style:
            button.textContent.trim()
        });
      }
    );
  });


/* =========================
   DESIGN VARIATION
========================= */

$$(".variation")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        $$(".variation")
          .forEach((item) => {

            item.classList.remove(
              "active"
            );
          });


        button.classList.add(
          "active"
        );


        const title =
          button.innerText
            .replace(/\n/g, " ")
            .trim();


        const previewTitle =
          $("#previewTitle");


        if (
          previewTitle &&
          title
        ) {

          const parts =
            title.split(/\s+/);

          if (parts.length > 2) {

            const middle =
              Math.ceil(
                parts.length / 2
              );

            previewTitle.innerHTML =
              escapeHTML(
                parts
                  .slice(0, middle)
                  .join(" ")
              ) +
              "<br>" +
              escapeHTML(
                parts
                  .slice(middle)
                  .join(" ")
              );

          } else {

            previewTitle.textContent =
              title;
          }
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

          highlights:
            generatedData
              .product_highlights,

          ctas:
            generatedData.ctas,

          style:
            $(".style.active")
              ?.textContent
              ?.trim() || "Premium",

          variationTitle:
            title
        });
      }
    );
  });


/* =========================
   IMAGE -> DATA URL
   RESIZE + COMPRESS
========================= */

async function imageToDataURL(file) {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();


      reader.onload = () => {

        const image =
          new Image();


        image.onload = () => {

          try {

            const maxSize =
              1600;


            let width =
              image.width;

            let height =
              image.height;


            if (
              width > maxSize ||
              height > maxSize
            ) {

              const ratio =
                Math.min(
                  maxSize / width,
                  maxSize / height
                );


              width =
                Math.round(
                  width * ratio
                );

              height =
                Math.round(
                  height * ratio
                );
            }


            const canvas =
              document.createElement(
                "canvas"
              );


            canvas.width =
              width;

            canvas.height =
              height;


            const ctx =
              canvas.getContext(
                "2d"
              );


            if (!ctx) {

              reject(
                new Error(
                  "Canvas is not supported"
                )
              );

              return;
            }


            ctx.fillStyle =
              "#ffffff";

            ctx.fillRect(
              0,
              0,
              width,
              height
            );


            ctx.drawImage(
              image,
              0,
              0,
              width,
              height
            );


            let quality =
              0.82;


            let dataURL =
              canvas.toDataURL(
                "image/jpeg",
                quality
              );


            while (
              dataURL.length >
                4_000_000 &&
              quality > 0.5
            ) {

              quality -= 0.08;


              dataURL =
                canvas.toDataURL(
                  "image/jpeg",
                  quality
                );
            }


            resolve(dataURL);

          } catch (error) {

            reject(error);
          }
        };


        image.onerror =
          () => {

            reject(
              new Error(
                "Image could not be loaded"
              )
            );
          };


        image.src =
          reader.result;
      };


      reader.onerror =
        () => {

          reject(
            new Error(
              "File could not be read"
            )
          );
        };


      reader.readAsDataURL(file);
    }
  );
}


/* =========================
   RENDER CONTENT
========================= */

function renderContent(
  type = "caption"
) {

  const contentBox =
    $("#contentBox");


  if (!contentBox) return;


  let content = "";


  if (type === "caption") {

    content =
      generatedData.caption;
  }


  if (type === "short") {

    content =
      generatedData.short;
  }


  if (type === "hashtags") {

    content =
      generatedData.hashtags;
  }


  if (type === "ad") {

    content =
      generatedData.ad;
  }


  if (!content) {

    contentBox.innerHTML = `
      <div style="padding:20px">
        Content မရသေးပါ။
      </div>
    `;

    return;
  }


  const paragraphs =
    String(content)
      .split(/\n\s*\n/)
      .filter(Boolean);


  contentBox.innerHTML =
    paragraphs
      .map(
        (paragraph, index) => {

          const safe =
            escapeHTML(paragraph)
              .replace(
                /\n/g,
                "<br>"
              );


          if (index === 0) {

            return `
              <h3>${safe}</h3>
            `;
          }


          return `
            <p>${safe}</p>
          `;
        }
      )
      .join("");
}


/* =========================
   RENDER HIGHLIGHTS
========================= */

function renderHighlights() {

  const cards =
    $$(".side-card");


  if (!cards.length) return;


  const highlightsCard =
    cards[0];


  if (highlightsCard) {

    const list =
      Array.isArray(
        generatedData
          .product_highlights
      )
        ? generatedData
            .product_highlights
        : [];


    if (list.length) {

      highlightsCard.innerHTML = `
        <h2>✣ Product အားသာချက်</h2>

        ${list
          .map(
            item =>
              `<p>› ${escapeHTML(item)}</p>`
          )
          .join("")}
      `;
    }
  }


  const ctaCard =
    cards[1];


  if (ctaCard) {

    const list =
      Array.isArray(
        generatedData.ctas
      )
        ? generatedData.ctas
        : [];


    if (list.length) {

      ctaCard.innerHTML = `
        <h2>⌁ CTA အကြံပြုချက်</h2>

        ${list
          .map(
            item =>
              `<p>› ${escapeHTML(item)}</p>`
          )
          .join("")}
      `;
    }
  }
}


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


        const response =
          await fetch(
            API_URL,
            {
              method: "POST",

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


        let result = null;


        try {

          result =
            await response.json();

        } catch {

          result = null;
        }


        if (!response.ok) {

          const message =
            result?.error ||
            `API Error (${response.status})`;

          throw new Error(
            message
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
            generatedData
              .product_highlights,

          ctas:
            generatedData.ctas,

          style:
            selectedStyle
        });


        updateDesignPreviewImage(
          selectedFile
        );


        $$(".tab")
          .forEach((tab) => {

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


        show(
          "✨ မြန်မာဈေးကွက်အတွက် AI Content ဖန်တီးပြီးပါပြီ"
        );


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
          "Generate Error:",
          error
        );


        let message =
          error?.message ||
          "တစ်ခုခုမှားနေပါတယ်";


        if (
          message.includes(
            "Failed to fetch"
          ) ||
          message.includes(
            "NetworkError"
          )
        ) {

          message =
            "Internet connection သို့မဟုတ် API connection ပြဿနာရှိနေပါတယ်";
        }


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
   CONTENT TABS
========================= */

$$(".tab")
  .forEach((tab) => {

    tab.addEventListener(
      "click",
      () => {

        $$(".tab")
          .forEach((item) => {

            item.classList.remove(
              "active"
            );
          });


        tab.classList.add(
          "active"
        );


        const type =
          tab.dataset.tab ||
          "caption";


        renderContent(type);
      }
    );
  });


/* =========================
   LIVE PRODUCT PREVIEW
========================= */

const productNameInput =
  $("#productName");


if (productNameInput) {

  productNameInput.addEventListener(
    "input",
    (e) => {

      updateDesignPreview({

        productName:
          e.target.value,

        price:
          $("#price")
            ?.value
            ?.trim() || "",

        description:
          $("#description")
            ?.value
            ?.trim() || "",

        highlights:
          generatedData
            .product_highlights,

        ctas:
          generatedData.ctas,

        style:
          $(".style.active")
            ?.textContent
            ?.trim() || "Premium"
      });
    }
  );
}


const priceInput =
  $("#price");

const descriptionInput =
  $("#description");


[
  priceInput,
  descriptionInput
]
.forEach((input) => {

  if (!input) return;


  input.addEventListener(
    "input",
    () => {

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

        highlights:
          generatedData
            .product_highlights,

        ctas:
          generatedData.ctas,

        style:
          $(".style.active")
            ?.textContent
            ?.trim() || "Premium"
      });
    }
  );
});


/* =========================
   MYANMAR FONT
========================= */

const fontSelect =
  $(".font-row select");


if (fontSelect) {

  fontSelect.addEventListener(
    "change",
    () => {

      const selectedFont =
        fontSelect.value;


      const preview =
        $("#designPreview");


      if (preview) {

        preview.style.fontFamily =
          selectedFont
            .includes("Serif")
            ? "'Noto Serif Myanmar', serif"
            : "'Noto Sans Myanmar', sans-serif";
      }
    }
  );
}


/* =========================
   COPY ALL
========================= */

const copyButton =
  $("#copyAll");


if (copyButton) {

  copyButton.addEventListener(
    "click",
    async () => {

      const allText = [

        generatedData.caption,

        generatedData.short,

        generatedData.hashtags,

        generatedData.ad

      ]
        .filter(Boolean)
        .join("\n\n");


      if (!allText) {

        show(
          "အရင်ဆုံး Content Generate လုပ်ပါ"
        );

        return;
      }


      try {

        await navigator.clipboard.writeText(
          allText
        );


        show(
          "✓ Content အားလုံး Copy လုပ်ပြီးပါပြီ"
        );


      } catch {

        const textarea =
          document.createElement(
            "textarea"
          );


        textarea.value =
          allText;


        textarea.style.position =
          "fixed";

        textarea.style.opacity =
          "0";


        document.body.appendChild(
          textarea
        );


        textarea.select();


        try {

          document.execCommand(
            "copy"
          );


          show(
            "✓ Content အားလုံး Copy လုပ်ပြီးပါပြီ"
          );

        } catch {

          show(
            "Copy မလုပ်နိုင်သေးပါ"
          );
        }


        textarea.remove();
      }
    }
  );
}


/* =========================
   DOWNLOAD DESIGN
   TEMPORARY
========================= */

const downloadDesign =
  $("#downloadDesign");


if (downloadDesign) {

  downloadDesign.addEventListener(
    "click",
    () => {

      const preview =
        $("#designPreview");


      if (!preview) {

        show(
          "Design Preview မတွေ့ပါ"
        );

        return;
      }


      if (!selectedFile) {

        show(
          "အရင်ဆုံး Product ပုံတင်ပါ"
        );

        return;
      }


      show(
        "🎨 PNG Download ကို နောက်အဆင့်မှာ ချိတ်ပေးမယ်"
      );
    }
  );
}


/* =========================
   INITIAL CONTENT
========================= */

generatedData = {

  caption:
`✨ Product ပုံတင်ပြီး AI Content ဖန်တီးလိုက်ပါ ✨

သင့် Product ကို မြန်မာ Customer တွေ နားလည်လွယ်ပြီး စိတ်ဝင်စားလာအောင် သဘာဝကျကျ Content ရေးပေးမှာပါ။

Product ပုံတင်ပါ → Customer ရွေးပါ → စာရေးပုံစံရွေးပါ → Generate လုပ်ပါ။

AI က Product ပုံထဲက မြင်ရတဲ့အချက်အလက်တွေနဲ့ သင်ထည့်ပေးထားတဲ့ Product Information ကိုအခြေခံပြီး Content ဖန်တီးပေးပါမယ်။`,

  short:
    "Product ပုံတင်ပြီး မြန်မာလို သဘာဝကျတဲ့ Content ကို AI နဲ့ ဖန်တီးလိုက်ပါ ✨",

  hashtags:
    "#MyanmarAI #ProductContent #MyanmarSeller #ContentCreator #OnlineShop",

  ad:
    "သင့် Product ကို ရောင်းချင်စရာကောင်းတဲ့ Content အဖြစ် ပြောင်းလဲချင်ရင် Product ပုံတင်ပြီး AI Generate လုပ်ကြည့်ပါ။",

  product_highlights: [

    "Product ပုံကို AI နဲ့ ခွဲခြမ်းပေးမယ်",

    "မြန်မာ Customer အတွက် သဘာဝကျတဲ့ စာသားရေးပေးမယ်",

    "Audience နဲ့ Tone အလိုက် Content ပြောင်းပေးမယ်"

  ],

  ctas: [

    "အခုပဲ Generate လုပ်ကြည့်ပါ",

    "Product ပုံတင်ပြီး စမ်းကြည့်ပါ",

    "သင့် Product အတွက် Content ဖန်တီးလိုက်ပါ"

  ]
};


/* =========================
   INITIAL RENDER
========================= */

renderContent(
  "caption"
);

renderHighlights();

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
      ?.trim() || "Premium"
});
