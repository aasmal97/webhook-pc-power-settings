import localtunnel from "localtunnel";
import { v4 as uuid } from "uuid";
import configFile from "../../modifyFiles/configFile";
import eventLog from "./EventLogger";
type TunnelProps = {
  url: string;
  tunnel: localtunnel.Tunnel;
};
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
    port: port || 8000,
    subdomain: subdomain,
  });
  //returns url to be used in config file.
  return {
    url: tunnel?.url,
    tunnel,
  };
};
/*
 * Helper function that resolves promises
 */
const resolvePromise = async ({
  resolve,
  timeInterval,
  url,
  tunnel,
}: {
  resolve: (value: TunnelProps | PromiseLike<TunnelProps>) => void;
  timeInterval: NodeJS.Timeout;
} & TunnelProps) => {
  //resolve
  clearInterval(timeInterval);
  //extract all variables
  const all_config_env = configFile.currConfig;
  //add local tunnel variable from config
  if (configFile.currConfig) all_config_env["PUBLIC_CALLBACK_URL"] = url;
  await configFile.setConfig(all_config_env);
  resolve({
    url,
    tunnel,
  });
};
/* Every 5 seconds, we attempt a new callback url
 * this improves odds of getting the same
 * url if unique, since sometimes
 * windows services restart, and while restarting enough
 * time hasnt elapsed for localtunnel to realize the url
 * is free again.
 */
const tunnelPromise = async ({
  publicSubDomain,
}: {
  publicSubDomain: string;
}) => {
  let url: string;
  let tunnel: localtunnel.Tunnel;
  return await new Promise<TunnelProps>((resolve) => {
    const tunnelInterval = setInterval(async () => {
      const urlResult = await tryTunnel({
        tunnel,
        subdomain: publicSubDomain,
        port: configFile.currConfig.PORT || 8000, //default port is 5000
      });
      /* When we don't get the same domain again, we keep pinging until we do. Since we are
       * using a uuid, we can guarantee that it will be unique almost all the time,
       * and therefore, this is is being caused by a restart. However, the tunnel will
       * be closed soon
       */
      const isNotEqual = urlResult.url !== `https://${publicSubDomain}.loca.lt`;
      eventLog.info(
        `Current URL Result is ${
          urlResult.url
        }\n. Expected Url is ${publicSubDomain}\n Is it equal expected subDomain? ${!isNotEqual}`
      );
      if (isNotEqual) return urlResult.tunnel.close();
      url = urlResult.url;
      tunnel = urlResult.tunnel;
      resolvePromise({
        resolve,
        timeInterval: tunnelInterval,
        url,
        tunnel,
      });
    }, 5000);
  });
};
//expose port
export const createLocalTunnel = async () => {
  const publicSubDomain = `pc-power-settings-${
    configFile.currConfig.CUSTOM_SUB_DOMAIN || uuid()
  }`;
  eventLog.info(
    "Attempting to create tunnel with subdomain " + publicSubDomain
  );
  const waitUntilTunnel = await tunnelPromise({ publicSubDomain });
  return waitUntilTunnel;
};
