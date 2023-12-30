import axios from "axios";
import fs from "fs";
import path from "path";
export const downloadLatestNode = async () => {
  const response = await axios.get(
    "https://nodejs.org/dist/latest/win-x64/node.exe",
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
