# Install Windows Service w/o GUI
## Prerequisites
1. Your machine must be running Windows 8+

2. You must have `Node.js v16+` installed. 
    - To install, please go [here](https://nodejs.org/dist/v16.17.0/)

    - Click on `node-v16.17.0-x64.msi` or `node-v16.17.0-x86.msi`   

    - Note: You can attempt to use a newer `Node.js` version, but this may cause bugs to arise.
    
## Setup
1. Ensure you satisfy all the [requirements](#prerequisites)

2. Install all dependencies by running `npm install` in your terminal

3. Create a `config.txt` file in the root of the directory, and add the accepted [#configuration-variables](../README.md/#configuration-variables)

## Installation

1. Run `npm run service:install` in your terminal, to install the windows service worker

2. Open your `config.txt` file again. The `PUBLIC_CALLBACK_URL` value is the url you should make post requests to. 
## Uninstall Application
To uninstall, run `npm run service:uninstall` in your terminal 

**Note**: This will uninstall the service worker. You must delete all app files manually by deleting the directory