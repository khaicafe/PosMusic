// yarn make --arch=ia32 // old dùng electron forge
// yarn package // electron build
const { app, dialog, BrowserWindow, ipcMain, contextBridge } = require('electron');

app.commandLine.appendSwitch ("disable-http-cache");
const path = require('path');
const fs = require('fs-extra');
const {autoUpdater} = require('electron-updater')


const isDev = require("electron-is-dev");
// make log electron cmd
const log = require('electron-log')
var pjson = require('./package.json');

log.log("Application version = " + pjson.version);

///////////////////////////////////////// path root //////////////////////////////
let rootDir = app.getAppPath()
let last = path.basename(rootDir)
if (last == 'app.asar') {
    rootDir = path.dirname(app.getPath('exe'))
}
// Lắng nghe sự kiện từ render process send path config to renderer.js
ipcMain.on('send-path', (event) => {
  const appPath = app.getPath('appData');
  event.reply('path-reply', rootDir);
});

////////////////////////////////////////   ////////////////////////////////////

const localAppDataPath = path.join(app.getPath('appData'), '..', 'Local'); // Đường dẫn đến thư mục cần xóa
const folderD = localAppDataPath + '\\' +pjson.name + '-updater'
// const folderLog = `${path.join(localAppDataPath)}/log`
const folderLog = `${path.join(rootDir)}/log`
console.log('log', folderLog)
// log.transports.file.resolvePath = () => path.join(localAppDataPath, '/log/NeoMusic.log')
log.transports.file.resolvePath = () => path.join(folderLog, '/NeoMusic.log')

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
let mainWindow
let updateDownloaded = false;

// khởi động cùng window ds
app.setLoginItemSettings({
  openAtLogin: true,
  // openAsHidden: true,
  path: app.getPath('exe'),
});
// Delete folder update
fs.remove(folderD, (err) => {
  if (err) {
    console.error('Error deleting folder:', err);
  } else {
    console.log('Folder deleted successfully');
  }
});
// Delete folder Log
fs.remove(folderLog, (err) => {
  if (err) {
    console.error('Error deleting folder:', err);
  } else {
    console.log('Folder deleted successfully');
  }
});

/////////////////////////// send render /////////////////////////
// send value for ui  // Gửi dữ liệu từ main process sang render process
const dispatch = (data) => {
    mainWindow.webContents.send('message', data)
  }
// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) { app.quit();}

// const filePath = path.resolve(__dirname, 'config.ini');
// const filePath = path.join(__dirname, 'config.ini');
// console.log(filePath);

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    // x: 0,
    // y: 0,
    // width: 350,
    // height: 225,
    width: 650,
    height: 430,
    icon: __dirname + '/icon.ico',
    maximizable: false, // Vô hiệu hóa maximize
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
      enableRemoteModule: true
    }
  })
    // const ses = mainWindow.webContents.session;
    // ses.clearCache(() => {
    //   alert("Cache cleared!");
    // });

    // and load the index.html of the app.
    
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.on('minimize',function(event){
    event.preventDefault();
    });

    // anti close
    // mainWindow.on('close', function (event) {
    //     event.preventDefault();
    // });

    mainWindow.setMenu(null)
    mainWindow.setMenuBarVisibility(false)
    mainWindow.resizable = false;

    // Accept all usb
    mainWindow.webContents.on('select-usb-device', (event, details, callback) => {
      // Add events to handle devices being added or removed before the callback on
      // `select-usb-device` is called.
      mainWindow.webContents.on('usb-device-added', (event, device) => {
        console.log('usb-device-added FIRED WITH', device)
        // Optionally update details.deviceList
      })
  
      mainWindow.webContents.session.on('usb-device-removed', (event, device) => {
        console.log('usb-device-removed FIRED WITH', device)
        // Optionally update details.deviceList
      })
  
      event.preventDefault()
      
    })
    mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
      return true
    })
    mainWindow.webContents.session.setDevicePermissionHandler((details) => {
      return true
    })
   
    // Open the DevTools.
    // mainWindow.webContents.openDevTools({ mode: "detach" });

    if (isDev) {
      mainWindow.webContents.openDevTools({ mode: "detach" });
      // require('react-devtools-electron');
    };
    if (!isDev) {
      autoUpdater.checkForUpdates();
    };

    return mainWindow
}

