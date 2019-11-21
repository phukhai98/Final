const Sequelize = require('sequelize');

const sequelize = require('../util/db-sequelize');

const Code = sequelize.define('code', {
    code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true,
        validate: {
            notNull: { args: true}
        }
    },
    coin: Sequelize.INTEGER,
    used: Sequelize.INTEGER //0 là chưa xài, 1 là đã xài
},
    {
        timestamps: false
    }
);

module.exports = Code;
//timestamps: false để Không tự động thêm updatedAt, createdAt