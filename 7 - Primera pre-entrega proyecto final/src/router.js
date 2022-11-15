const express = require('express');
const moment = require('moment');
const { Router } = require('express')
const Container = require("./ContArchivo")
const archivoProductos = new Container('./productos.txt');
const archivoCarrito = new Container('./carrito.txt');

const routerSesion = new Router()

const routerProducto = new Router()
routerProducto.use(express.json())
routerProducto.use(express.urlencoded({ extended: true }))

const routerCarrito = new Router()
routerCarrito.use(express.json())
routerCarrito.use(express.urlencoded({ extended: true }))

let admin = false;

function soloParaAdmins(req, res, next) {
    if (admin) {
        next()
    } else {
        const text = `ruta ${req.originalUrl},metodo ${req.method} no autorizada`
        res.json({ error: -1, descripcion: text })
    }
}


const getDate = () => {
    const today = moment();
    return today.format("DD/MM/YYYY HH:mm:ss")
}

const generateCode = async () => {
    const dataProducts = await archivoProductos.retrieve()
    let salir = true;

    while (salir) {
        let code = parseInt(Math.random() * 100) + 1
        const codeExist = dataProducts.find(element => element.code == code)
        if (!codeExist) {
            return code;
        }
    }

}



routerSesion.get('/login', (req, res) => {
    admin = true
    res.sendStatus(200)
})

routerSesion.get('/logout', (req, res) => {
    admin = false
    res.sendStatus(200)
})


routerProducto.get("/", (req, res) => {
    archivoProductos.retrieve().then(prods => {
        res.json(prods)
    })

})

routerProducto.get("/:id", (req, res) => {
    let id = parseInt(req.params.id);
    archivoProductos.retrieveId(id).then(prods => {
        res.json(prods)
    })
})

routerProducto.post("/", soloParaAdmins, async (req, res) => {
    const code = await generateCode();
    const date = getDate()
    const obj = { ...req.body, code, date }
    archivoProductos.save(obj).then(prods => {
        res.json(prods)
    })
})

routerProducto.put("/:id", soloParaAdmins, async (req, res) => {
    const code = await generateCode();
    const date = getDate()
    const obj = { ...req.body, code, date }
    let id = parseInt(req.params.id);
    archivoProductos.update(obj, id).then(prods => {
        res.json(prods)
    })
})

routerProducto.delete("/:id", soloParaAdmins, (req, res) => {
    let id = parseInt(req.params.id);
    archivoProductos.delete(id).then(prods => {
        res.json(prods)
    })
})


routerCarrito.post("/", (req, res) => {
    const carrito = { productos: [], timestamp: getDate() }
    archivoCarrito.save(carrito).then(carrito => {
        res.json(carrito.id)
    })
})

routerCarrito.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    archivoCarrito.retrieveId(id).then(carrito => {
        carrito.productos = []
        archivoCarrito.update(carrito, id).then(arrayCarrito => {
            res.json(arrayCarrito)
        })
    })

})

routerCarrito.get("/:id/productos", (req, res) => {
    const id = parseInt(req.params.id);
    archivoCarrito.retrieveId(id).then(carrito => {
        res.json(carrito.productos)
    })
})

routerCarrito.post("/:id/productos/", (req, res) => {
    const id = parseInt(req.params.id);
    const id_prod = req.body.id;
    archivoCarrito.retrieveId(id).then(carrito => {
        return archivoProductos.retrieveId(id_prod).then(prods => {
            carrito.productos.push(prods);
            return carrito
        })
    }).then(carrito => {
        archivoCarrito.update(carrito, id).then(compraUpdate => {
            res.json(compraUpdate)
        })
    })
})

routerCarrito.delete("/:id/productos/:id_prod", (req, res) => {
    const id = parseInt(req.params.id);
    const id_prod = parseInt(req.params.id_prod);
    archivoCarrito.retrieveId(id).then(carrito => {
        const arrayAuxy = carrito.productos.filter(item => item.id != id_prod);
        carrito.productos.splice(0)
        carrito.productos.push(...arrayAuxy)
        return carrito
    }).then(carrito => {
        archivoCarrito.update(carrito, id).then(compraUpdate => {
            res.json(compraUpdate)
        })
    })
})

module.exports = {
    routerProducto, routerCarrito, routerSesion
}