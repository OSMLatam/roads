// Controllers
var home = require("./controllers/home");

// Tasks
const generateRoutes = require("./lib/tasks/generate-routes");

module.exports = function(app) {
  var apiPrefix = "/api/v1";

  // Administrative tasks
  app.get("/admin/generate-routes", (req, res) => {
    generateRoutes();
    res.sendStatus(200);
  });

  app.get("/", home.index);
};
