require('dotenv').config();

const { sequelize, users } = require('../models');
const Logger = require('../utils/Logger');
const { calculateSHA256Hash } = require('../utils/crypto.js')

const logger = new Logger();

const initDatabase = async () => {
    try {
        await sequelize.authenticate();
        logger.success('Connection has been established successfully.');
        await sequelize.sync({ force: true });
        logger.info('Database synchronized successfully.');
    } 
    catch (error) {
        logger.fatal('Unable to connect to the database:', error);
    }
}

const initUserInitialData = async () => {
    try {
        await users.create({
            name: "Administrador",
            surnames: "Employee",
            email: "admin@gmail.com",
            password: await calculateSHA256Hash("Admin1234."),
            type: "admin"
        });
        logger.info('Admin user created successfully.');

        await users.create({
            name: "Executive",
            surnames: "Employee",
            email: "executive@gmail.com",
            password: await calculateSHA256Hash("Executive1234."),
            type: "executive"
        });
        logger.info('Executive user created successfully.');
    }
    catch (error) {
        logger.fatal('Unable to create user:');
        logger.fatal(error);
    }
}

initDatabase().then(async () => {
    await initUserInitialData();
});
