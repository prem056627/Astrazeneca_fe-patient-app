# Run local webview with react native app

1. run react app & expose it with serveo

    you'll find on python script in this directory with name `serveo_tunnel.py`. run below command

```
python3 serveo_tunnel.py --host <localhost> --port <port> --subdomain <subdomain>
```

```
<localhost> : your local domain where your app is currently running
<port> : your local port which you want to expose
<subdomain> : this subdomain will be assign to your exposed port
```

    you have to authorise serveo with google or github on first run for persistant domain

2. setup domain in `vite.config.ts`
    once serveo is running you'll get domain where your react app is exposed, you need to add that domain in vite config under `server.allowedHosts: ["<your_domain>.serveo.net"]`, and start the server.


3. update .env file to use dev environment and update `dev.apiUrl` to serveo domain in `app-react-native/app.config.js`


4. remove path `/common/mobile_app/` from `app-react-native/app/webview.js` webview `source.uri` and run the native app. (revert it back before pushing the changes)

Make sure your proxy is correctly setup in vite.config.ts