const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    const fields = {
        imageReportId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }

const options = {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
};

let model = sequelize.define('imagesReports', fields, options);
model.belongsTo(sequelize.models.report, {foreignKey: 'reportId'});


Reflect.defineProperty(model, 'createImageReport', {
    value: async function (image, reportId) {
        return await this.create({
            image: image,
            reportId: reportId
        });
    }
})

Reflect.defineProperty(model, 'getByReportId', {
    value: async function(reportId) {
        return await this.findAll({
            where: {
                reportId: reportId
            }
        });
    }
});
return model;
}