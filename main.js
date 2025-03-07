console.log("Electron - Processo principal")

// Importação dos recurso do fremework
//app (aplicação)
//BrowserWindow (Criação da janela)
//nativeTheme (definir tema claro ou escuro)
//Menu (definir um menu personalizado )
//shell (acessar links externos no navegador padrão)
const { app, BrowserWindow, nativeTheme, Menu, shell } = require('electron/main')

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