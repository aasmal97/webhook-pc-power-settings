import { WindowsService } from "./windowsService";
export const serviceUninstall = async () => {
  return await WindowsService.uninstall();
};

//run script through node
if (typeof require !== "undefined" && require.main === module) {
  serviceUninstall();
}
