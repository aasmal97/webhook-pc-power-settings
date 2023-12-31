import { EventLogger } from "node-windows";
const eventLog = new EventLogger({
  source: "Webhook PC Power Control Server",
});
export default eventLog;
