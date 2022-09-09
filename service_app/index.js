const express = require("express");
const cors = require("cors");
const createLocalTunnel = require("./generateLocalTunnel");
const path = require('path')
const postRoute = require("./routes/post");
const app = express();
const dotenv = require("dotenv");
const configPath = path.join(__dirname, "..", "config.env");
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
