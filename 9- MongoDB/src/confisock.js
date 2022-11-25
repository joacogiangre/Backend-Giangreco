const knex = require('knex')
const { getConfig } = require('./confiKnex.js')

//Cliente Confi
//getConfig(CLIENT, DRIVER, USERNAME, PASSWORD, HOST, DB_NAME)
const MARIADB_KNEX_CONFIG = getConfig('mysql', 'mariadb', 'root', 'mariadb', 'localhost', 'backenddesafio')
const SQLITE3_KNEX_CONFIG = getConfig('sqlite3')

const knexCliMariaDb = knex(MARIADB_KNEX_CONFIG)
const knexCliSQLite = knex(SQLITE3_KNEX_CONFIG)

const clienteSQL = require('./ContArchivo.js')

const contenedorMensajes = new clienteSQL(knexCliSQLite)
const contenedorProducts = new clienteSQL(knexCliMariaDb)
//Verify if exist the table
const existTableMsg = async () => {
    const existeTablaPersonas = await knexCliSQLite.schema.hasTable("mensajes")
    if (!existeTablaPersonas) {
        await knexCliSQLite.schema.createTable("mensajes", table => {
            table.increments('id'),
                table.string('userName'),
                table.string('msg'),
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

//confiSocket
existTableMsg()
existTableProd();
const confiSocket = (io) => {
    io.on('connection', socket => {
        //First Conexion
        socket.emit('conexion', 'conexion realizada')

        socket.on('mensaje', async mensaje => {

            await contenedorMensajes.guardar("mensajes", mensaje)
            const mensajes = await contenedorMensajes.buscar("mensajes")
            io.sockets.emit('mensajes', mensajes)
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