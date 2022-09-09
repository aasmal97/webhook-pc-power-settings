const express = require("express");
const cors = require("cors");
const path = require("path");
const createLocalTunnel = require(path.join(__dirname, "generateLocalTunnel"));
const postRoute = require(path.join(__dirname, "routes/post"));
const dotenv = require("dotenv");
const configPath = path.join(__dirname, "..", "config.env");
const app = express();
const startServer = async () => {
  //parses environment variables
  dotenv.config({ path: configPath });
  //create local tunnel
  await createLocalTunnel();
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
  const listener = app.listen(
    process.env.PORT ? process.env.PORT : 5000,
    () => {
      console.log("server running on port " + listener.address().port);
    }
  );
};
//run script through node
if (typeof require !== "undefined" && require.main === module) {
  startServer();
}
module.exports = startServer;
