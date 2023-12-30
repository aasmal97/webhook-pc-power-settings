import { app, BrowserWindow } from "electron";
import { Main } from "./config/main";
import { initalizeListeners } from "./config/listeners";
//start app
Main.main(app, BrowserWindow);
//attach listeners to app
initalizeListeners();
