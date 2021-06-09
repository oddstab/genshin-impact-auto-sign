export interface IDataType {
  lastDate: number;
  signTime: {
    hours: number;
    minutes: number;
  };
  open: boolean;
  urls: string[];
}
