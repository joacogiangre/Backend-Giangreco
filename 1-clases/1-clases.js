class Usuario{
    constructor(nombre, apellido){
        this.nombre=nombre;
        this.apellido=apellido;
        this.libros=[];
        this.mascotas=[];
    }
    getFullName(){
        return `${this.nombre + " " + this.apellido} `
    }

    addMascota(mascota){
        this.mascotas.push(mascota)
    }

    countMascotas(){
        return this.mascotas.length
    }

    addBook(nombre, autor){
        const libreria = { nombre: nombre, autor: autor }
        this.libros.push(libreria)
    }

    getBooks(){
        return this.libros
    }

    getBookNames(){
        return this.libros.map(libro=> libro.nombre)
    }
}

const usuario = new Usuario("Elon", "Musk")

    usuario.addMascota("perro")
    usuario.addMascota("gato")

    console.log(usuario.countMascotas())

    console.log(usuario.getFullName())

    usuario.addBook("El señor de las moscas", "William Golding")
    usuario.addBook("Fundación", "Isaac Asimov")

    console.log(usuario.getBooks())

    console.log(usuario.getBookNames())