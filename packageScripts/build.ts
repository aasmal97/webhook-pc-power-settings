import { execCommand } from "./utils/execCommand";
import path from "path";
import {
  copyAndReplaceFiles,
  copyAndReplaceFile,
} from "./utils/copyAndReplaceFiles.";
import { determineExecPath } from "../src/service_app/utils/downloadNode";
const nodeModulesPath = path.join(__dirname, "../node_modules", ".bin", "tsc");
const publicFilesSrc = path.join(__dirname, "../src/service_gui/public");
const publicFilesDest = path.join(__dirname, "../build/src/service_gui/public");
export const buildScript = async () => {
  await execCommand(`"${nodeModulesPath}"`);
  const nodeExecPath = await determineExecPath();
  if (nodeExecPath) {
    const splitPath = nodeExecPath.split("\\src\\");
    const newPath = splitPath.reduce((a, b, idx) => {
      if (idx === splitPath.length - 1) return path.join(a, "build", "src", b);
      else return path.join(a, "src", b);
    });
    copyAndReplaceFile({
      srcFile: nodeExecPath,
      destFile: newPath,
      file: "node.exe",
    });
  }
  copyAndReplaceFiles(publicFilesSrc, publicFilesDest);
};
if (require.main === module) {
  buildScript();
}
