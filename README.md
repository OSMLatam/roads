# ORC 

OpenStreetMap Route Checker (ORC) is an application to monitor routing quality of OpenStreetMap data. In the alpha version, it will check the existence of highway routes between Brazilian cities.

## Development

Requirements:

* Node.js
* npm
* MongoDB
* [OSRM](http://map.project-osrm.org/) ([Install instructions](https://github.com/DennisOSRM/Project-OSRM/wiki/Running-OSRM))

Clone this repository locally:

    git clone git@github.com:vgeorge/b5500.git

Install Node.js dependencies:

    npm install
    
Open `config/config.js` and set your OSRM URL. 

Create database `orc` in MongoDB and test:

    npm test

Run the app:

	npm start