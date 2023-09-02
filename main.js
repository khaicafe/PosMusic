const { app, BrowserWindow } = require('electron');
const {autoUpdater} = require('electron-updater')
// make log electron cmd
const log = require('electron-log')
log.transports.file.resolvePath = () => path.join(__dirname, 'log/main.log')
log.info('Hello, log')
log.warn('some problem appears')
// yarn make --arch=ia32
// app.commandLine.appendSwitch('openssl-legacy-provider');
const path = require('path');
// khởi động cùng window ds
// app.setLoginItemSettings({
//   openAtLogin: true,
//   // openAsHidden: true,
//   path: app.getPath('exe'),
// });

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}
// const filePath = path.resolve(__dirname, 'config.ini');
const filePath = path.join(__dirname, 'config.ini');
// console.log(filePath);

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // width: 350,
    // height: 220,
    width: 1250,
    height: 850,
    maximizable: false, // Vô hiệu hóa maximize
    webPreferences: {
    //   preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true
    }
  })
  

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
mainWindow.on('minimize',function(event){
event.preventDefault();
});

mainWindow.on('close', function (event) {
    event.preventDefault();
       
});
mainWindow.setMenu(null)
mainWindow.setMenuBarVisibility(false)
mainWindow.resizable = false;
  // Open the DevTools.
  mainWindow.webContents.openDevTools()
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

  // update laucher
  autoUpdater.checkForUpdatesAndNotify()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// event autoupdate
autoUpdater.on("update-available", () => {
    log.info('update-available')
})

autoUpdater.on("checking-for-update", () => {
    log.info('checking-for-update')
})

autoUpdater.on("download-progress", () => {
    log.info('download-progress')
})

autoUpdater.on("update-downloaded", () => {
    log.info('update-downloaded')
})