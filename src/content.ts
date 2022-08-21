/**
 * 取得所有簽到格子
 * @returns
 */
function getAllSignContent() {
  return new Promise<HTMLDivElement[]>((resolve) => {
    setInterval(() => {
      let dom = document.querySelectorAll("div[class*=components-home-assets-__sign-content_---list---] > div");

      if (dom) {
        resolve(Array.from(dom) as HTMLDivElement[]);
      }
    }, 1000);
  });
}

/**
 * 展開所有簽到格子
 */
function loadMoreSignContent() {
  const el: HTMLDivElement | null = document.querySelector(
    "div[class*=components-home-assets-__sign-content_---arrow---]"
  );

  el?.click();
}

(async () => {
  //取得所有簽到格子
  let contents = await getAllSignContent();

  while (contents.length <= 20) {
    loadMoreSignContent();
    contents = await getAllSignContent();
  }

  //需要點擊的div
  const needSignDiv = contents.find((el) => el.className.includes("active"));

  //簽到
  if (needSignDiv) {
    needSignDiv.click();
  }
})();
