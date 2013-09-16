var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  console.log(typeof db)
  db.runSQL('select1', callback);
  
  // db.createTable('cities', {
  //     id: { type: 'int', primaryKey: true },
  //     lon: 'real',
  //     lat: 'real',
  //     tags: 'blob'
  //   }, setGeometryColumn(callback));
  //   
  //   function setGeometryColumn(cb) {
  //     db.run('select 1');
  //     callback();
  //   }
  
};

exports.down = function(db, callback) {
  // db.dropTable('cities', callback);
  callback();
};
