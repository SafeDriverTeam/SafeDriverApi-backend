const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    const fields = {
        policyId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        acquisitionDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        vehicleId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }

    const options = {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };

    let model = sequelize.define('policy', fields, options);
    model.belongsTo(sequelize.models.vehicle, { foreignKey: 'vehicleId' });

    Reflect.defineProperty(model, 'getByPolicyId', {
        value: async function(policyId) {
            return await this.findOne({
                where: {
                    policyId: policyId
                }
            });
        }
    });

    Reflect.defineProperty(model, 'createPolicy', {
        value: async function(acquisitionDate, amount, duration, vehicleId, userId) {
            return await this.create({
                acquisitionDate: acquisitionDate,
                amount: amount,
                duration: duration,
                vehicleId: vehicleId,
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
            return await this.findAll({
                where: {
                    vehicleId: vehicleId
                }
            });
        }
    });

    return model;
}