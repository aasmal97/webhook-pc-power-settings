import { buildScript } from "./build";
import { execCommand } from "./utils/execCommand";
export const devScript = async () => {
  await buildScript();
  await execCommand("nodemon build/service_app/index");
};
if (require.main === module) {
  devScript();
}
