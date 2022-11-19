class Container {
    constructor(cliente) {
        this.knexCli = cliente
    }

    async buscar(tabla) {
        return await this.knexCli.select("*").from(tabla)
    }
}
module.exports = Container