## Why create this app?

To solve one of the most pressing issues to ever exist, fueled by the joy of creating a new applica... just kidding. Today, the rise of IoT devices, and software are irrefutable. The ability to use a voice assistant to control countless routines, scenes, and actions is extremely powerful and useful. Yet, despite being able to tell devices like lights to turn off with a voice, its shockingly complex to do the same with a Windows machine.

There are solutions that allow remote access to a Windows machine, like [Chrome’s Remote Desktop](https://remotedesktop.google.com) or [Window’s version](https://support.microsoft.com/en-us/windows/how-to-use-remote-desktop-5fe128d5-8fb1-7a23-3b8a-41e636865e8c), but they are complex to setup, and require additional configuration to allow them to react to a voice assistant. Unless someone has a good understanding of networking and technical administration, this can be a ton of work. If a user wants full control of their machine, then this complex setup should be done, and is the recommended approach.

However, if a user just wants log out, shutdown or put a machine to sleep, the same way we turn off lights with a voice command, this complex setup would be a waste of time. Therefore, this app was created. 

## How it works

This Node.js application runs as a [windows service](https://docs.microsoft.com/en-us/dotnet/framework/windows-services/introduction-to-windows-service-applications) with the help of [`node-windows`](https://www.npmjs.com/package/node-windows). This is the key difference from other solutions like [Join](https://chrome.google.com/webstore/detail/join/flejfacjooompmliegamfbpjjdlhokhj?hl=en), as they can only run while a user active, and logged in. However, a window service can always run, no matter who is signed in, or if the computer is locked. Therefore, if a user has set their computer to lock after a period inactivity, they don't have to sign back in to initate power controls.

This windows service launches an [`express`](https://expressjs.com) web server that uses a public callback url supplied by [`localtunnel`](https://github.com/localtunnel/localtunnel), to respond to `POST` requests from anywhere on the web. This allows us to use [webhooks](https://en.wikipedia.org/wiki/Webhook), to initiate a power control action (i.e logout, shutdown, sleep, etc) by supplying a [valid json payload](#json-payload) in the post request.

## Example Automation using IFTTT

#### Helpful Resources for this type of automation:
- Create an [IFTTT Applet](https://help.ifttt.com/hc/en-us/articles/115010361348-What-is-an-Applet-)
- Link [IFTTT and Google Assistant](https://support.google.com/googlenest/answer/7194656?hl=en&co=GENIE.Platform%3DDesktop&oco=1)

![Example Automation](./window_power_control_sleep_action.png)

## Installation

- [Install With GUI (Graphic User Interface)](./install/withGui/README.md)
- [Install Without GUI](./install/withoutGui/README.md)

## Configuration Variables

- `PORT`=`number` (**required**)

  This should be an accepted port value between 1024 to 49151, to prevent port duplication

- `PASSWORD`=`string` (**required**)

  This must configured, since this service will supply a public-facing url, that anyone in the internet may call.

  - To prevent unwanted access, ensure this [password is strong](https://support.microsoft.com/en-us/windows/create-and-use-strong-passwords-c5cebb49-8c53-4f5e-2bc4-fe357ca048eb).
  - Consider using a [password generator](https://www.lastpass.com/features/password-generator-a#generatorTool)

- `CUSTOM_SUB_DOMAIN`=`string` (**optional**)

  This allows the user to define an optional subdomain name.
  - Your urls will MOST likely take the following form: `https://pc-power-settings-*CUSTOM_SUB_DOMAIN*-*uuid*.loca.lt`
  - This subdomain name will have a `unique id` appended to the end off it, to prevent collisions.
  - **Note**: Behind the scenes, this application uses [`localtunnel`](https://github.com/localtunnel/localtunnel) to generate public-facing urls.

## JSON Payload

- `password`: `string` (**required**)

  - This should be the same string you have in your [`config.json`](#configuration-variables) file when you first installed the service.

- `action`: `sleep | shutdown | restart | hibernate | logout` (**required**)
  - The action the windows service should initate on the machine. Only one type is accepted.

## Turning a Computer on
Implementing this requires:

1. The use of [Wake-On-Lan](https://en.wikipedia.org/wiki/Wake-on-LAN)
   - Your computer must be connected to your network, via an ethernet cable, and your PC's motherboard/and or network card MUST support it. Most modern computers in the last decade do.
2. Another device (like a phone, or another computer), that is always on and connected to the local network.
3. Software on the other device, that will listen to a Cloud or SMS message, and trigger a Wake-On-Lan call. Below are some popular options:
    - [Automate](https://play.google.com/store/apps/details?id=com.llamalab.automate&hl=en_US&gl=US) (Andriod Only)
    - [Tasker](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm&hl=en_US&gl=US) (Andriod Only)
    - [Communication Triggers](https://support.apple.com/guide/shortcuts/communication-triggers-apdd711f9dff/ios) (iPhone Only)

#### Example Flow for Turning On a PC:

![Example Automation for Turning on Computer](./example_turn_on_computer.png)

For more information to turn on a PC with a voice assistant or a webhook, you can take a look at the following resources:

- [Voice Assistant](https://vishalvinjapuri.wordpress.com/2017/04/10/turning-on-your-computer-with-voice-alexa-and-ifttt/)
- [WebHook](https://medium.com/@pupdad/how-to-use-your-assistant-to-turn-on-your-pc-mac-the-right-way-2722add315df)
- [Communication Triggers](https://support.apple.com/guide/shortcuts/communication-triggers-apdd711f9dff/ios)