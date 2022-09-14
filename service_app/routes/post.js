const { exec } = require("child_process");
const path = require("path");
const readConfigFile = require(path.join(
  __dirname,
  "..",
  "..",
  "modifyFiles/readConfigFile"
));
const express = require("express");
const router = express.Router();
router.route("/").post(async (req, res) => {
  const body = req.body;
  const configFile = await readConfigFile(
    path.join(__dirname, "../../config.txt")
  );
  if (body.password !== configFile.PASSWORD)
    return res.send("You are not authorized to access this machine");
  const commandErrHandler = (err, stdout, stderr) => {
    if (err) return console.log(`error: ${err.message}`);
    if (stderr) return console.log(`stderr: ${stderr}`);
    console.log(stdout);
  };
  const responseStr = `Action ${body.action} initiated`;
  res.send(responseStr);
  switch (body.action) {
    case "sleep":
      exec(
        "%windir%/System32/rundll32.exe powrprof.dll,SetSuspendState 0,1,0",
        commandErrHandler
      );
      return;
    case "logout":
      exec("%windir%/System32/shutdown.exe -l", commandErrHandler);
      return;
    case "shutdown":
      listener.close();
      exec("%windir%/System32/shutdown.exe -s", commandErrHandler);
      return;
    default:
      return;
  }
});
module.exports = router;
