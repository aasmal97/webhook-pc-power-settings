import { ipcRenderer } from "electron";
const hideLoadingIcon = () => {
  const loadingIcon = document.getElementById("loading-icon");
  if (loadingIcon) loadingIcon.setAttribute("style", "display:none");
};
const createLoadingIcon = () => {
  const loadingIcon = document.getElementById("loading-icon");
  if (loadingIcon) loadingIcon.setAttribute("style", "");
};
const addFormInputs = (data: { [key: string]: string | number }) => {
  document.getElementById("curr-config-variables")?.setAttribute("style", "");
  const portInput = document.getElementById("current-port-input");
  const callbackUrlInput = document.getElementById("public-callback-url");
  if (portInput) portInput.textContent = data?.PORT?.toString();
  if (callbackUrlInput)
    callbackUrlInput.textContent = data?.PUBLIC_CALLBACK_URL?.toString();
  hideLoadingIcon();
};
const generatePassword = () => {
  ipcRenderer.send("generatePassword");
};
const showPassword = () => {
  const btn = document.getElementById("show-password-btn");
  const passwordInput = document.getElementById(
    "password-input"
  ) as HTMLInputElement;
  if (passwordInput?.type === "password") {
    passwordInput.type = "text";
    btn?.classList.remove("fa-eye");
    btn?.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    btn?.classList.remove("fa-eye-slash");
    btn?.classList.add("fa-eye");
  }
};
const checkPassword = (event: KeyboardEvent) => {
  const key = event.key;
  if (key.includes('"') || key.includes("\\")) event.preventDefault();
};
const generateDomainName = () => {
  ipcRenderer.send("generateDomainName");
};
const submitConfig = (event: SubmitEvent) => {
  event.preventDefault();
  const data = new FormData(event.target as HTMLFormElement);
  createLoadingIcon();
  ipcRenderer.send("submitConfig", [...data.entries()]);
};
const showCurrPassword = () => {
  ipcRenderer.send("showCurrPassword");
};
const onLoad = () => {
  ipcRenderer.send("onLoad");
  createLoadingIcon();
};
const uninstall = () => {
  createLoadingIcon();
  ipcRenderer.send("uninstall");
};
const clickLink = (event: Electron.Event) => {
  event.preventDefault();
  const target = event.target as HTMLAnchorElement;
  ipcRenderer.send("openFileExplorer", target.href);
};
ipcRenderer.on("recieveCurrPassword", (event, data) => {
  const currPasswordInput = document.getElementById("current-password");
  const btn = document.getElementById("show-current-password");
  if (btn?.textContent === "Show Password") {
    if (currPasswordInput) currPasswordInput.textContent = data;
    if (btn) btn.textContent = "Hide";
    const paragraphActive = {
      "background-color": "rgb(250, 250, 250)",
      border: "1px solid rgb(129, 129, 129)",
      padding: "6px",
      "font-size": "12px",
      color: "rgb(94, 94, 94)",
      "border-radius": "5px",
      "margin-bottom": "5px !important",
    };
    const stylePropsEntries = Object.entries(paragraphActive);
    const styleProps = stylePropsEntries.reduce(
      (a, [key, value]) => `${a};${key}:${value}`,
      ""
    );
    currPasswordInput?.setAttribute("style", styleProps);
  } else {
    currPasswordInput?.setAttribute("style", "");
    if (currPasswordInput) currPasswordInput.textContent = "";
    if (btn) btn.textContent = "Show Password";
  }
});
ipcRenderer.on("recievePassword", (event, data) => {
  const passwordInput = document.getElementById(
    "password-input"
  ) as HTMLInputElement;
  if (passwordInput) passwordInput.value = data;
});
ipcRenderer.on("recieveDomainName", (event, data) => {
  const subdomainInput = document.getElementById(
    "custom-sub-domain-input"
  ) as HTMLInputElement;
  if (subdomainInput) subdomainInput.value = data;
});
ipcRenderer.on("submitConfigRecieved", (event, data) => {
  console.log("submitConfigRecieved", data);
  addFormInputs(data);
});
ipcRenderer.on("onLoad", (event, data) => {
  if (data.PUBLIC_CALLBACK_URL && data.PORT) {
    //reveal current settings
    addFormInputs(data);
  }
  const uninstallFooter = document.getElementById("uninstall-footnote");
  //update current directory
  const link = uninstallFooter?.querySelector("a");
  if (link) {
    link.href = "file:///C:/Windows/system32/control.exe";
    link.textContent = "Control Panel";
  }
  //link.textContent = `Directory: '${data.currDirectory}'`;
  //link.href = `file://${data.currDirectory.replaceAll("\\", "/")}`;
  hideLoadingIcon();
});
