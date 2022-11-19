const knex = require('knex')
const { getConfig } = require('./confiKnex.js')

const MARIADB_KNEX_CONFIG = getConfig('mysql', 'mariadb', 'root', 'mariadb', 'localhost', 'backenddesafio')
const SQLITE3_KNEX_CONFIG = getConfig('sqlite3')

const knexCliMariaDb = knex(MARIADB_KNEX_CONFIG)
const knexCliSQLite = knex(SQLITE3_KNEX_CONFIG)

const clienteSQL = require('./ContArchivo.js')

const contenedorMensajes = new clienteSQL(knexCliSQLite)
const contenedorProducts = new clienteSQL(knexCliMariaDb)

const existTableNote = async () => {
    const existeTablaPersonas = await knexCliSQLite.schema.hasTable("notas")
    if (!existeTablaPersonas) {
        await knexCliSQLite.schema.createTable("notas", table => {
            table.increments('id'),
                table.string('user'),
                table.string('nota'),
                table.string('date')
        })
    }
}
const existTableProd = async () => {
    const existeTablaProd = await knexCliMariaDb.schema.hasTable("productos")
    if (!existeTablaProd) {
        await knexCliMariaDb.schema.createTable("productos", table => {
            table.increments('id'),
                table.string('title'),
                table.integer('price'),
                table.string('thumbnail')
        })
    }
}

existTableNote()
existTableProd();
const confiSocket = (io) => {
    io.on('connection', socket => {
        socket.emit('conexion', 'conexion realizada')

        socket.on('nota', async nota => {

            await contenedorNotas.guardar("notas", nota)
            const notas = await contenedorNotas.buscar("notas")
            io.sockets.emit('notas', notas)
        })

        socket.on('getProducts', async () => {
            const productos = await contenedorProducts.buscar('productos')
            io.sockets.emit('showProducts', productos)
        })

        socket.on('addProduct', async producto => {
            await contenedorProducts.guardar('productos', producto)
            const productos = await contenedorProducts.buscar('productos')
            io.sockets.emit('showProducts', productos)
        })
    })
}

module.exports = { confiSocket }