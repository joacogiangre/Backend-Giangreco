const Contenedor = require('./ContArchivo.js')
const contenedorItems = new Contenedor('./items.txt')

const idFunction = async () => {
    const items = await contenedorItems.retrieve()
    if (items.length != 0) {
        let arrayId = items.map(item => item.id);
        let highId = Math.max(...arrayId);
        id = highId + 1;
    } else id = 1;
    return id
}

const confiSocketItems = (io) => {
    io.on('connection', socket => {
        socket.emit('idItem', idFunction());

        socket.on('addItem', async item => {
            console.log(item);
            await contenedorItems.save(item)
            const items = await contenedorItems.retrieve()
            io.sockets.emit('showItems', items)
        })
    })
}

module.exports = { confiSocketItems }