/**
 *  Modelos de dados das notas
 *  Criação da coleção 
 */

// importação do recurso do mongoose
const {model, Schema} = require('mongoose')

// criação da estutura da coleção 
const noteSchema = new Schema({
    texto: {
        type: String
    },
    cor: {
        type: String
    }

}, {versionKey: false})

// exportar o modelo de dados para oo main 
module.exports= model('Notas', noteSchema)
