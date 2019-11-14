const google = require('googleapis')
const readline = require('readline-sync')
const creds = require('./key.json')

const pesquisa = google.google.customsearch('v1')

function pergundaRetornaTermoDeBusca(){
    return readline.question('[+] Digite aqui o nome do jogo: ')
}


async function buscar(chave){
  let termo = pergundaRetornaTermoDeBusca()  
  const resposta = await pesquisa.cse.list({
      auth: chave.api_imagens,
      cx: chave.search_id,
      q: termo,
      searchType: 'image',
      num: 2
    })
    
    
    //criar uma lista com o link das imagens 
    const links = resposta.data.items.map((valor) => valor.link)
    return links


  }








