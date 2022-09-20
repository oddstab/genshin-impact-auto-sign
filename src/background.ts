import { getConfig, resetConfig, setConfig } from "./configHelper";
import { IConfigType } from "./interface/IConfigType";

// const checkSign = () => {
//   chrome.storage.sync.get(["lastDate", "signTime", "open"], (data) => {
//     console.log("start check sign...");
//     let { lastDate, open, signTime } = data as IConfigType;
//     if (!data.urls) {
//       chrome.storage.sync.set({
//         urls: [],
//       });
//     }
//     if (!lastDate) {
//       chrome.storage.sync.set({
//         lastDate: new Date().getDate(), //上次簽到日期
//       });
//     }

//     if (!signTime) {
//       chrome.storage.sync.set({
//         signTime: {
//           hours: 0,
//           minutes: 5,
//         },
//       });
//       return;
//     }

//     if (typeof open === "undefined") {
//       chrome.storage.sync.set({
//         open: true,
//       });
//       return;
//     }

//     let h = Number(signTime.hours);
//     let m = Number(signTime.minutes);

//     let now = new Date(); //目前時間
//     let year = now.getFullYear();
//     let month = now.getMonth();
//     let day = now.getDate();
//     let old = new Date(year, month, day, h, m);

//     //如果日期不同且大於設定時間的話就自動開網頁簽到
//     if (open && now.getDate() !== lastDate && now > old) {
//       //簽到後用目前時間覆蓋掉上次時間，防止重複開啟網頁
//       chrome.storage.sync.set({
//         lastDate: new Date().getDate(),
//       });

//       //開啟米哈遊的簽到頁面
//       //這邊不需要做任何簽到動作，因為content.ts裡面已經設定只要開啟米哈遊網頁就會自動簽到了
//       chrome.tabs.create({
//         url: "https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481",
//         active: false, //開啟分頁時不會focus
//       });
//     }

//     console.log("check done..");
//   });
// };
// const ALARM_NAME = "GENSHIN_AUTO_SIGN_ALARM";

// const createAlarm = async () => {
//   const config = await getConfig();
//   console.log(config);
//   const now = new Date();
//   const last = new Date(config.lastDate);
//   const targetTime = new Date(last.setHours(config.signTime.hours, config.signTime.minutes, 0, 0));
//   // targetTime.setDate(targetTime.getDate() + 1);
//   // console.log(targetTime);
//   targetTime.setMinutes(targetTime.getMinutes() + 5);
//   console.log(targetTime);
//   chrome.alarms.create(ALARM_NAME, {
//     when: targetTime.getTime(),
//   });
// };

// createAlarm();
// chrome.alarms.onAlarm.addListener(async (alarm) => {
//   if (alarm.name != ALARM_NAME) {
//     return;
//   }
//   createAlarm();

//   console.log("check sign ...");
//   setConfig({
//     ...(await getConfig()),
//     lastDate: Date.now(),
//   });
//   // checkSign2();
// });

// const checkSign2 = async () => {
//   const config = await getConfig();
//   const newConfig = await setConfig({
//     ...config,
//     open: false,
//   });
//   console.log(config);
//   console.log(newConfig);
// };

// checkSign2();

chrome.alarms.create({
  periodInMinutes: 1,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log("alarm:", alarm);
  const nextTime = new Date().setDate(new Date().getDate() + 1);
  console.log("fired");
  console.log("next time: ", new Date(nextTime));
  chrome.alarms.create("TEST", {
    when: nextTime,
  });
});
