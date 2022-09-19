const fs = require("fs/promises");
const readConfigFile = async (configPath) => {
  try {
    const lines = await fs.readFile(configPath, {
      encoding: "utf-8",
    });
    const options = lines.split(/[=(\n)]/);
    const objectOptions = {};
    let currKey = "";
    for (let i in options) {
      if (i % 2 === 0) currKey = options[i];
      else objectOptions[currKey] = options[i].replace("\r", '');
    }
    return objectOptions;
  } catch (e) {
    console.error(e)
    console.trace()
    return {};
  }
};
//run script through node
if (typeof require !== "undefined" && require.main === module) {
  readConfigFile("config.txt");
}
module.exports = readConfigFile;
