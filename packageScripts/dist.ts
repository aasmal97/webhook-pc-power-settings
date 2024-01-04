import { buildScript } from "./build";
import path from "path";
import builder = require("electron-builder");
const appDir = path.resolve(__dirname, "..");
export const distScript = async () => {
  await buildScript();
  await builder.build({
    targets: builder.Platform.WINDOWS.createTarget(),
    config: {
      directories: {
        output: `dist`,
        app: `${appDir}`,
      },
      files: ["build/**/*"],
      asar: false,
      appId: "webhook-pc-power-controls",
      win: {
        target: "nsis",
        requestedExecutionLevel: "requireAdministrator",
      },
      nsis: {
        guid: "3e48272d-4a7b-49a6-b24a-436ca8884af3",
        oneClick: true,
        perMachine: true,
      },
    },
  });
};
if (require.main === module) {
  distScript();
}
