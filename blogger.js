// 1º Instalar e autenticar api do Blogger 

//importações 
const google = require('googleapis').google
const blogger = google.blogger({ version: 'v3'})
const OAuth2 = google.auth.OAuth2
const express = require('express')
const clipboardy = require('clipboardy')

async function main() {
  console.log('[+] iniciando ...')
  

  await autenticandoComOAuth()
  await fazerPost()

  async function fazerPost() {
    const blog_id = require('./google-key.json')
    const res = await blogger.posts.insert({
      blogId: blog_id.blogger_id,
      requestBody: {
        title: 'Postagem de teste',
        content:
          'Iiuhuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu!',
      },
    });
    console.log(res.data);
    return res.data;
  }
  
  //código de autenticação que eu peguei do [youtube-bot] do Filipe Deschamps 
  async function autenticandoComOAuth() {
    const servidorWeb = await iniciandoServidorWeb()
    const OAuth2Cliente = await criandoClienteOAuth()
    requisicaoDeConsentimento(OAuth2Cliente)
    const tokenDeAutorizacao = await esperandoCallbackGoogle(servidorWeb)
    await requisicaoParaAcessoToken(OAuth2Cliente, tokenDeAutorizacao)
    await definirAutenticacaoGoogle(OAuth2Cliente)
    await pararServidorWeb(servidorWeb)
    

    async function iniciandoServidorWeb() {
      return new Promise((resolve, reject) => {
        const port = 5000
        const app = express()

        const server = app.listen(port, () => {
          console.log(`[+] ouvindo em: http://localhost:${port}`)

          resolve({
            app,
            server
          })
        })
      })
    }

    async function criandoClienteOAuth() {
      const credentials = require('./google-blogger.json')

      const OAuth2Cliente = new OAuth2(
        credentials.web.client_id,
        credentials.web.client_secret,
        credentials.web.redirect_uris[0]
      )

      return OAuth2Cliente
    }

    function requisicaoDeConsentimento(OAuth2Cliente) {
      const urlDeConsentimento = OAuth2Cliente.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/blogger']
      })

      clipboardy.writeSync(urlDeConsentimento)
      console.log(`[+] A url de consentimento foi copiada para sua área de transferência: ${urlDeConsentimento}`)

      
    }

    async function esperandoCallbackGoogle(servidorWeb) {
      return new Promise((resolve, reject) => {
        console.log('[-] Esperando a permissão...')

        servidorWeb.app.get('/oauth2callback', (req, res) => {
          const codigoDeAutenticacao = req.query.code
          console.log(`> [blogger] Consent given: ${codigoDeAutenticacao}`)

          res.send('<h1>Ok!</h1><p>Pode fechar a aba!.</p>')
          resolve(codigoDeAutenticacao)
        })
      })
    }

    async function requisicaoParaAcessoToken(OAuth2Cliente, tokenDeAutorizacao) {
      return new Promise((resolve, reject) => {
        OAuth2Cliente.getToken(tokenDeAutorizacao, (error, tokens) => {
          if (error) {
            return reject(error)
          }

          console.log('[+] Token do Google recebido!')

          OAuth2Cliente.setCredentials(tokens)
          resolve()
        })
      })
    }

    function definirAutenticacaoGoogle(OAuth2Cliente) {
      google.options({
        auth: OAuth2Cliente
      })
    }

    async function pararServidorWeb(servidorWeb) {
      return new Promise((resolve, reject) => {
        servidorWeb.server.close(() => {
          resolve()
        })
      })
    }
  }}

main()  

