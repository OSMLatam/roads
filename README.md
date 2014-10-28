# Transporte Aberto Monitor

Transportation data from OpenStreetMap.

## How monitoring works

A list of cities is loaded to the platform from a csv file.

For each city, links representing back and forward connections to the *n* nearest neighbours are generated.

Then each links routability is the checked after defined intervals.

If a route can't be calculated or is too long, it will be show as broken, allowing mappers to easily spot where road connections have errors or are incomplete.

## Usage

This is still in alpha and do not have public instances.

## Install

Install dependencies:

* node 0.10.x
* npm 1.2.x
* [OSRM - Open Source Routing Machine](https://github.com/Project-OSRM/osrm-backend/wiki/Building%20OSRM)

Install grunt-cli:

    sudo npm install -g grunt-cli

Clone this repository locally:

    git clone https://github.com/vgeorge/transporte-aberto

Change to repository directory and install packages:

    cd transporte-aberto
    npm install

Run the server:

    npm start

If you want to monitor changes to the client code:

    grunt watch  
