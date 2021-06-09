/**
 * 取得所有url
 */
function getAllUrl() {
  return new Promise((resolve) => {
    chrome.storage.local.get("urls", (data) => {
      resolve(data);
    });
  });
}

function loadPage() {
  getAllUrl().then(({ urls }: any) => {
    urls.forEach((url: any) => {
      let newLi = document.createElement("li");
      let input = document.createElement("input");
      let btn = document.createElement("button");

      input.type = "text";
      input.value = url;
      btn.innerHTML = "&#10006;";
      btn.className = "remove-url-list";

      input.addEventListener("blur", () => {
        console.log("blur");
      });

      btn.addEventListener("click", (e) => {
        let el = e.target as HTMLElement;
        console.log(el.parentElement);
        el.parentElement?.remove();
      });

      newLi.appendChild(input);
      newLi.appendChild(btn);

      urlList.appendChild(newLi);
    });
  });
  let open = document.querySelector("#open") as HTMLInputElement; //開啟自動簽到
  let hours = document.querySelector("#hours") as HTMLInputElement; //小時
  let minutes = document.querySelector("#minutes") as HTMLInputElement; //分鐘
  let urlListDiv = document.querySelector(".custom-url-list") as HTMLDivElement;
  let container = document.querySelector(".container") as HTMLDivElement;
  let home = document.querySelector(".home") as HTMLDivElement;
  let gotoUrlList = document.querySelector(
    ".goto-custom-url-list"
  ) as HTMLButtonElement; //自訂網址按鈕
  let goBack = document.querySelector(".go-back") as HTMLButtonElement;
  let addUrlList = document.querySelector(".add-url-list") as HTMLButtonElement;
  let urlList = document.querySelector(
    ".custom-url-list ul"
  ) as HTMLUListElement;

  let page = localStorage.getItem("page");
  if (page) {
    if (page !== "home") {
      container.style.width = "298px";
      home.setAttribute("hidden", "");
      urlListDiv.removeAttribute("hidden");
    } else {
      container.style.width = "200px";
      home.removeAttribute("hidden");
      urlListDiv.setAttribute("hidden", "");
    }
  }

  chrome.storage.sync.get(["signTime", "open"], (data) => {
    open.checked = Boolean(data.open);
    hours.value = data.signTime.hours;
    minutes.value = data.signTime.minutes;
  });

  function change() {
    chrome.storage.sync.set({
      signTime: {
        hours: Number(hours.value),
        minutes: Number(minutes.value),
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

  gotoUrlList.addEventListener("click", () => {
    container.style.width = "298px";
    home.setAttribute("hidden", "");
    urlListDiv.removeAttribute("hidden");
    localStorage.setItem("page", "list");
  });

  goBack.addEventListener("click", () => {
    container.style.width = "200px";
    home.removeAttribute("hidden");
    urlListDiv.setAttribute("hidden", "");
    localStorage.setItem("page", "home");
  });

  addUrlList.addEventListener("click", () => {
    let newLi = document.createElement("li");
    let input = document.createElement("input");
    let btn = document.createElement("button");

    input.type = "text";
    btn.innerHTML = "&#10006;";
    btn.className = "remove-url-list";

    input.addEventListener("blur", () => {
      console.log("blur");
    });

    btn.addEventListener("click", (e) => {
      let el = e.target as HTMLElement;
      console.log(el.parentElement);
      el.parentElement?.remove();
    });

    newLi.appendChild(input);
    newLi.appendChild(btn);

    urlList.appendChild(newLi);
    urlList.scrollTo({
      top: urlList.scrollHeight,
    });

    console.log("add");
    chrome.storage.local.get("urls", (data) => {
      let newUrls: any[] = [];
      console.log(data.urls);
      if (data.urls) {
        newUrls = [...data.urls];
      }
      newUrls.push(`https://google.com/${Math.random()}`);

      chrome.storage.local.set({
        urls: newUrls,
      });
    });
  });
}

window.onload = loadPage;
