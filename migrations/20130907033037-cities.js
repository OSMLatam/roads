var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('cities', {
      id: { type: 'int', primaryKey: true },
      lon: 'real',
      lat: 'real',
      tags: 'blob'
    }, callback);
  
};

exports.down = function(db, callback) {
  // db.dropTable('cities', callback);
  callback();
};
