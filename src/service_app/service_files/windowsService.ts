import { Service, ServiceConfig } from "node-windows";
import path from "path";
import { execPath } from "../utils/downloadNode";
class WebhookWindowsService {
  serviceProps: Partial<ServiceConfig> = {};
  currServiceInstance: Service | null = null;
  constructor(options: Partial<ServiceConfig> = {}) {
    this.serviceProps = options;
  }
  install(options?: { callback?: () => void }) {
    return new Promise<boolean>((resolve, reject) => {
      try {
        const instanceConfig = {
          ...this.serviceProps,
        };
        const scriptPath = path
          .join(__dirname, "../index.js")
          .replace(/\\/g, "\\\\");
        const svc = new Service({
          ...instanceConfig,
          script: scriptPath,
          execPath: execPath,
        });
        const currService = this;
        svc.on("install", function () {
          svc.start();
          console.log("App install complete");
        });
        svc.on("alreadyinstalled", async function () {
          //we set the current service as the current instance since we know it's installed
          currService.currServiceInstance = svc;
          const result = await currService.uninstall();
          //we know this is uninstalled, so we can re-try for resolution
          try {
            if (result) {
              const retryResult = await currService.install(options);
              resolve(retryResult);
            } else {
              console.error("Failed to re-install service");
              reject(false);
            }
          } catch (err) {
            console.error(err);
            reject(false);
          }
        });
        svc.on("invalidinstallation", function () {
          console.log("Invalid installation");
        });
        svc.on("start", function (stream) {
          if (options?.callback) options.callback();
          resolve(true);
        });
        svc.on("stop", function (stream) {
          console.error(stream);
          console.log("App service stopped");
        });
        svc.on("error", (stream) => {
          console.trace();
        });
        svc.install();
        this.currServiceInstance = svc;
        this.serviceProps = instanceConfig;
      } catch (err) {
        console.error(err);
        reject(false);
      }
    });
  }
  uninstall(options?: { callback?: () => void }) {
    return new Promise<boolean>((resolve, reject) => {
      try {
        if (!this.currServiceInstance) return resolve(true);
        const svc = this.currServiceInstance;
        const currServiceProps = this.serviceProps;
        svc.on("uninstall", function () {
          console.log(`${currServiceProps.name} uninstalled complete`);
          if (options?.callback) options.callback();
          resolve(true);
        });
        svc.on("alreadyuninstalled", function () {
          console.log("App is already uninstalled");
          if (options?.callback) options.callback();
          resolve(true);
        });
        svc.uninstall();
      } catch (err) {
        reject(false);
        console.error(err, "uninstall error");
      }
    });
  }
}
export const WindowsService = new WebhookWindowsService({
  name: "Webhook-PC-Power-Controls",
  description:
    "Control sleep, logout or shutdown with using a web server to respond to webhooks",
});
