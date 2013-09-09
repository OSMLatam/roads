var csv = require('csv');
var sqlite = require('spatialite').verbose();
db = new sqlite.Database(':memory:');


module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });
  
  // A very basic default task.
  grunt.registerTask('connections', 'Regenarate connections set.', function() {

    var query = "SELECT AsGeoJSON(ST_MakeValid(Centroid(GeomFromText('POLYGON ((30 10, 10 20, 20 40, 40 40, 30 10))')))) AS geojson;";
    db.spatialite(function(err) {
      db.each(query, function(err, row) {
        grunt.write.log(row.geojson);
      });
    });
  });

  // Default task(s).
  grunt.registerTask('default', ['connections']);

};