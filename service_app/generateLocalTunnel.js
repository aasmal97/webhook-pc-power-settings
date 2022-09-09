const { stringify } = require("envfile");
const fs = require("fs/promises");
const dotenv = require("dotenv");
const localtunnel = require("localtunnel");
const { v4: uuid } = require("uuid");
const path = require("path");
const configPath = path.join(__dirname, "..", "config.env");
//expose port
const createLocalTunnel = async () => {
  const { parsed: configFile } = dotenv.config({ path: configPath });
  const publicSubDomain = `pc-power-settings-${
    process.env.CUSTOM_SUB_DOMAIN ? process.env.CUSTOM_SUB_DOMAIN : uuid()
  }`;
  let tunnel = await localtunnel({
    port: process.env.PORT ? process.env.PORT : 5000,
    subdomain: publicSubDomain,
  });
  // the assigned public url for your tunnel
  // i.e. https://abcdefgjhij.localtunnel.me
  let url = tunnel.url;
  //generates a url with a uuid instead
  if (url !== publicSubDomain) {
    tunnel.close();
    tunnel = await localtunnel({
      port: process.env.PORT ? process.env.PORT : 5000,
      subdomain: `pc-power-settings-${uuid()}`,
    });
    url = tunnel.url;
  }
  console.log(url);
  //extract all variables
  const all_config_env = configFile;

  //add local tunnel variable from config
  all_config_env["PUBLIC_CALLBACK_URL"] = url;
  const new_config_data = stringify(all_config_env);
  //output new config file
  await fs.writeFile(configPath, new_config_data);
  tunnel.on("close", () => {
    // tunnels are closed
  });
};
module.exports = createLocalTunnel;
