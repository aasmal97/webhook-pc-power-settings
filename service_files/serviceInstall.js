const path = require('path')
const Service = require("node-windows").Service;
const serviceName = "Control PC Power Settings";
const scriptPath = path.join(__dirname, "../", "index.js");
const svc = new Service({
  name: serviceName,
  description:
    "Control sleep, logout or shutdown with using a web server to respond to webhooks",
  script: scriptPath,
});

svc.on("install", function () {
  svc.start();
});

svc.install();
