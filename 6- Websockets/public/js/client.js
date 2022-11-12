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
    socket.emit('getItems')
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

socket.on('showItems', items => {
    if (items.length != 0) {
        showTable();
        upDateTable(items)
    } else {
        showNoProducts();
    }
})



const showNoProducts = () => {
    document.getElementById('articulos').innerHTML = `<div id="noItems">
    <h3>No hay items</h3>
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
                <tbody id="tablaItems">
                </tbody>
            </table>
        </div>`
}
const upDateTable = (items) => {
    const contenido = items.map(item => {
        return (`<tr><td>${item.title}</td><td>$${item.price}</td><td><img src="${item.thumbnail}" alt="${item.title}" width="50px" height="50px"></td></tr>`)
    }).join('');
    document.getElementById('tablaItems').innerHTML = contenido;
}