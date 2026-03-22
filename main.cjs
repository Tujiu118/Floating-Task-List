const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    transparent: true, // 背景全透明
    frame: false,      // 没有边框和关闭按钮
    alwaysOnTop: false, // 始终显示在桌面最上层
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // 加载打包后的画面
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});