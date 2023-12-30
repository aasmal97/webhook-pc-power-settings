import fs from "fs";
import path from "path";
import { downloadLatestNode } from "../utils/downloadNode";
import { WindowsService } from "./windowsService";
const nodeWindowsInstall = async (
  scriptPath: string,
  callback?: () => void
) => {
  let execPath: string | null;
  //determine execPath based on node.exe location
  //needed since node.exe  is needed inside this script's directory
  // to package app for distribution
  try {
    if (!fs.existsSync(path.join(__dirname, "./node.exe"))) {
      await downloadLatestNode();
    }
    execPath = path.join(__dirname, "./node.exe");
  } catch (e) {
    execPath = null;
    console.log(
      "Consider moving a copy of your node.exe into the service files directory. This will allow you to package this app for distrubtion."
    );
  }
  if (!execPath) return false;
  return await WindowsService.install(
    {
      script: scriptPath,
    },
    {
      callback: callback,
    }
  );
};
export const serviceInstall = async (callback?: () => void) => {
  const scriptPath = path.join(__dirname, "../index.js").replace(/\\/g, "\\\\");
  return await nodeWindowsInstall(scriptPath, callback);
};
//run script through node
if (typeof require !== "undefined" && require.main === module) {
  serviceInstall();
}
