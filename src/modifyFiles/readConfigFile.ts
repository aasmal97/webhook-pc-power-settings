import fs from "fs/promises";
export const readConfigFile = async (configPath: string) => {
  try {
    const lines = await fs.readFile(configPath, {
      encoding: "utf-8",
    });
    const options = lines.split(/[=(\n)]/);
    const objectOptions: {
      [key: string]: string;
    } = {};
    let currKey = "";
    for (let i in options) {
      if (parseFloat(i) % 2 === 0) currKey = options[i];
      else objectOptions[currKey] = options[i].replace("\r", "");
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
  readConfigFile("config.txt");
}
