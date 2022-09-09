const { app, BrowserWindow, ipcMain, shell } = require("electron");
const generator = require("generate-password");
const { stringify } = require("envfile");
const { v4: uuid } = require("uuid");
const dotenv = require("dotenv");
const path = require("path");
const configPath = path.join(__dirname, "..", "config.env");
const fs = require("fs/promises");
const serviceInstall = require(path.join(
  __dirname,
  "..",
  "service_app/service_files/serviceInstall"
));
const serviceUninstall = require(path.join(
  __dirname,
  "..",
  "service_app/service_files/serviceUninstall"
));
let win = null;
const createWindow = () => {
  //create browser window
  win = new BrowserWindow({
    width: 900,
    height: 800,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  //html
  win.loadFile(path.join(__dirname, "index.html"));
};

app.whenReady().then(createWindow);

ipcMain.on("generatePassword", (event, data) => {
  const randomPassword = generator.generate({
    length: 15,
    symbols: true,
    numbers: true,
    lowercase: true,
    uppercase: true,
  });
  win.webContents.send("recievePassword", randomPassword);
});
ipcMain.on("showPassword", () => win.webContents.send("showPassword"));
ipcMain.on("showCurrPassword", () => {
  const { parsed: configFile } = dotenv.config({ path: configPath });
  win.webContents.send("recieveCurrPassword", configFile.PASSWORD);
});
ipcMain.on("generateDomainName", () => {
  const newName = uuid();
  win.webContents.send("recieveDomainName", newName);
});
ipcMain.on("submitConfig", async (event, data) => {
  const newData = {
    PORT: data.filter(([key, value]) => key === "port")[0][1],
    PASSWORD: data.filter(([key, value]) => key === "password")[0][1],
    CUSTOM_SUB_DOMAIN: data.filter(
      ([key, value]) => key === "custom-sub-domain"
    )[0][1],
  };
  //write to config file
  try {
    await fs.writeFile(configPath, stringify(newData));
    console.log("Config File Written to User Input");
  } catch (e) {
    console.error(e);
  }
  //uninstall current service
  serviceUninstall(() => {
    //start new service
    serviceInstall(() => {
      //send data to renderer
      //time to start server and modify config
      const sendEvent = setInterval(() => {
        const { parsed: configFile } = dotenv.config({ path: configPath });
        if (configFile.PUBLIC_CALLBACK_URL) {
          win.webContents.send("submitConfigRecieved", configFile);
          //stop polling for changes
          clearInterval(sendEvent);
        }
      }, 2000);
    });
  });
});
ipcMain.on("onLoad", () => {
  const { parsed: configFile } = dotenv.config({ path: configPath });
  win.webContents.send("onLoad", {
    ...configFile,
    currDirectory: path.join(__dirname, ".."),
  });
});
ipcMain.on("uninstall", () => {
  serviceUninstall(async () => {
    try {
      await fs.unlink(configPath);
      app.quit();
    } catch (e) {
      console.log("Config file was already deleted");
      app.quit();
    }
  });
});
ipcMain.on("openFileExplorer", (event, data) => {
  shell.openPath(data);
});
