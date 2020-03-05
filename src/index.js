const { app, BrowserWindow, BrowserView } = require('electron')

function createMainWindow () {
  // Create the browser window.
  const main_win = new BrowserWindow({
    width: 1200,
    height: 900,
    backgroundColor: '#343d46',
    titleBarStyle: "hiddenInset",
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  main_win.loadFile('index.html');

  // Open the DevTools.
  /*  let view = new BrowserView({
    parent: main_win,
  });
  main_win.setBrowserView(view);
  view.setAutoResize({
    width: true,
    height: true,
    horizontal: true,
    vertical: true
  });

  view.setBounds({ x: 0, y: 0, width: 500, height: 800 });
  view.webContents.loadFile('subwindow.html');
  view.webContents.openDevTools(); */
  main_win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createMainWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
