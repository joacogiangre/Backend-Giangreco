const express = require("express");
const fs= require('fs')

class Contenedor{
    constructor(myfile){
        this.nameFile=myfile;
    }
    async save(item){
        let items=[]
        try{
            const contenido= await fs.promises.readFile(this.nameFile, 'utf-8')
            items=JSON.parse(contenido)
            const {id} = items[items.length-1];
            item.id=id+1;
            items.push(item)
            fs.writeFileSync(this.nameFile, JSON.stringify(items))
        }
        catch{
            item.id=0;
            items.push(item)
            fs.writeFileSync(this.nameFile, JSON.stringify(items))
        }
        return item.id;
    }

    async getById(id){
        try{
            const contenido= await fs.promises.readFile(this.nameFile, 'utf-8')
            let items = JSON.parse(contenido)
            const product = items.find(item => item.id === id)
            return product
        }
        catch{
            return null
        }
    }

    async getAll() {
        try {
            const contenido = await fs.promises.readFile(this.nameFile, "utf-8")
            const items = JSON.parse(contenido)
            return items
        }
        catch {
            return null
        }
    }

    async deleteById(id) {
        try {
            const contenido = await fs.promises.readFile(this.nameFile, "utf-8")
            const items = JSON.parse(contenido)
            const array = items.filter(item => item.id !== id)
            fs.writeFileSync(this.nameFile, JSON.stringify(array))
        }
        catch {
            return "no hay productos"
        }
    }
    deleteAll() {
        fs.writeFileSync(this.nameFile, "")
    }
}

const miArchivo=new Contenedor('./productos.txt')
const app = express();

const PORT = 8080;

app.listen(PORT, () => console.log("http://localhost:8080"))

app.get('/', (req, res) => {
    res.end("Hola que tal, vendemos electrodomesticos")
})

app.get('/productos', (req, res) => {
    miArchivo.getAll().then(resolve => {
        res.end(`Estas viendo todos los productos! PD:Aprovecha la heladera que esta en oferta!!: ${JSON.stringify(resolve)}`)
    });

})

app.get('/productoRandom', (req, res) => {
    let nroRandom = parseInt((Math.random() * 3) + 1)
    miArchivo.getById(nroRandom).then(resolve => {
        res.end(`Parece que se genero un producto aleatoriamente: ${JSON.stringify(resolve)}`)
    });
})