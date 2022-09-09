const { ipcRenderer } = require("electron");
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
  ipcRenderer.send("submitConfig", [...data.entries()]);
};
const showCurrPassword = () => {
  ipcRenderer.send("showCurrPassword");
};
ipcRenderer.on("recieveCurrPassword", (event, data) => {
  document.getElementById("current-password").textContent = data;
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
  document.getElementById("current-port-input").textContent = data.PORT;
  document.getElementById("public-callback-url").textContent =
    data.PUBLIC_CALLBACK_URL;
  document.getElementById("current-custom-sub-domain").textContent =
    data.CUSTOM_SUB_DOMAIN;
});
