import { buildScript } from "./build";
import { execCommand } from "./utils/execCommand";

export const packageScript = async () => {
  await buildScript();
  await execCommand("electron-forge package");
};
if (require.main === module) {
  packageScript();
}
