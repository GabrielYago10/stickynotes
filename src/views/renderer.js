 console.log("Processo de renderização")
 let arrayNotes = []

 const list = document.getElementById('listNotes')

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

api.dbStatus((event, message) => {
    console.log(message)
    if (message === "conectado") {
        document.getElementById('iconeDB').src = "../public/img/dbon.png"
    } else {
        document.getElementById('iconeDB').src = "../public/img/dboff.png"
    }
})

api.dbConnect()
api.listNotes()

api.renderNotes((event,notes) => {
    const rendererNotes = JSON.parse(notes)
    console.log(rendererNotes) 
    arrayNotes = rendererNotes
    arrayNotes.forEach((n) => {
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

api.mainReload((args) => {
    location.reload()   
})

function deleteNote(id) {
    api.deleteNote(id)
}