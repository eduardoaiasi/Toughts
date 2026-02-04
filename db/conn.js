const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('toughts', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

//autenticação de conexão com o banco de dados
sequelize.authenticate().then(() => {
    console.log("Conexão com o banco de dados realizada com sucesso!");
}).catch((err) => {
    console.log(`Não foi possível conectar ao banco de dados: ${err}`);
});
module.exports = sequelize;