// Gửi biến app từ main process sang render process
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
//   autoUpdater.setFeedURL({
//     "provider": "github",
//     "owner": "khaicafe",
//     "repo": "PosMusic-Autoupdate",
//     "token": "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"
// })
  // update laucher
  // autoUpdater.checkForUpdatesAndNotify()
  // app.on('activate', function () {
  //   // On macOS it's common to re-create a window in the app when the
  //   // dock icon is clicked and there are no other windows open.
  //   if (BrowserWindow.getAllWindows().length === 0) createWindow()
  // })
  console.log(process.versions.electron);
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('version', app.getVersion())

    // Đặt biến app vào handle to preload.js
    // ipcMain.handle("channel-load-app", app);
    ipcMain.handle('getPath', () => app.getPath("appData"));

    // Gửi path config cho renderer js
    mainWindow.webContents.send('pathConfig', localAppDataPath)
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

/////////////////////// event autoupdate ////////////////
autoUpdater.channel = 'latest'
autoUpdater.allowDowngrade = false
autoUpdater.autoInstallOnAppQuit = false
autoUpdater.autoDownload = false
autoUpdater.logger = log
autoUpdater.setFeedURL({
  "provider": "github",
  "owner": "khaicafe",
  "repo": "PosMusic-Autoupdate",
  "checkUpdateSignatures": false
});
autoUpdater.on("checking-for-update", () => {
    log.info('checking-for-update...')
    // dispatch('checking-for-update.')
})
autoUpdater.on("update-available", (info) => {
  log.info('update-available...NeoMusic v' + info.version)
   // Hiển thị một hộp thoại xác nhận cho người dùng
   const dialogOptions = {
    type: 'info',
    buttons: ['Yes', 'No'],
    title: `Update NeoMusic v${info.version}`,
    message: 'An update is available. Do you want to download it?',
  };

  dialog.showMessageBox(dialogOptions).then((result) => {
    // Nếu người dùng chọn "Yes"
    if (result.response === 0) {
      mainWindow.webContents.send('Update_available', 'test')
      // Tiến hành tải xuống bản cập nhật
      autoUpdater.downloadUpdate();
    }
  });
    // log.info('update-available')
    // const dialogOpts = {
    //   type: 'info',
    //   buttons: ['Ok', 'Cancel'],
    //   title: 'Application Update',
    //   message: process.platform === 'win32' ? releaseNotes : releaseName,
    //   detail: 'A new version is being downloaded.'
    // }
    // dialog.showMessageBox(dialogOpts, (response) => {
    //   log.info('response', response)
    //   if (response.response === 0){
    //     autoUpdater.on("download-progress", (progressTrack) => {
    //       log.info('\n\ndownload-progress')
    //       // log.info(progressTrack)
    //       mainWindow.webContents.send('download-progress', progressTrack.percent)
    //      })
    //   }
    // });
})
autoUpdater.on('update-not-available', (info) => {
    dispatch('Update not available.')
  })
autoUpdater.on("error", (err) => {
    log.warn('Error in auto-updater' + err)
})
autoUpdater.on("download-progress", (progressObj) => {
    // log.info('\ndownload-progress')
    // log.info(progressObj)
    mainWindow.webContents.send('download-progress', progressObj.percent)
})
autoUpdater.on("update-downloaded", (info) => {
  if (!updateDownloaded) {
    // Đánh dấu sự kiện đã được gọi
    updateDownloaded = true;
    log.info('update_downloaded')
    mainWindow.webContents.send('update_downloaded', 'test')
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title:  `NeoMusic v${info.version}`,
      // message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    };
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
      // else autoUpdater.autoInstallOnAppQuit = false
    })
  }
})