const Sequelize = require('sequelize');

const sequelize = require('../util/db-sequelize');

const Message = sequelize.define('messsge', {
from: Sequelize.STRING,
to: Sequelize.STRING,
content: Sequelize.TEXT,
whosend: Sequelize.INTEGER,  
whoreceive: Sequelize.INTEGER
},
{
timestamps: false
}
);

module.exports = Message;
