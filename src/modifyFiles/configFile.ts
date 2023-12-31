import config from "../config.json";
import { writeConfigFile } from "./writeConfigFile";
import { readConfigFile } from "./readConfigFile";
export type ConfigProps = {
  CUSTOM_SUB_DOMAIN: string;
  PASSWORD: string;
  PORT: number;
  PUBLIC_CALLBACK_URL: string;
};
//this will be shared state. Any changes to this file will be reflected in the whole app.
class Config {
  currConfig: Partial<ConfigProps> = config || {};
  async setConfig(newProps: Partial<ConfigProps>) {
    const newConfig = {
      ...this.currConfig,
      ...newProps,
    };
    await writeConfigFile(newConfig);
    this.currConfig = newConfig;
    return newConfig;
  }
  async pollConfig(
    callback: (
      interval: NodeJS.Timeout | null,
      newConfig: Partial<ConfigProps>
    ) => void
  ) {
    const interval = setInterval(async () => {
      const newConfig = await readConfigFile();
      if (newConfig) {
        callback(interval, newConfig);
        await this.setConfig(newConfig);
      }
    }, 2000);
  }
}
const configFile = new Config();
export default configFile;
