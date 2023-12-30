import localtunnel from "localtunnel";
import { v4 as uuid } from "uuid";
import { writeConfigFile } from "../../modifyFiles/writeConfigFile";
import configFile from "../../config.json";
const tryTunnel = async ({
  tunnel,
  subdomain,
  port,
}: {
  tunnel?: localtunnel.Tunnel;
  subdomain: string;
  port: number;
}) => {
  tunnel?.close();
  tunnel = await localtunnel({
    port: port || 5000,
    subdomain: subdomain,
  });
  return {
    url: tunnel.url,
    tunnel,
  }; //returns url to be used in config file.
};
//expose port
export const createLocalTunnel = async () => {
  let tunnel: localtunnel.Tunnel;
  let url: string;
  const publicSubDomain = `pc-power-settings-${
    configFile.CUSTOM_SUB_DOMAIN || uuid()
  }`;
  /* Every 10 second, we attempt a new callback url
   * this improves odds of getting the same
   * url if unique, since sometimes
   * windows services restart, and while restarting enough
   * time hasnt elapsed for localtunnel to realize the url
   * is free again.
   */
  const tunnelPromise = new Promise<{
    url: string;
    tunnel: localtunnel.Tunnel;
  }>((resolve) => {
    const resolvePromise = async (timeInterval: NodeJS.Timeout) => {
      //resolve
      clearInterval(timeInterval);
      //extract all variables
      const all_config_env = configFile;
      //add local tunnel variable from config
      if (configFile) all_config_env["PUBLIC_CALLBACK_URL"] = url;
      await writeConfigFile(all_config_env);
      resolve({
        url,
        tunnel,
      });
    };
    const tunnelInterval = setInterval(async () => {
      const urlResult = await tryTunnel({
        tunnel,
        subdomain: publicSubDomain,
        port: configFile.PORT || 5000, //default port is 5000
      });
      /* When we don't get the same domain again, we keep pinging until we do. Since we are
       * using a uuid, we can guarantee that it will be unique almost all the time,
       * and therefore, this is is being caused by a restart. However, the tunnel will
       * be closed soon
       */
      if (urlResult.url !== publicSubDomain) {
        return urlResult.tunnel.close();
      }
      url = urlResult.url;
      tunnel = urlResult.tunnel;
      resolvePromise(tunnelInterval);
    }, 10000);
  });
  const waitUntilTunnel = async () => await tunnelPromise;
  const result = await waitUntilTunnel();
  return result;
};
