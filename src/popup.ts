import { getConfig } from "./configHelper";
import { IConfigType } from "./interface/IConfigType";

/**
 * 更新簽到時間
 * @param h
 * @param m
 */
function updateSignTime(h: Number, m: Number) {
  chrome.storage.sync.set({
    signTime: {
      hours: h,
      minutes: m,
    },
  });
}

/**
 * 檢查今天是否已經簽到過
 */
async function checkIsSignToday() {
  const config = await getConfig();
  const currentDate = new Date().getDate();
  const el = document.querySelector(".is-sign-today") as HTMLInputElement;
  el.innerHTML =
    config.lastDate === currentDate
      ? chrome.i18n.getMessage("is_signed_today_true")
      : chrome.i18n.getMessage("is_signed_today_false");
}

/**
 * 本地化html頁面
 */
function localizeHtmlPage() {
  document.querySelectorAll("[data-i18n-text]").forEach((element) => {
    const key = element.getAttribute("data-i18n-text");
    if (key) {
      element.textContent = chrome.i18n.getMessage(key);
    }
  });

  const input = document.querySelectorAll("[data-i18n-placeholder]") as NodeListOf<HTMLInputElement>;
  input.forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    if (key) {
      element.placeholder = chrome.i18n.getMessage(key);
    }
  });

  const title = document.querySelectorAll("[data-i18n-title]") as NodeListOf<HTMLDivElement>;
  title.forEach((element) => {
    const key = element.getAttribute("data-i18n-title");
    if (key) {
      element.title = chrome.i18n.getMessage(key);
    }
  });
}

window.addEventListener("load", async () => {
  const open = document.querySelector("#open") as HTMLInputElement; //開啟自動簽到
  const dateInput = document.querySelector("#sign-time-picker") as HTMLInputElement; //日期
  open.addEventListener("change", (e) => {
    const el = e.target as HTMLInputElement;
    chrome.storage.sync.set({
      open: el.checked,
    });
  });

  dateInput.addEventListener("change", (e) => {
    const el = e.target as HTMLInputElement;
    updateSignTime(Number(el.value.split(":")[0]), Number(el.value.split(":")[1]));
  });

  const config = await getConfig();
  const h = config.signTime.hours.toString().padStart(2, "0");
  const m = config.signTime.minutes.toString().padStart(2, "0");
  dateInput.value = `${h}:${m}`;
  open.checked = Boolean(config.open);

  localizeHtmlPage();
  checkIsSignToday();
});
