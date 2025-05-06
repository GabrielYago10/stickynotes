const mongoose = require('mongoose')


const url = 'mongodb+srv://admin:123Senac@cluster0.qf9kj.mongodb.net/dbnotes'


let conectado = false


const conectar = async () => {
    
    if (!conectado) {
      
        try {
            await mongoose.connect(url)
            conectado = true 
            console.log("MongoDB Connect")
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }
}

const desconectar = async () => {
   
    if (conectado) {
       
        try {
            await mongoose.disconnect(url)
            conectado = false 
            console.log("MongoDB Desconnect")
            return true
        } catch (error) {
            console.error(error)
            return false 
        }
    }
}

module.exports = {conectar, desconectar}