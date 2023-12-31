import fs from "fs/promises";
import path from "path";
export const writeConfigFile = async (data = {}) => {
  const configPath = path.join(__dirname, "../config.json");
  try {
    await fs.writeFile(configPath, JSON.stringify(data));
  } catch (e) {
    console.error(e, "write to file error");
    console.trace();
    return;
  }
};
if (typeof require !== "undefined" && require.main === module) {
  writeConfigFile({
    PORT: 6546,
    CUSTOM_SUB_DOMAIN: "dwedewd",
  });
}
