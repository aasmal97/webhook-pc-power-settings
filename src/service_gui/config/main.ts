import { BrowserWindow } from "electron";
import path from "path";
export class Main {
  static win: BrowserWindow | null = null;
  static application: Electron.App;
  static BrowserWindow = BrowserWindow;
  private static onWindowAllClosed() {
    if (process.platform !== "darwin") {
      Main.application.quit();
    }
  }
  private static onClose() {
    Main.win = null;
  }
  private static onReady() {
    //create browser window
    Main.win = new Main.BrowserWindow({
      width: 900,
      height: 800,
      resizable: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        // preload: path.join(__dirname, "preload.js"),
        // enableRemoteModule: true,
      },
    });
    //html
    Main.win.loadFile(path.join(__dirname, "..", "public", "index.html"));

    Main.win.on("closed", Main.onClose);
  }
  static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    // we pass the Electron.App object and the
    // Electron.BrowserWindow into this function
    // so this class has no dependencies. This
    // makes the code easier to write tests for
    Main.BrowserWindow = browserWindow;
    Main.application = app;
    Main.application.on("window-all-closed", Main.onWindowAllClosed);
    Main.application.on("ready", Main.onReady);
  }
}
