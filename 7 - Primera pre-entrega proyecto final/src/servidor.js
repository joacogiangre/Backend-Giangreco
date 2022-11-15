const express = require('express');
const http = require('http');

const { routerProducto, routerCarrito, routerSesion } = require('./router.js')

const app = express();
const httpServer = new http.Server(app)

app.use('/api/sesion/', routerSesion)
app.use('/api/productos/', routerProducto)
app.use('/api/carrito/', routerCarrito)

app.use((req, res, next) => {
    res.status(404).send("Pagina no encontrada");
})
confiSocket(io);
module.exports = { servidor: httpServer }

