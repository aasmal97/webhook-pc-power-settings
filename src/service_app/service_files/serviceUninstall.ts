import { WindowsService } from "./windowsService";
const nodeWindowsUninstall = WindowsService.uninstall;
export const serviceUninstall = async () => {
  return await nodeWindowsUninstall();
};

//run script through node
if (typeof require !== "undefined" && require.main === module) {
  serviceUninstall();
}
