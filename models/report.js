const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    const fields = {
        reportId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        declaration: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        place:{
            type: DataTypes.STRING,
            allowNull: false
        },
        judgment: {
            type: DataTypes.STRING,
            allowNull: false
        },
        involved: {
            type: DataTypes.STRING,
            allowNull: false
        },
        vehiclesInvolved: {
            type: DataTypes.STRING,
            allowNull: false
        },
        driverId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }

    const options = {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };

    let model = sequelize.define('report', fields, options);
    model.belongsTo(sequelize.models.policy, { foreignKey: 'policyId' });
    model.belongsTo(sequelize.models.user, { foreignKey: 'userId'});

    Reflect.defineProperty(model, 'getByReportId', {
        value: async function(reportId) {
            return await this.findOne({
                where: {
                    reportId: reportId
                }
            });
        }
    });

    Reflect.defineProperty(model, 'setAdjuster', {
        value: async function(reportId, adjusterId) {
            return await this.update({
                userId: adjusterId
            }, {
                where: {
                    reportId: reportId
                }
            });
        }
    });

    Reflect.defineProperty(model, 'createReport', {
        value: async function(declaration, date, place, judgment, policyId, involved, vehiclesInvolved, userId, driverId) {
            return await this.create({
                declaration: declaration,
                date: date,
                place: place,
                judgment: judgment,
                policyId: policyId,
                involved: involved,
                vehiclesInvolved: vehiclesInvolved,
                userId: userId,
                driverId: driverId
            });
        }
    });

    Reflect.defineProperty(model, 'updateReportJudgment', {
        value: async function(reportId, judgment) {
            return this.update(
                { judgment: judgment }, 
                { where: 
                    { reportId: reportId } 
            });
        }
    });
    

    Reflect.defineProperty(model, 'deleteReport', {
        value: async function(reportId) {
            return await this.destroy({
                where: {
                    reportId: reportId
                }
            });
        }
    });

    Reflect.defineProperty(model, 'getByAdjusterId', {
        value: async function(userId) {
            return await this.findAll({
                where: {
                    userId: userId
                }
            });
        }
    });


    Reflect.defineProperty(model, 'getReportsWithoutAdjuster', {
        value: async function() {
            return await this.findAll({
                where: {
                    userId: null
                },
                attributes: ['reportId', 'declaration'] // Solo devuelve los campos necesarios
            });
        }
    });
    

    Reflect.defineProperty(model, 'getByDriverId', {
        value: async function(driverId) {
            return await this.findAll({
                where: {
                    driverId: driverId
                }
            });
        }
    });

    return model;
}