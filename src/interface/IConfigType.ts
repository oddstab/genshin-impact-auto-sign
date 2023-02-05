export interface IConfigType {
  lastDate: number;
  signTime: {
    hours: number;
    minutes: number;
  };
  open: boolean;
}

export type SignInfo = {
  /**
   * ??
   */
  cost: number;

  /**
   * 每月已領補簽卡數量
   */
  monthQualityCnt: number;

  /**
   * 補簽卡數量
   */
  qualityCnt: number;

  /**
   * 今天補簽數量
   */
  resignCntDaily: number;

  /**
   * 目前月份補簽數量
   */
  resignCntMonthly: number;

  /**
   * 每天補簽上限
   */
  resignLimitDaily: number;

  /**
   * 每月補簽上限
   */
  resignLimitMonthly: number;

  /**
   * 簽到總天數
   */
  signCnt: number;

  /**
   * 漏簽總天數
   */
  signCntMissed: number;

  /**
   * 今天是否簽到
   */
  signed: boolean;
} | null;
