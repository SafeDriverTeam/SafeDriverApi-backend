const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    const fields = {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
    
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    
        surnames: {
            type: DataTypes.STRING,
            allowNull: false
        },
    
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [64, 64]
            }
        },
    
        type: {
            type: DataTypes.ENUM('admin', 'driver', 'executive', 'adjuster'),
            allowNull: false
        }
    }

    const options = {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };

    let model = sequelize.define('user', fields, options);

    Reflect.defineProperty(model, 'getByEmail', {
        value: async function(email) {
            return await this.findOne({
                where: {
                    email: email
                }
            });
        }
    });

    Reflect.defineProperty(model, 'registerUser', {
        value: async function(name, surnames, email, password, type) {
            const t = await sequelize.transaction();
            
            try {
                const user = await this.create({
                    name,
                    surnames,
                    email,
                    password,
                    type
                }, { transaction: t });
    
                await t.commit();
                return user;
                
            } catch(error) {
                await t.rollback();
                throw error;
            }
        }
    });

    return model;
}
