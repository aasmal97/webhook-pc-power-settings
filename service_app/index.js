const express = require("express");
const cors = require("cors");
const createLocalTunnel = require("./generateLocalTunnel");
const postRoute = require("./routes/post")
const app = express();
const dotenv = require("dotenv")
//parses environment variables
dotenv.config({ path: "../config.env" });

//create local tunnel
createLocalTunnel()
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
const listener = app.listen(process.env.PORT ? process.env.PORT : 5000, () => {
  console.log("server running on port " + listener.address().port);
});
