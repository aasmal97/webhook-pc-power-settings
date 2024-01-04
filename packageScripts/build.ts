import { execCommand } from "./utils/execCommand";
import path from "path";
import {
  copyAndReplaceFiles,
  copyAndReplaceFile,
} from "./utils/copyAndReplaceFiles.";
import { createConfigFile } from "./utils/createConfig";
import { determineExecPath } from "../src/service_app/utils/downloadNode";
const nodeModulesPath = path.join(__dirname, "../node_modules", ".bin", "tsc");
const publicFilesSrc = path.join(__dirname, "../src/service_gui/public");
const publicFilesDest = path.join(__dirname, "../build/src/service_gui/public");
export const buildScript = async () => {
  //create default config file
  createConfigFile();
  //run tsc to compile typescript files
  await execCommand(`"${nodeModulesPath}"`);
  //package curr node version
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

  //copy public files
  copyAndReplaceFiles(publicFilesSrc, publicFilesDest);
};
if (require.main === module) {
  buildScript();
}
