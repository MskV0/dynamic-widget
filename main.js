const { app, BrowserWindow } = require('electron');
const path = require('path');
const AutoLaunch = require('auto-launch');

let win;

app.whenReady().then(() => {
  // Auto-launch on startup
  const launcher = new AutoLaunch({
    name: 'ClockWidget',
    path: app.getPath('exe'),
  });

  launcher.isEnabled().then((isEnabled) => {
    if (!isEnabled) {
      launcher.enable().catch(err => console.error('Auto-launch error:', err));
    }
  });

  // Main window setup
  win = new BrowserWindow({
    width: 300,
    height: 200,
    x: 50,
    y: 50,
    resizable: true,
    transparent: true,
    frame: false,
    alwaysOnTop: false,           // 🔽 NOT always on top
    focusable: false,             // ✅ Don’t take focus
    skipTaskbar: true,
    hasShadow: false,             // Looks flat, better for desktop-style
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false                   // Create hidden, show when ready
  });

  win.loadFile('index.html');
  win.setMenu(null);

  win.once('ready-to-show', () => {
    win.show();
  });

  // Optional: allow mouse events
  win.setIgnoreMouseEvents(false); // Set true if you want it fully click-through
});

// Quit on close (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
const { globalShortcut } = require('electron');

app.whenReady().then(() => {
  // ... your existing window setup code ...

  // Register a global shortcut to toggle click-through
  globalShortcut.register('CommandOrControl+Shift+X', () => {
    const isIgnore = win.isIgnoreMouseEvents();
    win.setIgnoreMouseEvents(!isIgnore, { forward: true });
    console.log(`Click-through mode: ${!isIgnore ? 'enabled' : 'disabled'}`);
  });
});

// Clean up shortcut when app quits
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
