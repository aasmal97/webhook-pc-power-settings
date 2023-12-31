import generator from "generate-password";
import { app, ipcMain, shell, dialog } from "electron";
import path from "path";
import configFile from "../../modifyFiles/configFile";
import { v4 as uuid } from "uuid";
import { serviceInstall } from "../../service_app/service_files/serviceInstall";
import { serviceUninstall } from "../../service_app/service_files/serviceUninstall";
import { Main } from "./main";
export const initalizeListeners = () => {
  //add listeners
  ipcMain.on("generatePassword", (event, data) => {
    const randomPassword = generator.generate({
      length: 20,
      symbols: true,
      numbers: true,
      lowercase: true,
      uppercase: true,
      exclude: '"\\',
    });
    Main.win?.webContents.send("recievePassword", randomPassword);
  });
  ipcMain.on("showCurrPassword", async () => {
    Main.win?.webContents.send("recieveCurrPassword", configFile.currConfig.PASSWORD);
  });
  ipcMain.on("generateDomainName", () => {
    const newName = uuid();
    Main.win?.webContents.send("recieveDomainName", newName);
  });
  ipcMain.on("submitConfig", async (event, data: [string, string][]) => {
    const newData = {
      PORT: parseInt(data.filter(([key, value]) => key === "port")[0][1]),
      PASSWORD: data.filter(([key, value]) => key === "password")[0][1],
      CUSTOM_SUB_DOMAIN: data.filter(
        ([key, value]) => key === "custom-sub-domain"
      )[0][1],
    };
    //write to config file
    try {
      const data = await configFile.setConfig(newData);
      console.log("Config File Written to User Input", `data: ${data}`);
    } catch (e) {
      console.error(e);
    }
    //start new service
    await serviceInstall();
    //send data to renderer
    //time to start server and modify config
    const sendEvent = setInterval(async () => {
      if (configFile.currConfig.PUBLIC_CALLBACK_URL) {
        Main.win?.webContents.send(
          "submitConfigRecieved",
          configFile.currConfig
        );
        //stop polling for changes
        clearInterval(sendEvent);
      }
    }, 2000);
  });
  ipcMain.on("onLoad", async () => {
    Main.win?.webContents.send("onLoad", {
      ...configFile.currConfig,
      currDirectory: path.join(__dirname, ".."),
    });
  });
  ipcMain.on("uninstall", async () => {
    const result = await serviceUninstall();
    console.log(`Uninstall was ${result ? "successful" : "unsuccessful"}`);
    try {
      const btnClicked = dialog.showMessageBoxSync({
        title: "Finish Uninstall",
        message: `To finish deleting app data, go to your Control Panel`,
        buttons: ["Control Panel", "Cancel"],
      });
      if (btnClicked === 0)
        await shell.openPath("C:/Windows/system32/control.exe");
      app.quit();
    } catch (e) {
      const btnClicked = dialog.showMessageBoxSync({
        title: "Finish Uninstall",
        message: `To finish deleting app data, go to your Control Panel`,
        buttons: ["Control Panel", "Cancel"],
      });
      if (btnClicked === 0)
        await shell.openPath("C:/Windows/system32/control.exe");
      app.quit();
    }
  });
  ipcMain.on("openFileExplorer", (event, data) => {
    shell.openPath(data);
  });
};
