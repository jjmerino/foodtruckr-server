# Foodtruckr Server

## Environments
The app has a production and a development environment. Source the appropriate .env files accordingly using the `set_env.sh` script.

## Architecture decisions 
* Since application is small, route paths are configured in the index.js file, but the actual logic is delegated to controllers in the controller folder.
* Access to the Truck model, both via the API and the Redis instance are abstracted using the Repository pattern.

## GeoHashing and redis 
* The app caches the truck list into redis hourly to avoid relying on the external API.
* The truck list is also indexed by geohashing the coordinates, this allowing to do ultra fast proximity searches.
