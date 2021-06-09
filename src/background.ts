import { IDataType } from "./interface/DataType";

let config: IDataType = {
  lastDate: new Date().getDate(),
  signTime: {
    hours: 0,
    minutes: 5,
  },
  open: true,
  urls: [],
};

function startup() {
  chrome.storage.sync.get(["lastDate", "signTime", "open"], (data) => {
    let { lastDate, open, signTime } = data as IDataType;
    if (!data.urls) {
      chrome.storage.sync.set({
        urls: [],
      });
    }
    if (!lastDate) {
      chrome.storage.sync.set({
        lastDate: new Date().getDate(), //上次簽到日期
      });
    }

    if (!signTime) {
      chrome.storage.sync.set({
        signTime: {
          hours: 0,
          minutes: 5,
        },
      });
      return;
    }

    if (typeof open === "undefined") {
      chrome.storage.sync.set({
        open: true,
      });
      return;
    }

    let h = Number(signTime.hours);
    let m = Number(signTime.minutes);

    let now = new Date(); //目前時間
    let year = now.getFullYear();
    let month = now.getMonth();
    let day = now.getDate();
    let old = new Date(year, month, day, h, m);

    /* debug */
    console.clear();
    console.log(data);
    console.log("currentDate:", now);
    console.log(now.getDate(), lastDate);
    console.log(now.getDate() !== lastDate);
    console.log(now > old);

    //如果日期不同且大於設定時間的話就自動開網頁簽到
    if (open && now.getDate() !== lastDate && now > old) {
      //簽到後用目前時間覆蓋掉上次時間，防止重複開啟網頁
      chrome.storage.sync.set({
        lastDate: new Date().getDate(),
      });

      //開啟米哈遊的簽到頁面
      //這邊不需要做任何簽到動作，因為content.ts裡面已經設定只要開啟米哈遊網頁就會自動簽到了
      chrome.tabs.create({
        url:
          "https://webstatic-sea.mihoyo.com/ys/event/signin-sea/index.html?act_id=e202102251931481",
        active: false, //開啟分頁時不會focus
      });
    }
  });
}

startup();
setInterval(startup, 2000);
