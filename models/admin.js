const Sequelize = require('sequelize');

const sequelize = require('../util/db-sequelize');  //chú ý : trong util phải là js có hỗ trợ sequelize

const Admin = sequelize.define('admin', {  
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    pass: Sequelize.STRING
    
},
    {
        timestamps: false
    }

);

module.exports = Admin;
//timestamps: false để Không tự động thêm updatedAt, createdAt