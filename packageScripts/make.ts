import { buildScript } from "./build";
import { execCommand } from "./utils/execCommand";

export const makeScript = async () => {
  await buildScript();
  await execCommand("electron-forge make");
};
if (require.main === module) {
  makeScript();
}
