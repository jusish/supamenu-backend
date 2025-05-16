const { Sequelize } = require('sequelize')
const sequelize = new Sequelize(
    'supamenu',
    'justin',
    'dev'
    , {
        host: 'localhost',
        dialect: 'postgres',
        logging: true,
    })

module.exports = sequelize
