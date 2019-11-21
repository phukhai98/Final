const Sequelize = require('sequelize');

const sequelize = require('../util/db-sequelize');

const User = sequelize.define('user', {
name: {
type: Sequelize.STRING,
allowNull: false,
primaryKey: true
},
pass: Sequelize.STRING,
money:Sequelize.INTEGER,
ball:Sequelize.INTEGER,
level:Sequelize.INTEGER,
process:Sequelize.INTEGER,
gengar: Sequelize.INTEGER,
snolax: Sequelize.INTEGER,
darkrai: Sequelize.INTEGER,
squirtle: Sequelize.INTEGER,
charmander: Sequelize.INTEGER,
sudowoodo: Sequelize.INTEGER,
scyther: Sequelize.INTEGER,
diglett: Sequelize.INTEGER,
bulbasaur: Sequelize.INTEGER,
beedrill: Sequelize.INTEGER,
pikachu: Sequelize.INTEGER,
gyarados: Sequelize.INTEGER,


},
{
timestamps: false
}
);

module.exports = User;