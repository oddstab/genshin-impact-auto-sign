type DataType = {
  lastDate: number;
  signTime: {
    hours: number;
    minutes: number;
  };
  open: boolean;
};

//取得預設的簽到時間
chrome.storage.sync.get("signTime", (data) => {
  if (data.signTime) {
    return;
  }

  //如果資料是undefined，設定預設簽到時間 0點5分
  chrome.storage.sync.set({
    signTime: {
      hours: 0,
      minutes: 5,
    },
  });
});

function startup() {
  chrome.storage.sync.get(["lastDate", "signTime", "open"], (data) => {
    let { lastDate, open, signTime } = data as DataType;
    if (!lastDate) {
      chrome.storage.sync.set({
        lastDate: new Date().getTime(),
      });
    }

    let currentDate = new Date(); //目前時間
    let oldDate = new Date(lastDate); //上次簽到時間

    //如果日期不同而且大於設定時間的話就自動開網頁簽到
    if (
      open &&
      currentDate.getDate() !== oldDate.getDate() &&
      currentDate.getHours() >= signTime.hours &&
      currentDate.getMinutes() >= signTime.minutes
    ) {
      //簽到後用目前時間覆蓋掉上次時間，防止重複開啟網頁
      chrome.storage.sync.set({
        lastDate: new Date().getTime(),
      });

      //開啟米哈遊的簽到頁面
      //這邊不需要做任何簽到動作，因為content.ts裡面已經設定只要開啟米哈遊網頁就會自動簽到了。
      chrome.tabs.create({
        url:
          "https://webstatic-sea.mihoyo.com/ys/event/signin-sea/index.html?act_id=e202102251931481",
        active: false, //開啟分頁時不會跳過去
      });
    }
  });
}

startup();
setInterval(startup, 15000);
