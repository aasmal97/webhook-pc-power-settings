const { ipcRenderer } = require("electron");
const addFormInputs = (data) => {
  document.getElementById("curr-config-variables").style = "";
  document.getElementById("current-port-input").textContent = data.PORT;
  document.getElementById("public-callback-url").textContent =
    data.PUBLIC_CALLBACK_URL;
  const loadingIcon = document.getElementById("loading-icon");
  loadingIcon.style = "display:none";
};
const createLoadingIcon = () => {
  const loadingIcon = document.getElementById("loading-icon");
  loadingIcon.style = "";
};
const generatePassword = () => {
  ipcRenderer.send("generatePassword");
};
const showPassword = () => {
  ipcRenderer.send("showPassword");
};
const generateDomainName = () => {
  ipcRenderer.send("generateDomainName");
};
const submitConfig = (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
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
  ipcRenderer.send("uninstall");
};
const clickLink = (event) => {
  event.preventDefault();
  ipcRenderer.send("openFileExplorer", event.target.href);
};
ipcRenderer.on("recieveCurrPassword", (event, data) => {
  const el = document.getElementById("current-password");
  const btn = document.getElementById("show-current-password");
  if (btn.textContent === "Show Password") {
    el.textContent = data;
    btn.textContent = "Hide";
    const paragraphActive = {
      "background-color": "rgb(250, 250, 250)",
      border: "1px solid rgb(129, 129, 129)",
      padding: "6px",
      "font-size": "12px",
      color: "rgb(94, 94, 94)",
      "border-radius": "5px",
      "margin-bottom": "5px !important",
    };
    const styleProps = Object.entries(paragraphActive).reduce(
      (a, [key, value]) => `${a};${key}:${value}`
    );
    el.style = styleProps;
  } else {
    el.style = "";
    el.textContent = "";
    btn.textContent = "Show Password";
  }
});
ipcRenderer.on("recievePassword", (event, data) => {
  document.getElementById("password-input").value = data;
});
ipcRenderer.on("showPassword", () => {
  const btn = document.getElementById("show-password-btn");
  const x = document.getElementById("password-input");
  if (x.type === "password") {
    x.type = "text";
    btn.classList.remove("fa-eye");
    btn.classList.add("fa-eye-slash");
  } else {
    x.type = "password";
    btn.classList.remove("fa-eye-slash");
    btn.classList.add("fa-eye");
  }
});
ipcRenderer.on("recieveDomainName", (event, data) => {
  document.getElementById("custom-sub-domain-input").value = data;
});
ipcRenderer.on("submitConfigRecieved", (event, data) => {
  addFormInputs(data);
});
ipcRenderer.on("onLoad", (event, data) => {
  if (data.PUBLIC_CALLBACK_URL && data.PORT) {
    //reveal current settings
    addFormInputs(data);
  }
  const uninstallFooter = document.getElementById("uninstall-footnote");
  //update current directory
  const link = uninstallFooter.querySelector("a");
  link.textContent = `Directory: '${data.currDirectory}'`;
  link.href = `file://${data.currDirectory.replaceAll("\\", "/")}`;
  const loadingIcon = document.getElementById("loading-icon");
  loadingIcon.style = "display:none";
});
