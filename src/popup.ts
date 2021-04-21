window.onload = () => {
  let open = document.querySelector("#open") as HTMLInputElement; //開啟自動簽到
  let hours = document.querySelector("#hours") as HTMLInputElement; //小時
  let minutes = document.querySelector("#minutes") as HTMLInputElement; //分鐘

  chrome.storage.sync.get("signTime", (data) => {
    hours.value = data.signTime.hours;
    minutes.value = data.signTime.minutes;
  });

  function change() {
    chrome.storage.sync.set({
      signTime: {
        hours: hours.value,
        minutes: minutes.value,
      },
    });
  }

  function changeSetting() {
    chrome.storage.sync.set({
      open: open.checked,
    });
  }

  hours.addEventListener("change", change);
  minutes.addEventListener("change", change);
  open.addEventListener("change", changeSetting);
};
