import fs from "fs";
import path from "path";
export function createConfigFile() {
  const configData = {
    CUSTOM_SUB_DOMAIN: "example",
    PASSWORD: "admin",
    PORT: 9000,
  };

  const configFilePath = path.join(__dirname, "..", "..","src", "config.json");
  try {
    fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 4));
  } catch (err) {
      console.error(err, 'Something went wrong');
  }
}
