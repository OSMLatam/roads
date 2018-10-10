const mongoose = require("mongoose");
const logger = require("../../logger");

// Config
const { nearestCitiesCount } = require("../../../config");

// Models
const City = mongoose.model("City");
const Route = mongoose.model("Route");

/*
 * Generate routes from available cities
 */
module.exports = async function(req, res) {
  try {
    // Get all cities
    const cities = await City.find({ uf: { $in: ["ES"] } });

    // Loop through all cities
    // Insert or update route a-b
    // Insert or update route b-a

    const city = cities[0];
    const nearestCities = await city.findNearestPromise(nearestCitiesCount);
  } catch (err) {
    logger.error(`${err.message} (Route generation task)`);
  }
};
