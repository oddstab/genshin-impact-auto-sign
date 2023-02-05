import { SignHelper } from "./SignHelper";

const start = async () => {
  const helper = new SignHelper();
  const resignInfo = await helper.getInfo();
  if (!resignInfo || resignInfo.signed) {
    return;
  }

  insertMask();
  await helper.completeTask();
  await helper.sign();
  await helper.resign();

  if (!resignInfo?.signed) {
    window.location.reload();
  }
};

const insertMask = () => {
  const maskText = chrome.i18n.getMessage("signing_mask");
  const style = `width: 100%;
    height: 100%;
    background: #000000a3;
    position: absolute;
    top: 0;
    z-index: 9999;
    color: #fff;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 64px;
  `;

  let mask = document.createElement("div");
  mask.style.cssText = style;
  mask.innerHTML = maskText;
  document.body.appendChild(mask);
};

start();
