import fs from "fs/promises";
import path from "path";
import { ConfigProps } from "./configFile";
export const readConfigFile = async () => {
  const configPath = path.join(__dirname, "../config.json");
  try {
    const lines = await fs.readFile(configPath, {
      encoding: "utf-8",
    });
    let objectOptions: Partial<ConfigProps> = {};
    try {
      objectOptions = JSON.parse(lines);
    } catch (err) {
      console.error(err, "error parsing config file");
      console.trace();
    }
    return objectOptions;
  } catch (e) {
    console.error(e);
    console.trace();
    return {};
  }
};
//run script through node
if (typeof require !== "undefined" && require.main === module) {
  readConfigFile().then((res) => {
    console.log(res);
  });
}
