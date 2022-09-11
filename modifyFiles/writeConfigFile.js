const fs = require("fs/promises");
const path = require("path");
const writeConfigFile = async (configPath, data = {}) => {
  try {
    const arrayOfKeys = Object.entries(data).map(
      ([key, value]) => `${key}=${value}`
    );
    const string = arrayOfKeys.reduce((a, b) => `${a}\n${b}`);
    await fs.writeFile(configPath, string);
    return string;
  } catch (e) {
    console.error(e);
    console.trace();
  }
};
//run script through node
if (typeof require !== "undefined" && require.main === module) {
  writeConfigFile(path.join(__dirname, "../config.txt"), {
    PORT: 6546,
    CUSTOM_SUB_DOMAIN: "dwedewd",
  });
}
module.exports = writeConfigFile;
