import { execCommand } from "./utils/execCommand";
import path from "path";
const nodeModulesPath = path.join(__dirname, "../node_modules", ".bin", "tsc");
export const buildScript = async () => {
  execCommand(`"${nodeModulesPath}"`);
};
if (require.main === module) {
  buildScript();
}
