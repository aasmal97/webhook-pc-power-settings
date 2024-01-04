import axios from "axios";
import fs from "fs";
import path from "path";
export let execPath: string = path.join(__dirname, "node.exe");
export const downloadLatestNode = async () => {
  //download node 21.5 currently tested to work
  const response = await axios.get(
    "https://nodejs.org/dist/v21.5.0/win-x64/node.exe",
    { responseType: "stream" }
  );

  if (response.status !== 200) {
    throw new Error("Failed to download Node.js executable");
  }

  const dest = fs.createWriteStream(path.join(__dirname, "node.exe"));
  response.data.pipe(dest);

  return new Promise((resolve, reject) => {
    dest.on("finish", () => {
      resolve("Node Exec Downloaded");
    });
    dest.on("error", (err) => {
      reject(err);
    });
  });
};
export const determineExecPath = async () => {
  //determine execPath based on node.exe location
  //needed since node.exe  is needed inside this script's directory
  // to package app for distribution
  try {
    if (!fs.existsSync(path.join(__dirname, "node.exe"))) {
      await downloadLatestNode();
    }
    execPath = path.join(__dirname, "node.exe");
  } catch (e) {
    console.log(
      "Consider moving a copy of your node.exe into the service files directory. This will allow you to package this app for distrubtion."
    );
    return null;
  }
  return execPath;
};
