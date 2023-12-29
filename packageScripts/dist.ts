import { buildScript } from "./build";
import { execCommand } from "./utils/execCommand";

export const distScript = async () => {
  await buildScript();
  await execCommand("electron-builder");
};
if (require.main === module) {
  distScript();
}
