// 1º Instalar e autenticar api do Blogger 


'use strict'

//importando googleapis
const {google} = require('googleapis')

//manipular os arquivos do sistema 
const file_system = require('fs')

let json_data = file_system.readFileSync("./key.json", "utf-8")

//pegar a minha chave no arquivo JSON
const arquivo_json = JSON.parse(json_data)


//parte de teste que peguei no git
const blogger = google.blogger({
    version: 'v3',
    auth: arquivo_json.api
  })
  
  const params = {
    blogId: arquivo_json.blogger_id
  }
  
  //depois só alterar o metódo para inserir post e montar o corpo da postagem
  blogger.blogs.get(params, (err, res) => {
    if (err) {
      console.error(err);
      throw err;
    }
    console.log(`O url do Blogger é: ${res.data.url}`);
  });

