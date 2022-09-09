const path = require("path");
const Service = require("node-windows").Service;
const serviceInstall = (callback = null) => {
  const serviceName = "Control PC Power Settings";
  const scriptPath = path.join(__dirname, "..", "index.js");
  const svc = new Service({
    name: serviceName,
    description:
      "Control sleep, logout or shutdown with using a web server to respond to webhooks",
    script: scriptPath,
    maxRestarts: 1,
  });

  svc.on("install", function () {
    svc.start();
    console.log("App install complete");
    if (callback) callback();
  });

  svc.install();
};
//run script through node
if (typeof require !== "undefined" && require.main === module) {
  serviceInstall();
}
//export
module.exports = serviceInstall;
