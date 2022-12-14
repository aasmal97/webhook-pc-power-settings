const path = require("path");
const Service = require("node-windows").Service;
const nodeWindowsUninstall = (serviceName, scriptPath, callback) => {
  const svc = new Service({
    name: serviceName,
    description:
      "Control sleep, logout or shutdown with using a web server to respond to webhooks",
    script: scriptPath,
  });

  svc.on("uninstall", function () {
    console.log(`${serviceName} uninstalled complete`);
    if (callback) callback();
  });
  svc.on("alreadyuninstalled", function () {
    console.log("App is already uninstalled");
    if (callback) callback();
  });
  svc.uninstall();
};
const serviceUninstall = (callback = null) => {
  const serviceName = "Webhook-PC-Power-Control";
  const scriptPath = path.join(__dirname, "..", "index.js");
  //nssmUninstall(serviceName, callback);
  nodeWindowsUninstall(serviceName, scriptPath, callback);
};

//run script through node
if (typeof require !== "undefined" && require.main === module) {
  serviceUninstall();
}
//export
module.exports = serviceUninstall;
