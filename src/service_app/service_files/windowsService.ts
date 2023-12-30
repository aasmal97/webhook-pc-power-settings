import { Service, ServiceConfig } from "node-windows";
class WebhookWindowsService {
  serviceProps: Partial<ServiceConfig>;
  currServiceInstance: Service | null = null;
  constructor(options: Partial<ServiceConfig>) {
    this.serviceProps = options;
  }
    doesServiceExist() {
  }
  install(
    config: Partial<ServiceConfig>,
    options?: {
      callback?: () => void;
    }
  ) {
    return new Promise<boolean>((resolve, reject) => {
      try {
        const instanceConfig = {
          ...this.serviceProps,
          ...config,
        };
        if (!("script" in instanceConfig)) {
          console.error("script is required");
          return reject(false);
        }
        const scriptPath = instanceConfig.script as string;
        const svc = new Service({ ...instanceConfig, script: scriptPath });
        svc.on("install", function () {
          svc.start();
          console.log("App install complete");
        });
        svc.on("start", function (stream) {
          console.log(`App script initiated: ${scriptPath}`);
          resolve(true);
          if (options?.callback) options.callback();
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
        if (!this.currServiceInstance) return;
        const svc = this.currServiceInstance;
        const currServiceProps = this.serviceProps;
        svc.on("uninstall", function () {
          console.log(`${currServiceProps.name} uninstalled complete`);
          resolve(true);
          if (options?.callback) options.callback();
        });
        svc.on("alreadyuninstalled", function () {
          console.log("App is already uninstalled");
          resolve(true);
          if (options?.callback) options.callback();
        });
        svc.uninstall();
      } catch (err) {
        reject(false);
        console.error(err);
      }
    });
  }
}
export const WindowsService = new WebhookWindowsService({
  name: "Webhook-PC-Power-Controls",
  description:
    "Control sleep, logout or shutdown with using a web server to respond to webhooks",
});
