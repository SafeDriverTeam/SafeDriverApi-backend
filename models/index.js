const { Sequelize } = require('sequelize');
const config = require('../config.js');

const database = config.database[config.debug ? "dev" : "prod"];

let sequelize = new Sequelize(database.name, database.user, database.password, {
    dialect: database.dialect,
    host: database.host,
    port: database.port,
    logging: false
});

const users = require('./user')(sequelize);
const vehicles = require('./vehicle')(sequelize);
const policies = require('./policy')(sequelize);
const reports = require('./report')(sequelize);

module.exports = { 
    sequelize,
    users,
    vehicles,
    policies,
    reports
};
