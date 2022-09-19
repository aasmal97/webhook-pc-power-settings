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
  //initial attempt
  let tunnel = await localtunnel({
    port: configFile.PORT ? configFile.PORT : 5000,
    subdomain: publicSubDomain,
  });
  // the assigned public url for tunnel
  let url = tunnel.url;
  const tryTunnel = async (subdomain) => {
    tunnel.close();
    tunnel = await localtunnel({
      port: configFile.PORT ? configFile.PORT : 5000,
      subdomain: subdomain,
    });
    url = tunnel.url;
  };
  //generates a url with a uuid instead
  const regex = new RegExp(publicSubDomain.slice(), "gi");
  let time = 0;
  let interval = 10000;
  const max = 60000;

  //every 10 second, we attempt a new callback url
  //this improves odds of getting the same
  //url if unique, since sometimes
  //windows services restart, and while restarting enough
  //time hasnt elapsed for localtunnel to relize the url
  //is free again.
  const tunnelPromise = new Promise((resolve) => {
    const resolvePromise = async (timeInterval) => {
      //resolve
      clearInterval(timeInterval);
      //extract all variables
      const all_config_env = configFile;
      //add local tunnel variable from config
      if (configFile) all_config_env["PUBLIC_CALLBACK_URL"] = url;
      await writeConfigFile(configPath, all_config_env);
      resolve(url);
    };
    const tunnelInterval = setInterval(async () => {
      console.log(url)
      if (!regex.test(url) && time < max) {
        await tryTunnel(publicSubDomain);
        time += interval;
      } else if (time >= max && !regex.test(url)) {
        //try with uuid
        await tryTunnel(`pc-power-settings-${uuid()}`);
        await resolvePromise(tunnelInterval);
      } else await resolvePromise(tunnelInterval);
    }, interval);
  });
  const waitUntilTunnel = async () => await tunnelPromise;
  tunnel.on("close", () => {
    // tunnels are closed
  });
  const result = await waitUntilTunnel();
  return `Tunnel created at ${result}`;
};
module.exports = createLocalTunnel;
