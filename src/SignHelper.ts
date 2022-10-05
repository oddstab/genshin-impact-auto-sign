import { SignInfo } from "./interface/IConfigType";
import { snakeToCamelCase } from "./utils";

/**
 * 發request簽到
 */
export class SignHelper {
  /**
   * 基本網址
   */
  private baseURL: URL;

  /**
   * 簽到資訊
   */
  private resignInfoPath: URL;

  /**
   * 補簽到
   */
  private resignPath: URL;

  /**
   * 簽到
   */
  private signPath: URL;

  /**
   * 補簽卡任務
   */
  private taskListPath: URL;

  /**
   * 完成補簽卡任務
   */
  private taskCompletePath: URL;

  /**
   * 領取補簽卡
   */
  private taskAwardPath: URL;

  private maxResignCount: number;

  constructor() {
    this.baseURL = new URL("https://sg-hk4e-api.hoyolab.com/event/sol/");
    this.resignInfoPath = new URL("resign_info?act_id=e202102251931481", this.baseURL);
    this.resignPath = new URL("resign", this.baseURL);
    this.signPath = new URL("sign", this.baseURL);
    this.taskListPath = new URL("task/list?act_id=e202102251931481", this.baseURL);
    this.taskCompletePath = new URL("task/complete", this.baseURL);
    this.taskAwardPath = new URL("task/award", this.baseURL);
    this.maxResignCount = 3;
  }

  /**
   * 取得簽到資訊
   * @returns
   */
  async getInfo(): Promise<SignInfo> {
    const json = await this.send(this.resignInfoPath);
    let result: any = {};

    if (!json || !json.data) {
      return null;
    }

    Object.entries(json.data).forEach(([key, value]) => {
      result[snakeToCamelCase(key)] = value;
    });

    return result as SignInfo;
  }

  /**
   * 自動完成補簽卡任務
   */
  async completeTask(): Promise<boolean> {
    //1.取得任務清單
    //2.完成任務
    //3.領取補簽卡
    const info = await this.getInfo();

    //當月補簽卡已滿
    if (info?.monthQualityCnt === this.maxResignCount) {
      return false;
    }

    await this.delay(0.5);
    const taskList = await this.getTaskList();

    if (!taskList) {
      return false;
    }

    await this.delay(1);

    for (let i = 0; i < taskList.length; i++) {
      const c = taskList[i];
      const body = {
        id: c.id,
        act_id: "e202102251931481",
      };
      await this.send(this.taskCompletePath, "POST", body);
      await this.delay(1);
      await this.send(this.taskAwardPath, "POST", body);
    }

    return true;
  }

  /**
   * 取得補簽任務
   */
  async getTaskList(): Promise<{ id: number }[]> {
    let res = await this.send(this.taskListPath);
    return res.data?.list;
  }

  /**
   * 補簽
   */
  async resign() {
    let res = await this.send(this.resignPath, "POST", { act_id: "e202102251931481" });
    return res.retcode == 0;
  }

  /**
   * 簽到
   */
  async sign() {
    let res = await this.send(this.signPath, "POST", { act_id: "e202102251931481" });
    return res.retcode == 0;
  }

  done() {
    window.location.reload();
  }

  private async send(url: URL, method: "GET" | "POST" = "GET", body?: any) {
    let response = await fetch(url.toString(), {
      referrerPolicy: "strict-origin-when-cross-origin",
      body: JSON.stringify(body),
      method: method,
      mode: "cors",
      credentials: "include",
    });

    return await response.json();
  }

  private async delay(s: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, s * 1000);
    });
  }
}

/**
 * 操作dom簽到
 */
export class DOMSignHelper {
  /**
   * 取得所有簽到格子
   * @returns
   */
  getSignItems = () => {
    return new Promise<HTMLDivElement[]>((resolve) => {
      setInterval(() => {
        const dom = document.querySelectorAll("div[class*=components-home-assets-__sign-content_---sign-list] > div");

        if (dom) {
          resolve(Array.from(dom) as HTMLDivElement[]);
        }
      }, 1000);
    });
  };

  /**
   * 展開所有簽到格子
   */
  expandAll = async () => {
    return new Promise<void>((resolve) => {
      const intervalId = setInterval(() => {
        const el: HTMLDivElement | null = document.querySelector(
          "div[class*=components-home-assets-__sign-content_---more-wrapper]"
        );

        if (!!el) {
          el?.click();
          clearInterval(intervalId);
          resolve();
        }
      }, 100);
    });
  };

  /**
   * 等待簽到格子出現
   * @returns
   */
  waitForSignInList = () => {
    return new Promise<HTMLDivElement>((resolve) => {
      const ob = new MutationObserver(() => {
        const el: HTMLDivElement | null = document.querySelector(
          "div[class*=components-home-assets-__sign-content_---sign-list]"
        );

        if (el?.children.length) {
          ob.disconnect();
          resolve(el);
        }
      });

      ob.observe(document.documentElement, {
        subtree: true,
        childList: true,
      });
    });
  };

  /**
   * 補簽
   */
  missSignIn = async () => {};

  /**
   * 每日簽到
   */
  dailySignIn = async () => {
    const items = await this.getSignItems();
    const target = items.find((el) => el.className.includes("sign-wrapper"));
    console.log("daily sign in");
    target?.click();
  };

  watchSignInList = async () => {
    const ob = new MutationObserver(this.dailySignIn);
    const signInList = await this.waitForSignInList();

    ob.observe(signInList, {
      subtree: true,
      childList: true,
    });
  };

  watchMissSignIn = async () => {
    console.log("watch...");
    const ob = new MutationObserver(() => {
      console.log("watch misssign");
      // const btn: HTMLDivElement | null = document.querySelector(
      //   "div[class*=components-home-assets-__sign-content_---mend-btn]"
      // );
      // console.log("btn is show:", btn);
    });

    ob.observe(document.documentElement, {
      subtree: true,
      childList: true,
    });
  };
}
