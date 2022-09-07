const { exec } = require("child_process");
const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
require("dotenv").config({ path: "./config.env" });
const localtunnel = require("localtunnel");
const publicSubDomain = `control-pc-power-settings-${process.env.CUSTOM_DOMAIN}`;
//expose port
(async () => {
  const tunnel = await localtunnel({
    port: process.env.PORT ? process.env.PORT : 5000,
    subdomain: publicSubDomain,
  });
  // the assigned public url for your tunnel
  // i.e. https://abcdefgjhij.localtunnel.me
  const url = tunnel.url
  console.log(url);
  tunnel.on("close", () => {
    // tunnels are closed
  });
})();
//support cross orgin scripting
const corsOptions = {
  origin: ["*"],
  optionsSuccessStatus: 200,
};
// add middleware set-up
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
//coverts requests to json
app.use(express.json());
//routes
router.route("/").post(async (req, res) => {
  const body = req.body;
  if (body.password !== process.env.PASSWORD) return;
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
      exec("%windir%/System32/shutdown.exe -s", commandErrHandler);
      return;
    default:
      return;
  }
  //sleep command
});
//listen to port
app.use("/", router);

const listener = app.listen(process.env.PORT ? process.env.PORT : 5000, () => {
  console.log("server running on port " + listener.address().port);
});
