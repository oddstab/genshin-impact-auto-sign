import { IConfigType } from "./interface/IConfigType";

const defaultConfig: IConfigType = {
  signTime: {
    hours: 0,
    minutes: 5,
  },
  lastDate: Date.now(),
  open: true,
};

const keys = ["lastDate", "signTime", "open"];

export const getConfig = async (): Promise<IConfigType> => {
  const get = () => {
    return new Promise<IConfigType>((resolve) => {
      chrome.storage.sync.get(keys, (data) => {
        resolve(data as IConfigType);
      });
    });
  };

  let result = await get();
  keys.forEach((key) => {
    if (typeof (result as any)[key] === "undefined") {
      setConfig({
        ...result,
        [key]: (defaultConfig as any)[key],
      });
    }
  });

  result = await get();
  return result;
};

export const setConfig = async (config: IConfigType): Promise<IConfigType> => {
  await new Promise<void>((resolve) => {
    chrome.storage.sync.set(config, resolve);
  });

  return await getConfig();
};

export const resetConfig = () => {
  keys.forEach(async (key) => {
    await new Promise<void>((resolve) => {
      chrome.storage.sync.remove(key, resolve);
    });
  });
};
