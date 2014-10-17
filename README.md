# City Links

This is a platform to verify the existence of routable connections between cities in OpenStreetMap.

## How monitoring works

A list of cities is loaded to the platform from a csv file.

For each city, links representing back and forward connections to the *n* nearest neighbours are generated.

Then each links routability is the checked after defined intervals.

If a route can't be calculated or is too long, it will be show as broken, allowing mappers to easily spot where road connections have errors or are incomplete. 

## Usage

This is still in alpha and do not have public instances.

## Developing

Dependencies:

* node 0.10.x
* npm 1.2.x


Clone this repository locally and run:

    npm install
   
