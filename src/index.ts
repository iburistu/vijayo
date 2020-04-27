import { app, BrowserWindow, dialog, ipcMain, Menu } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const RENDER_WINDOW_WEBPACK_ENTRY: any;
let mainWindow: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    // eslint-disable-line global-require
    app.quit();
}

const open_directory_dialog = () => {
    let options: object = {
        title: 'Open directory...',
        properties: ['openDirectory'],
    };

    dialog.showOpenDialog(mainWindow, options).then((dir: any) => {
        if (dir.filePaths && dir.filePaths.length) {
            mainWindow.webContents.send('chdir', dir.filePaths[0]);
        }
    });
};

const playPause = () => {
    mainWindow.webContents.send('video', 'playPause');
};

const restartVideo = () => {
    mainWindow.webContents.send('video', 'restart');
};

const forwardFrame = () => {
    mainWindow.webContents.send('video', 'forwardFrame');
};

const backwardFrame = () => {
    mainWindow.webContents.send('video', 'backwardFrame');
};

const renderVideo = () => {
    let renderWindow = new BrowserWindow({
        show: true,
        title: 'render-process',
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        },
    });

    renderWindow.loadURL(RENDER_WINDOW_WEBPACK_ENTRY);
};

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        backgroundColor: '#1e1f26',
        titleBarStyle: 'hiddenInset',
        title: 'vijayo',
        webPreferences: {
            nodeIntegration: true,
            webSecurity: process.env.NODE_ENV === 'development' ? false : true,
        },
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools in development
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
        installExtension(REACT_DEVELOPER_TOOLS)
            .then((name: string) => console.log(`Added Extension: ${name}`))
            .catch(console.error);
    }

    let menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open directory...',
                    click() {
                        open_directory_dialog();
                    },
                    accelerator: 'CmdOrCtrl+O',
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Exit',
                    click() {
                        app.quit();
                    },
                },
            ],
        },
        {
            label: 'Video',
            submenu: [
                {
                    label: 'Play/Pause',
                    click() {
                        playPause();
                    },
                    accelerator: 'CmdOrCtrl+Space',
                },
                {
                    label: 'Restart',
                    click() {
                        restartVideo();
                    },
                    accelerator: 'CmdOrCtrl+Shift+Left',
                },
                {
                    label: 'Forward 1 Frame',
                    click() {
                        forwardFrame();
                    },
                    accelerator: 'CmdOrCtrl+Right',
                },
                {
                    label: 'Backward 1 Frame',
                    click() {
                        backwardFrame();
                    },
                    accelerator: 'CmdOrCtrl+Left',
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Render to file...',
                    click() {
                        renderVideo();
                    },
                    accelerator: 'CmdOrCtrl+Shift+R',
                },
            ],
        },
    ]);

    Menu.setApplicationMenu(menu);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
