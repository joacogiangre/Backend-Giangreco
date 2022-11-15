const fs = require('fs')
class Container {
    constructor(ruta) {
        this.ruta = ruta
    }

    verify(obj) {
        return Object.entries(obj).length !== 0;
    }

    async save(elemento) {
        this.array = await this.retrieve()
        if (this.verify(elemento)) {

            if (this.array.length != 0) {
                let arrayId = this.array.map(item => item.id);
                let highId = Math.max(...arrayId);
                elemento.id = highId + 1;
            } else elemento.id = 0;

            this.array.push(elemento)
            const contenido = JSON.stringify(this.array, null, 4)
            await fs.promises.writeFile(this.ruta, contenido)
        }
        return elemento
    }

    async retrieve() {
        try {
            const contenido = await fs.promises.readFile(this.ruta, 'utf-8')
            this.array = JSON.parse(contenido)
            return this.array
        } catch {
            return []
        }

    }
    async retrieveId(id) {
        try {
            const contenido = await fs.promises.readFile(this.ruta, 'utf-8')
            this.array = JSON.parse(contenido)
            const objId = this.array.find(item => item.id == id)
            return (objId ? objId : { error: "no encontrado" })
        } catch {
            return {}
        }
    }

    async update(obj, id) {
        obj.id = id;
        this.array = await this.retrieve()
        if (this.verify(obj)) {
            const auxArray = this.array.map(item => item.id == id ? obj : item);
            this.array.splice(0);
            this.array.push(...auxArray);
            const contenido = JSON.stringify(this.array, null, 4)
            await fs.promises.writeFile(this.ruta, contenido)
            return (obj);
        }
    }

    async delete(id) {
        this.array = await this.retrieve()
        let auxArray = this.array.filter(item => item.id != id);
        this.array.splice(0);
        this.array.push(...auxArray);
        const contenido = JSON.stringify(this.array, null, 4)
        await fs.promises.writeFile(this.ruta, contenido)
        return (this.array);
    }
}
module.exports = Container