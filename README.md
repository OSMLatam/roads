# OSM Roads Monitor

This is a project to monitor road connections data in OpenStreetMap.

## How monitoring works

A list of cities is loaded to the platform from a csv file.

For each city, arcs representing back and forward connections to the *n* nearest neighbours are generated.

Then each arc routability is the checked after defined intervals.

If a route can't be calculated or is too long, it will be show as broken, allowing mappers to easily spot where road connections have errors or are incomplete. 

## Use

This is still in alpha and do not have public instances.

## Develop

Dependencies:

* node 0.10.x
* npm 1.2.x


Clone this repository locally and run:

    npm install
   
