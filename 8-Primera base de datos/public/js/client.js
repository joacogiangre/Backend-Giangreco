const socket = io()
const btnEnviar = document.getElementById("enviar");
btnEnviar.onclick = () => {
    const title = document.getElementById('nombre').value;
    const price = document.getElementById('precio').value;
    const thumbnail = document.getElementById('img').value;
    socket.emit('addItem', { title, price, thumbnail })
}

const getDate = () => {
    const today = moment();
    return today.format("DD/MM/YYYY HH:mm:ss")
}

const btnChat = document.getElementById("enviarNota");
btnChat.onclick = () => {
    const user = document.getElementById('user').value;
    const nota = document.getElementById('nota').value;
    const date = getDate();
    socket.emit('nota', { user, nota, date });
    document.getElementById('user').value = "";
    document.getElementById('nota').value = "";
}

socket.on('conexion', nota => {
    socket.emit('getProducts')
})

socket.on('notas', notas => {
    document.getElementById("chatText").innerHTML = `<ul>
    ${notas.map(datosCliente => {
        return (`<li class="listaNotas">
    <b class="user">${datosCliente.user}</b>[<span class="date">${datosCliente.date}</span>]:<p class="userNotas">${datosCliente.nota}</p>
    </li>`)
    }).join('')}
    </ul>
`
})

socket.on('showProducts', productos => {
    if (productos.length != 0) {
        showTable();
        upDateTable(productos)
    } else {
        showNoProducts();
    }
})

const showNoProducts = () => {
    document.getElementById('articulos').innerHTML = `<div id="noProducts">
    <h3>No hay productos</h3>
</div>`
}
const showTable = () => {
    document.getElementById('articulos').innerHTML = `
    <div class="d-flex align-items-center flex-column" id="tabla">
            <table class="table table-dark">
                <tr>
                    <th>nombre</th>
                    <th>precio</th>
                    <th>img</th>
                </tr>
                <tbody id="tablaProducts">
                </tbody>
            </table>
        </div>`
}
const upDateTable = (productos) => {
    const contenido = productos.map(item => {
        return (`<tr><td>${product.title}</td><td>$${new Intl.NumberFormat('es-MX').format(product.price)}</td><td><img src="${product.thumbnail}" alt="${product.title}" width="50px" height="50px"></td></tr>`)
    }).join('');
    document.getElementById('tablaProducts').innerHTML = contenido;
}