/**
 *  preload.js - Usado no fremework electron para aumentar a segurança e o desempenho
 */

// importação dos recursos do fremework electron
// ipcRenderer permite estabelecer uma comunicação entre processos (IPC) main.js <=> renderer.js
// contextbBridge: permissões de comunicação entre processos usando a api do electron 
const {ipcRenderer, contextBridge} = require('electron')

//permissões para estabelecer a comunicação entre processos
contextBridge.exposeInMainWorld('api', {
    dbConnect: () => ipcRenderer.send('db-connect'),
    dbStatus: (message) => ipcRenderer.on('db-status',message),
    aboutExit: () => ipcRenderer.send('about-exit'),
    createNote: (stickyNotes) => ipcRenderer.send('create-note', stickyNotes),
    resetForm: (args) => ipcRenderer.on('reset-form',args),
    listNotes: () => ipcRenderer.send('list-notes'),
    renderNotes: (notes) => ipcRenderer.on('render-notes', notes),
    updateList: () => ipcRenderer.send('update-list'),
    mainReload: (args) => ipcRenderer.on('main-reload', args),
    deleteNote: (id) => ipcRenderer.send('delete-note', id)
})