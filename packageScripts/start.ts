import { buildScript } from "./build";
import { execCommand } from "./utils/execCommand";

export const startScript = async () => {
  await buildScript();
  await execCommand("electron-forge start");
};
if (require.main === module) {
  startScript();
}
