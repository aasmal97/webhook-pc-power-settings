import express from "express";
import cors from "cors";
import { createLocalTunnel } from "./utils/generateLocalTunnel";
import configFile from "../modifyFiles/configFile";
import { router as postRoute } from "./routes/post";
import eventLog from "./utils/EventLogger";
const app = express();
export const startServer = async () => {
  //create local tunnel
  eventLog.info("Creating Local Tunnel");
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
  const listener = app.listen(
    configFile.currConfig.PORT ? configFile.currConfig.PORT : 5000,
    () => {
      const address = listener?.address();
      const port = typeof address === "object" ? address?.port || 5000 : 5000;
      //write to event log
      eventLog.info(
        "server running on port " + port + ` and public callback is ${url.url}`
      );
    }
  );
};
//run script through node
if (typeof require !== "undefined" && require.main === module) {
  startServer();
}
