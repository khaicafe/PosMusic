// yarn make --arch=ia32 // old dùng electron forge
// yarn package // electron build
const { app, BrowserWindow, dialog } = require('electron');
app.commandLine.appendSwitch ("disable-http-cache");
const path = require('path');
const fs = require('fs-extra');
const {autoUpdater} = require('electron-updater')
autoUpdater.setFeedURL({
  "provider": "github",
  "owner": "khaicafe",
  "repo": "PosMusic-Autoupdate",
  "token": "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"
});

const isDev = require("electron-is-dev");
// make log electron cmd
const log = require('electron-log')
var pjson = require('./package.json');

log.log("Application version = " + pjson.version);
// log.log("Application version =" + app.getVersion())

const localAppDataPath = path.join(app.getPath('appData'), '..', 'Local'); // Đường dẫn đến thư mục cần xóa
const folderD = localAppDataPath + '\\' +pjson.name + '-updater'
const folderLog = `${path.join(localAppDataPath)}/log`
// log.transports.file.resolvePath = () => path.join('G:/NeoCafe Music V2/PosMusic-Autoupdate/', 'log/main.log')
log.transports.file.resolvePath = () => path.join(localAppDataPath, '/log/NeoMusic.log')

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


// send value for ui
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
    //   preload: path.join(__dirname, 'preload.js'),
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

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
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

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('version', app.getVersion())
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