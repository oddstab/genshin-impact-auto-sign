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
  const last = new Date(config.lastDate).getDate();
  const currentDate = new Date().getDate();
  const el = document.querySelector(".is-sign-today") as HTMLInputElement;
  el.innerHTML = last === currentDate ? "今日已簽到" : "今日未簽到";
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

  document.querySelector(".check-schedule")?.addEventListener("click", () => {
    chrome.alarms.get("TEST", (x) => {
      console.log(x);
    });
  });

  const config = await getConfig();
  const h = config.signTime.hours.toString().padStart(2, "0");
  const m = config.signTime.minutes.toString().padStart(2, "0");
  dateInput.value = `${h}:${m}`;
  open.checked = Boolean(config.open);

  checkIsSignToday();
});
