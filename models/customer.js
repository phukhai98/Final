const Sequelize = require('sequelize');

const sequelize = require('../util/db-sequelize');

const Customer = sequelize.define('customer', {
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

module.exports = Customer;
