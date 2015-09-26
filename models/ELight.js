var database = require('../database').database;


var ELight = database.define('light', {
 id: { type: 'INTEGER', primaryKey: true },
 timestamp: { type: 'TEXT', allowNull: false },
 value: { type: 'INTEGER', allowNull: false },
});

module.exports.ELight = ELight;