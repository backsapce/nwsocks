const {
  app,
  BrowserWindow,
  Tray,
  Menu
} = require('electron')
const path = require('path')

let win
let tray
let close = false

function createWindow() {
  win = new BrowserWindow({ width: 320, height: 400 })

  win.loadURL(`file://${__dirname}/ui/index.html`)

  // Open the DevTools.
  win.webContents.openDevTools()

  win.on('closed', function () {
    win = null
  })
  win.on('close', (e) => {
    if (!close) {
      e.preventDefault();
      this.hide();
    }
  })
  createTray()
  setUpMenu()
}

function createTray() {
  // load the tray
  tray = new Tray(path.join(__dirname, 'ui/img/sunTemplate.png'))
  const contextMenu = Menu.buildFromTemplate([{
    label: 'open',
    click() {
      win.show()
    }
  }, {
    label: 'proxy',
    type: 'radio',
    checked: 'false',
    click() {
      win.webContents.send('proxy')
      this.checked = false
    }
  }, {
    label: 'exit',
    click() {
      closeApp()
    }
  }])
  tray.setToolTip('free your network')
  tray.setContextMenu(contextMenu)
}

function setUpMenu() {
  var template = [{
    label: "Application",
    submenu: [{
        label: "About Application",
        selector: "orderFrontStandardAboutPanel:"
      },
      {
        type: "separator"
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: function () {
          closeApp()
        }
      }
    ]
  }, {
    label: "Edit",
    submenu: [{
        label: "Undo",
        accelerator: "CmdOrCtrl+Z",
        selector: "undo:"
      },
      {
        label: "Redo",
        accelerator: "Shift+CmdOrCtrl+Z",
        selector: "redo:"
      },
      {
        type: "separator"
      },
      {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        selector: "cut:"
      },
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        selector: "copy:"
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        selector: "paste:"
      },
      {
        label: "Select All",
        accelerator: "CmdOrCtrl+A",
        selector: "selectAll:"
      }
    ]
  }];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function closeApp() {
  close = true
  app.quit()
}

app.on('ready', createWindow)

app.on("before-quit", (event) => {
  console.log("Caught before-quit. Exiting...");
  event.preventDefault()
  process.exit(0)
});

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
