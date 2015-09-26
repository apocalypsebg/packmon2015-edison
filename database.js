var Sequelize = require('sequelize');

var sequelize = new Sequelize('development', 'null', null, {
 host: 'localhost',
 dialect: 'sqlite',
 define: {
 timestamps: false,
 },
    storage: '/home/root/packmon.sqlite'
});

sequelize.sync();
                           
module.exports.database = sequelize;