const express = require("express");
const cors = require("cors");
const path = require("path");
const createLocalTunnel = require(path.join(__dirname, "generateLocalTunnel"));
const postRoute = require(path.join(__dirname, "routes/post"));
const readConfigFile = require(path.join(
  __dirname,
  "..",
  "modifyFiles/readConfigFile"
));
// const readConfigFile = require(path.join(
//   __dirname,
//   "../modifyFiles/readConfigFile.js"
// ));
// const createLocalTunnel = require("./generateLocalTunnel.js");
// const postRoute = require("./routes/post.js");
// const readConfigFile = require("../modifyFiles/readConfigFile.js");
const configPath = path.join(__dirname, "../config.txt");

const app = express();
const startServer = async () => {
  //parses environment variables
  const configFile = await readConfigFile(configPath);
  //create local tunnel
  const url = await createLocalTunnel();

  //support all orgins
  const corsOptions = {
    origin: ["*"],
    optionsSuccessStatus: 200,
  };
  // add middleware set-up
  app.use(cors(corsOptions));
  app.use(express.urlencoded({ extended: true }));
  //coverts requests to json
  app.use(express.json());
  //set up routes
  app.use("/", postRoute);
  //listen to port
  const listener = app.listen(configFile.PORT ? configFile.PORT : 5000, () => {
    console.log(
      "server running on port " +
        listener.address().port +
        ` and public callback is ${url}`
    );
  });
};
//run script through node
if (typeof require !== "undefined" && require.main === module) {
  startServer();
}
module.exports = startServer;
