import express from "express";
import cors from "cors";
import { createLocalTunnel } from "./generateLocalTunnel";
import configFile from "../config.json";
import { router as postRoute } from "./routes/post";
const app = express();
export const startServer = async () => {
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
    const address = listener?.address();
    const port = typeof address === "object" ? address?.port || 5000 : 5000;
    console.log(
      "server running on port " + port + ` and public callback is ${url}`
    );
  });
};
//run script through node
if (typeof require !== "undefined" && require.main === module) {
  startServer();
}