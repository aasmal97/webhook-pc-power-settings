import fs from "fs/promises";
import path from "path";
// export const writeConfigFile = async (configPath: string, data = {}) => {
//   try {
//     const arrayOfKeys = Object.entries(data).map(
//       ([key, value]) => `${key}=${value}`
//     );
//     const string = arrayOfKeys.reduce((a, b) => `${a}\n${b}`);
//     await fs.writeFile(configPath, string);
//     return string;
//   } catch (e) {
//     console.error(e);
//     console.trace();
//   }
// };
// //run script through node
export const writeConfigFile = async (data = {}) => {
  const configPath = path.join(__dirname, "../config.json");
  try {
    await fs.writeFile(configPath, JSON.stringify(data));
  } catch (e) {
    console.error(e);
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
