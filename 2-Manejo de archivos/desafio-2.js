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

miArchivo.save(
    {
        title:"celular moto",
        price:10000000,
        thumbnail:"celular.png"
    }
).then(resolve => console.log(resolve));

miArchivo.getById(2).then(resolve => console.log(resolve));

miArchivo.getAll().then(resolve => console.log(resolve));

miArchivo.deleteById(4);

miArchivo.deleteAll();
