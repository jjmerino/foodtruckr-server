# Foodtruckr Server

## Environments
The app has a production and a development environment. Source the appropriate .env files accordingly.

## GeoHashing and redis 
* The app caches the truck list into redis hourly to avoid relying on the external API.
* The truck list is also indexed by geohashing the coordinates, allowing for fast proximity searches.
