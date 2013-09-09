var csv = require('csv');
var sqlite = require('spatialite').verbose();
var db = new sqlite.Database('b5500.sqlite');

db.serialize(function() {


  db.run("CREATE TABLE cities (id INTEGER,uf TEXT,name TEXT, lat REAL, lon REAL,is_capital INTEGER)");
  db.spatialite(function(err) {
  var stmt = db.prepare("INSERT INTO cities VALUES (?,?,?,?,?,?)");

  csv()
    .from('data/cities.csv', { columns: true })
    .on('record', function(city){
      stmt.run(city.id,city.uf,city.name,city.lat,city.lon,city.is_capital);
    })
    .on('end', function() {
        stmt.finalize();
        // db.each("SELECT * FROM cities", function(err, row) {
        //     console.log(row);
        // });
        db.run("SELECT AddGeometryColumn('cities','center',4326, 'POINT', 'XY')").close();
        
        // db.close();
    });
  });

});
