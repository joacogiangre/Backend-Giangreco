const getConfig = (CLIENT, DRIVER, USERNAME, PASSWORD, HOST, DB_NAME) => {
    const PORT = '3306'
    const cnxStr = `${DRIVER}://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/${DB_NAME}`
    if (CLIENT == 'mysql') {
        const KNEX_CONFIG = {
            client: CLIENT,
            connection: cnxStr
        }
        return KNEX_CONFIG
    } else {
        const KNEX_CONFIG = {
            client: CLIENT,
            connection: {
                filename: "./dbSQLite/ecommerce.sqlite"
            }
        }
        return KNEX_CONFIG
    }


}

module.exports = { getConfig }