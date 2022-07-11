'use strict'

import { app, BrowserWindow, Menu } from 'electron'
import setIPCChannels from './setIPCChannels'
import {
  BROWSER_WINDOW_EVENT_CLOSED,
  APP_EVENT_READY,
  APP_EVENT_WINDOW_ALL_CLOSED,
  APP_EVENT_ACTIVATE,
  PLATFORM_DARWIN
} from '../renderer/js/constants/ElectronConstants'

// Install `electron-debug` with `devtron`
require('electron-debug')({ showDevTools: true })

// Install `vue-devtools`
require('electron').app.on('ready', () => {
  let installExtension = require('electron-devtools-installer')
  installExtension.default(installExtension.VUEJS_DEVTOOLS)
    .then(() => {})
    .catch(err => {
      console.log('Unable to install `vue-devtools`: \n', err)
    })
})

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

setIPCChannels()

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    // transparent: true,
    titleBarStyle: 'hidden',
    width: 1000
  })

  mainWindow.loadURL(winURL)

  var template = [{
    label: 'Application',
    submenu: [
      { label: 'About Application', selector: 'orderFrontStandardAboutPanel:' },
      { type: 'separator' },
      {label: 'Quit', accelerator: 'Command+Q', click () { app.quit() }}
    ]}, {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
      ]}
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  mainWindow.on(BROWSER_WINDOW_EVENT_CLOSED, () => {
    mainWindow = null
  })
}

app.on(APP_EVENT_READY, createWindow)

app.on(APP_EVENT_WINDOW_ALL_CLOSED, () => {
  if (process.platform !== PLATFORM_DARWIN) {
    app.quit()
  }
})

app.on(APP_EVENT_ACTIVATE, () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
