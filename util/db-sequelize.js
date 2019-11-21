 
const Sequelize = require('sequelize');

const sequelize = new Sequelize('ec', 'root', 'khaipro123', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
