import Express from 'express';
export class Server {
    app = Express()
    startup(){
        this.setRoutes()

        this.app.listen(3000, () => console.log("ouvindo na porta"))

    }

    setRoutes(){
        this.app.get('/teste', (req, res) => {
            res.send({teste: "deu certo"})
        })
    }
}