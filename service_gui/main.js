const { app, BrowserWindow, ipcMain } = require("electron");
const generator = require("generate-password");
const { stringify } = require("envfile");
const { v4: uuid } = require("uuid");
const dotenv = require("dotenv");
const configPath = "../config.env"
const fs = require('fs/promises')
let win = null;
const createWindow = () => {
  //create browser window
  win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  //html
  win.loadFile("index.html");
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
ipcMain.on('showCurrPassword',() => {
    
})
ipcMain.on("generateDomainName", () => {
  const newName = uuid();
  win.webContents.send("recieveDomainName", newName);
});
ipcMain.on("submitConfig", async(event, data) => {
    const newData = {
      PORT: data.filter(([key, value]) => key === "port")[0],
      PASSWORD: data.filter(([key, value]) => key === "password")[0],
      CUSTOM_SUB_DOMAIN: data.filter(
        ([key, value]) => key === "custom-sub-domain"
        )[0]
    };
    //write to config file
    await fs.writeFile(configPath, stringify(newData))
    //end any ongoing service

    //start service

    //send data to renderer
    setTimeout(async () => {
        const { parsed: configFile } = dotenv.config({ path: configPath });
        win.webContents.send("submitConfigRecieved", configFile);
    }, 2000)
});

