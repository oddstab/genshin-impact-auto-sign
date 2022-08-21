import { IDataType } from "./interface/DataType";

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
function checkIsSignToday() {
  chrome.storage.sync.get(["lastDate"], (data) => {
    const currentDate = new Date().getDate();
    const config = data as IDataType;
    console.log(config, currentDate);
    const el = document.querySelector(".is-sign-today") as HTMLInputElement;
    el.innerHTML = config.lastDate === currentDate ? "今日已簽到" : "今日未簽到";
  });
}

window.onload = () => {
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

  chrome.storage.sync.get(["signTime", "open"], (data) => {
    const config = data as IDataType;
    const h = config.signTime.hours.toString().padStart(2, "0");
    const m = config.signTime.minutes.toString().padStart(2, "0");
    dateInput.value = `${h}:${m}`;
    open.checked = Boolean(config.open);
  });

  checkIsSignToday();
};
