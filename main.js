// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const RPC = require("discord-rpc");
const { DataTransfer, Date, console } = require('globalthis/implementation');

// discord rpc
const rpc = new RPC.Client({
  transport: "ipc"
});

 rpc.on("ready", () => {
  rpc.setActivity({
    details: "Using Wrapper Electron",
    state: "Making A Video",
    startTimestamp: new Date(),
    largeImageKey: "icon",
    largeImageText: "Wrapper Electron",
    smallImageKey: "Wrapper Electron",
    smallImagetext: "Wrapper electron!!",
  });


  console.log("Rich presence is on!")
});
rpc.login({
  clientId: "783041498010484817"
});
function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });
  
  // and load the index.html of the app.
  mainWindow.loadFile('html/wrapper.html')

  
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


const env = Object.assign(process.env, require("./wrapper/env"), require("./wrapper/config"));

const http = require("http");
const chr = require("./wrapper/character/redirect");
const pmc = require("./wrapper/character/premade");
const chl = require("./wrapper/character/load");
const chs = require("./wrapper/character/save");
const cht = require("./wrapper/character/thmb");
const mvu = require("./wrapper/movie/upload");
const asu = require("./wrapper/asset/upload");
const stl = require("./wrapper/static/load");
const stp = require("./wrapper/static/page");
const asl = require("./wrapper/asset/load");
const asL = require("./wrapper/asset/list");
const ast = require("./wrapper/asset/thmb");
const mvl = require("./wrapper/movie/load");
const mvL = require("./wrapper/movie/list");
const mvm = require("./wrapper/movie/meta");
const mvs = require("./wrapper/movie/save");
const mvt = require("./wrapper/movie/thmb");
const thL = require("./wrapper/theme/list");
const thl = require("./wrapper/theme/load");
const tsv = require("./wrapper/tts/voices");
const tsl = require("./wrapper/tts/load");
const url = require("url");

const functions = [mvL, pmc, asl, chl, thl, thL, chs, cht, asL, tsl, chr, ast, mvm, mvl, mvs, mvt, tsv, asu, mvu, stp, stl];

module.exports = http
	.createServer((req, res) => {
		try {
			const parsedUrl = url.parse(req.url, true);
			//if (!parsedUrl.path.endsWith('/')) parsedUrl.path += '/';
			const found = functions.find((f) => f(req, res, parsedUrl));
			console.log(req.method, parsedUrl.path);
			if (!found) {
				res.statusCode = 404;
				res.end();
			}
		} catch (x) {
			res.statusCode = 404;
			res.end();
		}
	})
	.listen(env.PORT || env.SERVER_PORT, console.log);

