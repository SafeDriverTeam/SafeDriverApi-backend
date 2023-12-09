require('dotenv').config();

var currentDate =  new Date();
var expirationDate = new Date();
expirationDate.setMonth(currentDate.getMonth() + 12);
const { sequelize, users, vehicles, policies, reports } = require('../models');
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

        await users.create({
            name: "Adjuster",
            surnames: "Employee",
            email: "adjuster@gmail.com",
            password: await calculateSHA256Hash("Adjuster1234."),
            type: "adjuster"
        });
        logger.info('Adjuster user created successfully.');

        await users.create({
            name: "Driver",
            surnames: "Employee",
            email: "driver@gmail.com",
            password: await calculateSHA256Hash("Driver1234."),
            type: "driver"
        });
        logger.info('Driver user created successfully.');

        await vehicles.create({
            brand: "Ford",
            model: "Focus",
            year: 2010,
            color: "Blue",
            plate: "1234ABC",
            userId: 4
        });
        logger.info('Vehicle created successfully.');

        await policies.create({
            acquisitionDate: new Date(),
            amount: 10000,
            expirationDate: expirationDate,
            vehicleId: 1,
            userId: 4,
            typePolicy: 1
        });
        logger.info('Policy created successfully.');

        await reports.create({
            declaration: "I crashed my car",
            date: new Date(),
            place: "Calle 123",
            judgment: "",
            policyId: 1,
            userId: null,
            vehicleId: 1,
            involved: "Martin Perez",
            vehiclesInvolved: "Ford Focus 2010"
        });
        logger.info('Report created successfully.');

    }
    catch (error) {
        logger.fatal('Unable to create user:');
        logger.fatal(error);
    }
}

initDatabase().then(async () => {
    await initUserInitialData();
});
