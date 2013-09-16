var _ = require('underscore');

var City = {}

// cities index
exports.list = {};

exports.initFromJSON = function (json) {
  _.each(json,function(element,index,list){
    console.log(this);
    // this.list[element.id.toString()] = {
    //   id:   element.id,
    //   lon:  element.lon,
    //   lat:  element.lat,
    //   tags: element.tags
    // };    
  });  
}


// kd-tree index
exports.kdtree = null;

// calculates distance between two points
exports.distance = function(a,b){
  return Math.pow(a.lon - b.lon, 2) +  Math.pow(a.lat - b.lat, 2);
}

exports.index = function() {
  City.kdtree = new kdTree(City.simpleArray(), City.distance, 2);
}

// get simplified objects to build kd-tree index
exports.simpleArray = function(){
  array = [];
  for (id in City.list) {
    city = this.list[id];
    array.push({id: city.id, lon: city.lon, lat: city.lat});
  }
  return array;
}

// get k nearest points
exports.nearest = function(point, k){
  if (this.kdtree)
    return this.kdtree.nearest(point, k);
}

exports.City = City