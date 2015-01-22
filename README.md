# Foodtruckr


- [Foodtruckr](#foodtruckr)
    - [Description of the problem and solution](#description-of-the-problem-and-solution)
    - [Scope and focus of the solution](#scope-and-focus-of-the-solution)
    - [Back end Considerations](#back-end-considerations)
        - [High performance with Redis and Geohashing](#high-performance-with-redis-and-geohashing)
        - [Environments](#environments)
        - [Node JS decisions](#node-js-decisions)
        - [Missing things ( Back end ), a.k.a next steps / roadmap](#missing-things--back-end--aka-next-steps--roadmap)
    - [Front end Considerations](#front-end-considerations)
    - [Repository considerations](#repository-considerations)

### Description of the problem and solution

The FoodTruckr Service tells the user what types of food trucks might be found near a specific location on a map.

To accomplish this, the service consists of a Web App that allows the user to search areas of the city using a map, and a backend/api that serves this data to the web App.

The data originally comes form [DataSF](http://www.datasf.org/): [Food
Trucks](https://data.sfgov.org/Permitting/Mobile-Food-Facility-Permit/rqzj-sfat). But to make the service faster and resilient to DataSF's availability (e.g. the dataset was offline on the evening of January 17th 2015), the API server hourly caches the food truck list into Redis.

### Scope and focus of the solution
As mentioned earlier, the service consists of both a Backend and Frontend solution, therefore is a full-stack solution, but **the main focus of the solution is on the backend providing a fast and resilient way of accessing the food truck data** and providing it to the front end. Therefore, you may find the UX is not curated.

## Back end Considerations

### High performance with Redis and Geohashing
As stated before, the goal of this solution is mainly to provide an efficient way of serving the truck data to the API consumers and the front end. Keeping this in mind:
* The app caches the truck list into Redis hourly to avoid relying on the external API, and providing fast access to the data.
* The truck ids are then indexed by geohashing the coordinates, this allows to do ultra fast proximity searches.
* A drawback from using Geohashing is that the proximity lookup is approximate. This is not an issue since we don't require super precise distance comparison and we are optimizing for speed.
* Note that the performance gain from geohashing may not very high because we currently hold only 600+ trucks, but it would matter down the road if we account for more cities or services.
### File structure
All files contain a comment block on top that describes their purpose. The following is an overview.

* index.js: loads the app, starts my redis cache utility and maps routes to the controllers.
* controller folder: this modules are responsible for the logic for specific routes. Currently there is only one route and one controller.
* model folder: this modules are abstraction layers to sources of data.
* util folder: this modules are utilities and service providers.
  * geomath.js: provides some math functions. Currently only one
  * redisGeohash.js: configures and returns the redis client and proximity library instance
  * truckCache.js: service that queries the DataSF API periodically and stores the data into Redis.

### Environments
An `set_env.sh` script has been provided to set environments. This is not needed in heroku since I set my variables in the admin panel but may be usefull if I need to deploy to EC2 in the future or automate my infrastructure.

### Node JS decisions
* Since application is small, route paths are configured in the index.js file, but the actual logic is delegated to controllers in the controller folder.
* Access to the Trucks API (DataSF) is abstracted using the Repository pattern.

### Missing things, a.k.a next steps 
If I were to continue to work on this project the main things to do differently would be:
* Automated tests. The test files are there, but they are empty. Having a single route to maintain, technical debt was small enough to focus on the functionality and performance before testing. But clearly it would be one of the first things to address if I wanted to add more functionality.
* Use Travis or another CI provider.
* More workflow automation. Currently my Gruntfile is not very complete.
* Maybe move the truckCache module into its own microservice (popular these days!)
* Implement a message queue for a logging solution. Maybe RabbitMQ or an ELK stack.
* Include more services, APIs!

## Front end Considerations

For the front end side of things, see [The front end repository](https://github.com/jjmerino/foodtruckr-web)

## Repository considerations
Note: I have separated backend from front end in different repositories because it would be more consistent in case I need to add native applications (i.e third and fourth repositories independent from this one).
