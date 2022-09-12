const localtunnel = require("localtunnel");
const { v4: uuid } = require("uuid");
const path = require("path");
const readConfigFile = require(path.join(
  __dirname,
  "..",
  "modifyFiles/readConfigFile"
));
const writeConfigFile = require(path.join(
  __dirname,
  "..",
  "modifyFiles/writeConfigFile"
));
const configPath = path.join(__dirname, "../config.txt");
//expose port
const createLocalTunnel = async () => {
  const configFile = await readConfigFile(configPath);
  const publicSubDomain = `pc-power-settings-${
    configFile.CUSTOM_SUB_DOMAIN ? configFile.CUSTOM_SUB_DOMAIN : uuid()
  }`;
  let tunnel = await localtunnel({
    port: configFile.PORT ? configFile.PORT : 5000,
    subdomain: publicSubDomain,
  });
  // the assigned public url for your tunnel
  // i.e. https://abcdefgjhij.localtunnel.me
  let url = tunnel.url;
  //generates a url with a uuid instead
  const regex = new RegExp(publicSubDomain);
  if (!regex.test(url)) {
    tunnel.close();
    tunnel = await localtunnel({
      port: configFile.PORT ? configFile.PORT : 5000,
      subdomain: `pc-power-settings-${uuid()}`,
    });
    url = tunnel.url;
  }
  console.log(url);
  //extract all variables
  const all_config_env = configFile;
  //add local tunnel variable from config
  if (configFile) all_config_env["PUBLIC_CALLBACK_URL"] = url;
  const result = await writeConfigFile(configPath, all_config_env);
  console.log(result);
  tunnel.on("close", () => {
    // tunnels are closed
  });
  return `Tunnel created at ${url}`;
};
module.exports = createLocalTunnel;
