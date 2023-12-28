const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    const fields = {
        vehicleId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        brand: {
            type: DataTypes.STRING,
            allowNull: false
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false
        },
        plate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }

    const options = {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };

    let model = sequelize.define('vehicle', fields, options);

    Reflect.defineProperty(model, 'getByVehicleId', {
        value: async function(vehicleId) {
            return await this.findOne({
                where: {
                    vehicleId: vehicleId
                }
            });
        }
    });

    Reflect.defineProperty(model, 'createVehicle', {
        value: async function(brand, model, year,color, plate, userId) {
            return await this.create({
                brand: brand,
                model: model,
                year: year,
                color: color,
                plate: plate,
                userId: userId
            });
        }
    });

    Reflect.defineProperty(model, 'getByUserId', {
        value: async function(userId) {
            return await this.findAll({
                where: {
                    userId: userId
                }
            });
        }
    });

    Reflect.defineProperty(model, 'getByVehicleId', {
        value: async function(vehicleId) {
            return await this.findOne({
                where: {
                    vehicleId: vehicleId
                }
            });
        }
    });
    return model;
}