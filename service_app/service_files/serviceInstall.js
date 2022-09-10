const path = require("path");
const Service = require("node-windows").Service;
const fs = require("fs");
const serviceInstall = (callback = null) => {
  const serviceName = "Control PC Power Settings";
  const scriptPath = path.join(__dirname, "..", "index.js").replaceAll("\\", "\\\\");
  const workingDirectory = path.join(__dirname, "..", "..");
  //const execPath = path.join(__dirname, "..", "..", "node_modules/electron/dist/electron.exe");
  const svc = new Service({
    name: serviceName,
    //execPath: execPath, 
    description:
      "Control sleep, logout or shutdown with using a web server to respond to webhooks",
    script: scriptPath,
    maxRestarts: 1,
    //workingDirectory: workingDirectory,
  });

  svc.on("install", function () {
    svc.start();
    fs.writeFileSync(
      `${__dirname}/service_install.txt`,
      `${scriptPath}, ${workingDirectory}`
    );
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
