const Contenedor = require('./ContArchivo.js')
const contenedorNotas = new Contenedor('./notas.txt')

const contenedorItems = new Contenedor('./items.txt')

const idFunction = async (item) => {
    const items = await contenedorItems.retrieve()
    if (items.length != 0) {
        let arrayId = items.map(item => item.id);
        let highId = Math.max(...arrayId);
        item.id = highId + 1;
    } else item.id = 0;
}


const confiSocket = (io) => {
    io.on('connection', socket => {
        socket.emit('nota', 'conexion realizada')

        socket.on('nota', async nota => {
            await contenedorNotas.save(nota)
            const notas = await contenedorNotas.retrieve()
            io.sockets.emit('notas', notas)
        })

        socket.on('getItems', async () => {
            const items = await contenedorItems.retrieve()
            io.sockets.emit('showItems', items)
        })

        socket.on('addItem', async item => {
            await idFunction(item)
            await contenedorItems.save(item)
            const items = await contenedorItems.retrieve()
            io.sockets.emit('showItems', items)
        })
    })
}

module.exports = { confiSocket }