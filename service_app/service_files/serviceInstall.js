const { exec, execSync } = require("child_process");
const { exec: pkgExec } = require("pkg");
const fs = require("fs/promises");
const path = require("path");
const Service = require("node-windows").Service;
const nssmInstall = async (serviceName, scriptPath, callback) => {
  //create executable file of node server
  await pkgExec([scriptPath, "--out-path", "./service_app"]);
  //create windows service
  const buffer = execSync(`nssm.exe install ${serviceName} index-win.exe`, {
    cwd: __dirname,
  });
  //write install logs
  fs.writeFile(
    path.join(__dirname, "./serviceInstallLogs.txt"),
    buffer.toString("utf-8")
  );
  //start service
  exec(`nssm.exe start ${serviceName}`, {
    cwd: __dirname,
  });
  if (callback) callback();
};
const nodeWindowsInstall = (serviceName, scriptPath, callback) => {
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
  });
  svc.on("start", function (stream) {
    console.log(`App script initiated: ${scriptPath}`);
    if (callback) callback();
  });
  svc.on("stop", function (stream) {
    console.error(stream);
    console.log("App service stopped");
  });
  svc.on("error", (stream) => {
    console.trace();
  });
  svc.install();
};
const serviceInstall = (callback = null) => {
  const serviceName = "Webhook-PC-Power-Control";
  const scriptPath = path
    .join(__dirname, "../index.js")
    .replaceAll("\\", "\\\\");
  //nssmInstall(serviceName, scriptPath, callback)
  nodeWindowsInstall(serviceName, scriptPath, callback);
};
//run script through node
if (typeof require !== "undefined" && require.main === module) {
  serviceInstall();
}
//export
module.exports = serviceInstall;
