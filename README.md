## Prerequisites
1. Your machine must be run Windows 8+

2. You must have `Node.js v16+` installed. 
    - To install, please go [here](https://nodejs.org/dist/v16.17.0/)
    
    - Click on `node-v16.17.0-x64.msi` or `node-v16.17.0-x86.msi`   
    
    - Note: You can attempt to use a newer `Node.js` version, but this may cause bugs to arise.

## Why create this app?
To solve one of the most pressing issues to ever exist, fueled by the joy of creating a new applica... just kidding. Today, the rise of IoT devices, and software are irrefutable. The ability to use a voice assistant to control countless routines, scenes, and actions is extremely powerful and useful. Yet, despite being able to tell devices as simple as lights to turn off with a voice, its shockingly complex to do the same with a Windows machine.
There are solutions that allow remote access to a Windows machine, like [Chrome’s Remote Desktop](https://remotedesktop.google.com) or [Window’s version](https://support.microsoft.com/en-us/windows/how-to-use-remote-desktop-5fe128d5-8fb1-7a23-3b8a-41e636865e8c), but are complex to setup, and even then, additional configuration is required to allow them to react to a voice assistant. Unless someone has good understanding of networking and technical administration, this can be a ton of work. If a user wants to control their machine from opening files to  installing applications, then this setup should be done, and is the recommended approach. 
However, if a user just wants log out, shut down or put a machine to sleep, the same way we turn off lights with a voice command, this would be a waste of time. Therefore, this app was created. 

## How it works
This Node.js application runs as a [windows service](https://docs.microsoft.com/en-us/dotnet/framework/windows-services/introduction-to-windows-service-applications) with the help of [`node-windows`](https://www.npmjs.com/package/node-windows). This service launches an [`express`](https://expressjs.com) web server that uses a public callback url supplied by [`localtunnel`](https://github.com/localtunnel/localtunnel), to respond to `POST` requests from anywhere on the web. This allows us to use [webhooks](https://en.wikipedia.org/wiki/Webhook), to initiate a logout, shutdown, or sleep action, by supplying a [valid json payload](#json-payload) in the post method.

## Example Workflow
![Example Workflow](./window_power_control_sleep_action.png)

## Setup
1. Ensure you satisfy all the [requirements](#prerequisites)

2. Install all dependencies by running `npm install` in your terminal

3. Create a `config.env` file, and add the accepted [environment variables](#environment-variables)

## Installation

Run `npm run service:install` in your terminal, to install the windows service worker

## Environment Variables
  - `PORT`: `number` (**required**)
  
     This should be an accepted port value between 1024 to 49151, to prevent port duplication
      
  - `PASSWORD`: `string` (**required**)
  
     This must configured, since this service will supply a public-facing url, that anyone in the internet may call. 
     - To prevent unwanted access, ensure this [password is strong](https://support.microsoft.com/en-us/windows/create-and-use-strong-passwords-c5cebb49-8c53-4f5e-2bc4-fe357ca048eb).
     - Consider using a [password generator](https://www.lastpass.com/features/password-generator-a#generatorTool)
  - `CUSTOM_SUB_DOMAIN`: `string` (**optional**)
      
      This allows the user to define an optional subdomain name. 
          1. You are not guarenteed to be given your custom name, as it depends on availability 
          2. To improve your odds, consider using a [uuid generator](https://www.uuidgenerator.net) for the name
          3. Your urls will MOST likely take the following form: `https://pc-power-settings-*CUSTOM_SUB_DOMAIN*.loca.lt`
          4. **Note**: Behind the scenes, this application uses [`localtunnel`](https://github.com/localtunnel/localtunnel) to generate public-facing urls. 
## JSON Payload
- `password`: `string` (**required**)
    
    - This should be the same string you have in your config.env file when you first installed the service.

- `action`: `sleep | logout | shutdown` (**required**)
    
    - The action the windows service should initate on the machine
## Uninstall Application

To uninstall, run `npm run service:uninstall` in your terminal 

**Note**: This will uninstall the service worker and delete all app files. This is an unrecoverable process.
