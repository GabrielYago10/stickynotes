console.log("Electron - Processo principal")

// Importação dos recurso do fremework
//app (aplicação)
//BrowserWindow (Criação da janela)
//nativeTheme (definir tema claro ou escuro)
//Menu (definir um menu personalizado )
//shell (acessar links externos no navegador padrão)
const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain} = require('electron/main')

//Ativação do preload.js (importação do path)
const path = require('node:path')

// Importação dos métodos conectar e desconectar (módulo de conexão)
const {conectar, desconectar} = require('./database.js')

//Janela principal
let win
const createWindow = () => {
  //definindo tema da janela claro ou escuro
  nativeTheme.themeSource = 'light' 
   win = new BrowserWindow({
    width: 1010,
    height: 720,
    //frame: false,
    //resizable: false,
    //minimizable: false,
    //closable: false,
    //autoHideMenuBar: true
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Carregar o menu personalizado 
  // Atencão! antes importar menu 
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  // carregar o document html na janela 
  win.loadFile('./src/views/index.html')
}

// Janela sobre
let about
function aboutWindow() {
  nativeTheme.themeSource='light'
  // obter a janela principal 
  const mainWindow = BrowserWindow.getFocusedWindow()
  // Validação (se existir a janela principal)
  if (mainWindow) {
    about = new BrowserWindow({
      width: 320,
      height: 280,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      // estabelecer uma relação hierarquica entre as janelas 
      parent: mainWindow,
      // criar uma janela modal (só retorna a principal quando encerrada)
      modal: true
    })
  }
  
  about.loadFile('./src/views/sobre.html')
}

// inicialização da aplicação (assincornismo)
app.whenReady().then(() => {
  createWindow()

  // Melhor local para estabelecer a conexão com o banco de dados 
  // No MongoDB é mais eficiente manter uma única conexão abertadurante todo o tempo de vida do aplicativo e encerrar a conexão 
  //quando o aplicativo dor finalizado 
  ipcMain.on('db-connect', async (event) => {
    //a linha abaixo estabelece a conexão com o banco de dados 
    await conectar()
    // enviar ao rendirizador uma menssagem para trocar a imagem do icone do banco de dados (criar um delay 0.5 ou 1s para sincronização com a nuvem )
    setTimeout(() =>{
      // enviar ao renderizador a mensagem "connectado"
      // db-status (IPC - comunicação entre processos - preload.js)
      event.reply('db-status', "conectado")
    }, 500) // 500ms = 0.5s
  }) 

  // só ativar a janela principal se nenhuma outra outra estiver ativa
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// se o sistema não for MAC encerrar a aplicação quando a janela for fechada  
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IMPORTANTE! Desconectar do banco de dados quando a aplicação  for finalizada
app.on('before-quit', async () => {
  await desconectar()
})
// Reduzir a verbozidade de logs não criticas (devetools)
app.commandLine.appendSwitch('log-level','3')

//templete do menu 
const template = [
  {
    label: 'Notas',
    submenu: [
      {
        label: 'Criar nota',
        accelerator: 'Ctrl+N',
        click: () => console.log("teste")
      },
      {
        type: 'separator'
      },
      {
        label: 'Sair',
        accelerator: 'Alt+F4',
        click: () =>app.quit()
      }
    ]
  },
  {
    label: 'ferramentas',
    submenu: [
      {
        label: 'Aplicar zoom',
        role: 'zoomIn'
      },
      {
        label: 'reduzir',
        role: 'zoomOut'
      },
      {
        label: 'Restaurar o zoom padrão',
        role: 'resetZoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Recarregar',
        role: 'reload'
      },
      {
        label: 'DevTools',
        role: 'toggleDevTools'
      }
    ]
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'Repositorio', 
        click: () => shell.openExternal('https://github.com/GabrielYago10/stickynotes')
      },
      {
        label: 'Sobre',
        click: () => aboutWindow()
      }
    ]
  }
]