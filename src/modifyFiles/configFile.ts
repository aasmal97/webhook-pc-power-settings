import config from "../config.json";
import { writeConfigFile } from "./writeConfigFile";
type ConfigProps = {
  CUSTOM_SUB_DOMAIN: string;
  PASSWORD: string;
  PORT: number;
  PUBLIC_CALLBACK_URL: string;
};
// type ConfigClassProps = {
//   currConfig: Partial<ConfigProps>;
//   setConfig: (newConfig: Partial<ConfigProps>) => Promise<ConfigProps>;
// };
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
}
const configFile = new Config();
export default configFile;
