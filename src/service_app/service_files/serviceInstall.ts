import { determineExecPath } from "../utils/downloadNode";
import { WindowsService } from "./windowsService";
const nodeWindowsInstall = async (callback?: () => void) => {
  const execPath = await determineExecPath();
  if (!execPath) return false;
  return await WindowsService.install(
    {
      execPath: execPath,
    },
    {
      callback: callback,
    }
  );
};
export const serviceInstall = async (callback?: () => void) => {
  return await nodeWindowsInstall(callback);
};
//run script through node
if (typeof require !== "undefined" && require.main === module) {
  serviceInstall();
}
