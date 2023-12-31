import { exec, execSync, ExecException } from "child_process";
import express from "express";
import configFile from "../../modifyFiles/configFile";

export const router = express.Router();
router.route("/").post(async (req, res) => {
  const body = req.body;
  if (body.password !== configFile.currConfig.PASSWORD)
    return res.send("You are not authorized to access this machine");
  const commandErrHandler = (
    err: ExecException | null,
    stdout: string,
    stderr: string
  ) => {
    if (err) return console.log(`error: ${err.message}`);
    if (stderr) return console.log(`stderr: ${stderr}`);
    console.log(stdout);
  };
  const responseStr = `Action ${body.action} initiated`;
  res.send(responseStr);
  try {
    switch (body.action) {
      case "sleep":
        execSync("powercfg -hibernate off");
        exec(
          "%windir%/System32/rundll32.exe powrprof.dll,SetSuspendState 0,1,0",
          commandErrHandler
        );
        return;
      case "hibernate":
        execSync("powercfg -hibernate on");
        exec("%windir%/System32/shutdown.exe -h", commandErrHandler);
      case "logout":
        exec("%windir%/System32/shutdown.exe -l", commandErrHandler);
        return;
      case "restart":
        exec("%windir%/System32/shutdown.exe -r", commandErrHandler);
        return;
      case "shutdown":
        exec("%windir%/System32/shutdown.exe -s -hybrid", commandErrHandler);
        return;
      default:
        return;
    }
  } catch (err) {
    console.error(err);
  }
});
