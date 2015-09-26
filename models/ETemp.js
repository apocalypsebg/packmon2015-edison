var database = require('../database').database;


var eTemp = database.define('temperatures', {
 id: { type: 'INTEGER', primaryKey: true },
 timestamp: { type: 'TEXT', allowNull: false },
 value: { type: 'INTEGER', allowNull: false },
});

module.exports.ETemp = eTemp;
