import { execCommand } from "./utils/execCommand";
import path from "path";
import { copyAndReplaceFiles } from "./utils/copyAndReplaceFiles.";
const nodeModulesPath = path.join(__dirname, "../node_modules", ".bin", "tsc");
const publicFilesSrc = path.join(__dirname, "../src/service_gui/public");
const publicFilesDest = path.join(__dirname, "../build/src/service_gui/public");
export const buildScript = async () => {
  execCommand(`"${nodeModulesPath}"`);
  copyAndReplaceFiles(publicFilesSrc, publicFilesDest);
};
if (require.main === module) {
  buildScript();
}
