/**
 *  Processo de renderização do documento index.html
 */
 console.log("Processo de renderização")

 //estratégia para renderizar(desenhar) as notas adesivas: 
 // usar uma lista para preencher de forma dinamica os itens(notas )

 // vetor global para manipular os dados do banco 
 let arrayNotes = []

 // captura do id da list <ul> do documento index.html
 const list = document.getElementById('listNotes')


 // inserção da data no rodapé
function obterData() {
    const data = new Date()
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return data.toLocaleDateString('pt-BR', options)
}

document.getElementById('dataAtual').innerHTML = obterData()

// Trocar do icone do banco de dados (status de conexão)
// Uso da api do preload.js
api.dbStatus((event, message) => {
    // Teste de recebimento da mensagem
    console.log(message)
    if (message === "conectado") {
        document.getElementById('iconeDB').src = "../public/img/dbon.png"
    } else {
        document.getElementById('iconeDB').src = "../public/img/dboff.png"
    }
})



// enviar ao main um pedido para conectar com o banco de dados quando a janla principal for inicializada
api.dbConnect()


// ============================================================================
// == CRUD Read ===============================================================

// Passo 1: Enviar ao main um pedido para listar as notas 
api.listNotes()

// Passo 5: Recebimento da notas via IPC e renderização(desenho) das notas no documento index.html
api.renderNotes((event,notes) => {
    const rendererNotes = JSON.parse(notes)
    console.log(rendererNotes) // teste  de recebimento (passo 5)
    // renderizar no index.html o conteudo do array
    arrayNotes = rendererNotes // atribuir ao vetor o JSON recebido 
    // uso o laço forEach para percorrer o vetor e extrair os dados 
    arrayNotes.forEach((n) => {
        // adição de tags <li> no documento index.html
        // var(--${n.com}) aplica a cor definida nas variáveis CSS. Atenção! É necessario usar o mesmo nome armazenamento no banco e nas variáveis CSS
        list.innerHTML +=  `
        <li class="card" style="background-color: var(--${n.cor});">
            <p onclick="deleteNote('${n._id}')" id="x">X</p>
            <p id="code">${n._id}</p>
            <p>${n.texto}</p>
            <p id="color">${n.cor}</p>
        </li>
    `
    })
})

//

// ============================================================================
// == Fim CRUD Read ===========================================================


// ============================================================================
// == Atualização das notas ===================================================

api.mainReload((args) => {
    location.reload()   
})
// == Fim - atualização das notas =============================================
// ============================================================================

function deleteNote(id) {
    console.log(id) // Passo 1: receber o id da nota a ser excluida
    api.deleteNote(id) // Passo 2: Enviar o id na nota ao main
}