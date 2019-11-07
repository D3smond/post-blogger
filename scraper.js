//2° parte que vai fazer a raspagem de dados na internet 
// no nodejs diferentemente do Python é necessário importar um módulo para os inputs e outputs 

const readline = require('readline-sync')

const cheerio = require('cheerio')
const request = require('request')

//forma de armazenar o input com o metódo readline
const fazer_pergunta = function(){
    return readline.question("[+] Digite aqui o que deseja buscar: ")
}

function fazer_request(busca){
    request.get(`${busca}`, (erro, resposta, corpo) => {    
        if (!erro && resposta.statusCode === 200){
            let $ = cheerio.load(corpo)
            let titulo = $('title')
            console.log(titulo.text())
            
        }else{
            console.log(`${erro}`)
        }   
} )}

fazer_request(fazer_pergunta())