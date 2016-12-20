const {app, BrowserWindow,Tray,Menu} = require('electron')
const path = require('path')

let win
let tray

function createWindow() {
  win = new BrowserWindow({width: 320, height: 400})

  win.loadURL(`file://${__dirname}/ui/index.html`)

  // Open the DevTools.
  // win.webContents.openDevTools()

  win.on('closed',function () {
      win = null
  })
  win.on('close',(e) => {
      e.preventDefault();
      this.hide();
  })
  createTray()
}

function createTray() {
    // load the tray
    tray = new Tray(path.join(__dirname,'ui/img/sunTemplate.png'))
    tray.setToolTip('free your network')
    tray.on('click',() => {
        if(win)
            win.show()
    })
}


app.on('ready', createWindow)


app.on('activate', () => {
   if (win === null) {
    createWindow()
  }
})
