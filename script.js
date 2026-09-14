const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s),toast=$("#toast");
function show(t){toast.textContent=t;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1700)}
const fi=$("#fileInput"),info=$("#fileInfo");
fi.addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;if(f.size>10*1024*1024)return show("ပုံဖိုင် 10MB အောက်ဖြစ်ရပါမယ်");$("#fileName").textContent=f.name;$("#fileSize").textContent=(f.size/1024/1024).toFixed(2)+" MB";$("#thumb").style.backgroundImage=`url("${URL.createObjectURL(f)}")`;info.classList.remove("hidden");show("Product ပုံထည့်ပြီးပါပြီ")});
$("#removeFile").onclick=()=>{fi.value="";info.classList.add("hidden");show("ပုံဖယ်ပြီးပါပြီ")};
$("#dropzone").ondragover=e=>{e.preventDefault();$("#dropzone").style.borderColor="#745cff"};
$("#dropzone").ondrop=e=>{e.preventDefault();fi.files=e.dataTransfer.files;fi.dispatchEvent(new Event("change"))};
$$(".chip").forEach(b=>b.onclick=()=>b.classList.toggle("active"));
$$(".style").forEach(b=>b.onclick=()=>{$$(".style").forEach(x=>x.classList.remove("active"));b.classList.add("active")});
$$(".variation").forEach(b=>b.onclick=()=>{$$(".variation").forEach(x=>x.classList.remove("active"));b.classList.add("active")});
const data={
caption:`✨ အမြဲတမ်းလှပနေဖို့… ကိုယ့်အတွက်ကိုယ်ရွေးချယ်ပါ ✨

Chanel No.5 ကတော့ နာမည်ကြီး classic fragrance တစ်မျိုးဖြစ်ပြီး ရိုးရိုးလေးနဲ့ elegant ဖြစ်ချင်တဲ့သူတွေအတွက် အဆင်ပြေတဲ့ရွေးချယ်မှုလေးပါ။

အနံ့က မပြင်းလွန်းဘဲ တစ်နေ့တာလုံး ကိုယ့်ရဲ့ presence လေးကို သိသာစေချင်တဲ့အချိန်တွေမှာ သုံးလို့ကောင်းပါတယ်။ နေ့တိုင်းသုံးဖို့ပဲဖြစ်ဖြစ်၊ အပြင်သွားမယ့်နေ့တွေမှာပဲဖြစ်ဖြစ် ရွေးလို့ရပါတယ်။

🤍 Classic fragrance
🤍 Premium quality
🤍 Daily use & special occasions အတွက်သင့်တော်

ကိုယ်တိုင်သုံးဖို့ပဲဖြစ်ဖြစ် ချစ်ရတဲ့သူကို လက်ဆောင်ပေးဖို့ပဲဖြစ်ဖြစ် — timeless ဖြစ်တဲ့ရွေးချယ်မှုလေးတစ်ခုပါ။

📩 ဈေးနှုန်းနဲ့ မှာယူနိုင်မယ့်အချက်အလက်တွေကို Chat Box မှာ လာမေးလို့ရပါတယ်။`,
short:`ရိုးရိုးလေးနဲ့ elegant ဖြစ်ချင်တဲ့နေ့တွေမှာ ✨

Chanel No.5 — timeless fragrance တစ်ခုကို ကိုယ့်ရဲ့နေ့စဉ်အတွက် ရွေးချယ်လိုက်ပါ။`,
hashtags:`#ChanelNo5 #Perfume #Fragrance #Luxury #Beauty #MyanmarShop #Premium #DailyStyle`,
ad:`ကိုယ့်ရဲ့ style ကို အနံ့လေးတစ်ခုနဲ့ ပြည့်စုံစေချင်ရင်…

Chanel No.5 ရဲ့ classic & elegant character ကို စမ်းကြည့်လိုက်ပါ။ နေ့စဉ်သုံးဖို့ဖြစ်ဖြစ် special occasion အတွက်ဖြစ်ဖြစ် ရွေးလို့ကောင်းတဲ့ fragrance လေးပါ။

📩 မှာယူချင်ရင် Chat Box မှာ ဆက်သွယ်လိုက်ပါ။`
};
function render(k="caption"){const c=data[k];$("#contentBox").innerHTML=c.split("\n\n").map((x,i)=>i===0?`<h3>${x}</h3>`:`<p>${x.replace(/\n/g,"<br>")}</p>`).join("")}
render();
$$(".tab").forEach(t=>t.onclick=()=>{$$(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");render(t.dataset.tab)});
$("#productName").oninput=e=>$("#previewName").textContent=e.target.value;
$("#generate").onclick=()=>show("မြန်မာဈေးကွက်အတွက် Content Preview ဖန်တီးပြီးပါပြီ ✨");
$("#copyAll").onclick=()=>navigator.clipboard?.writeText(data.caption).then(()=>show("Caption copy လုပ်ပြီးပါပြီ")).catch(()=>show("Copy မလုပ်နိုင်သေးပါ"));
$("#downloadDesign").onclick=()=>show("PNG export ကို AI/backend phase မှာ ချိတ်ပေးမယ်");
