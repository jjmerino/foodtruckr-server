# Food truckr Dummy App
This is a dummy app repository for the FoodTruckr back End. For the front end, see see [The front end repository](https://github.com/jjmerino/foodtruckr-web)

To try the dummy app: http://foodtruckr.herokuapp.com/# (May work slowly at first, let those heroku dynos turn on!)

- [Foodtruckr](#foodtruckr)
    - [Description of the problem and solution](#description-of-the-problem-and-solution)
    - [Scope and focus of the solution](#scope-and-focus-of-the-solution)
    - [Back end Considerations](#back-end-considerations)
        - [High performance with Redis and Geohashing](#high-performance-with-redis-and-geohashing)
        - [File Structure](#file-structure)
        - [Environments](#environments)
        - [Node JS decisions](#node-js-decisions)
        - [Missing things ( Back end ), a.k.a next steps / roadmap](#missing-things--back-end--aka-next-steps--roadmap)
    - [Front end Considerations](#front-end-considerations)
    - [Repository considerations](#repository-considerations)

### Description of the problem and solution

The FoodTruckr Service tells the user what types of food trucks might be found near a specific location on a map.

To accomplish this, the service consists of a Web App that allows the user to search areas of the city using a map, and a backend/api that serves this data to the web App.

The data originally comes form [DataSF](http://www.datasf.org/): [Food
Trucks](https://data.sfgov.org/Permitting/Mobile-Food-Facility-Permit/rqzj-sfat). But to make the service faster and resilient to DataSF's availability (e.g. the data set was offline on the evening of January 17th 2015), the API server hourly caches the food truck list into Redis.

### Scope and focus of the solution
As mentioned earlier, the service consists of both a Backend and Frontend solution, and **the main focus of the dummy project is on the backend side providing a fast and resilient way of accessing the food truck data** and providing it to the front end. [A front end](https://github.com/jjmerino/foodtruckr-web) has been provided as well. Do review the backbone architecture, but do not expect much from the UX at this point.

## Back end considerations

### High performance with Redis and Geohashing
As stated before, my main goal with this solution was to provide to the best of my abilities, an efficient way of serving the truck data to the API consumers and the front end. Keeping this in mind:
* The app caches the truck list into Redis hourly to avoid relying on the external API, and providing fast access to the data.
* The truck ids are then indexed by geohashing the coordinates, this allows to do ultra fast proximity searches.

To do this the following stack was used:
* Node JS application fetches the trucks, stores them, and serves them back through an API.
* Redis is used to store the trucks 
* BackboneJS on the front end

Deployment was done in heroku for it's easy setup. 

### File structure
```
├── Gruntfile.js        
├── Procfile
├── README.md 
├── config.js               // loads env variables
├── controller
│   └── truckController.js  // handles route logic
├── dev.env
├── index.js                // starts the application
├── model
│   ├── truckEntity.js      // defines a schema for consistently passing in trucks arround the app
│   └── truckRepository.js  // provides an abstraction to fetch trucks from redis
├── package.json
├── prod.env
├── set_env.sh              // sources environment variables
├── test
│   ├── truckController.js
│   └── truckr.js           
└── util
    ├── geomath.js          // provides some math functions
    ├── redisGeohash.js     // instantiates the redis client and a geohashing library     
    ├── truckCache.js       // fetches trucks and caches them periodically
    └── truckService.js     // provides an abstraction to the DataSF api
```
### Environments
The app uses environment variables for its configuration. An `set_env.sh` script has been provided to set environments.

### Architectural decisions and design patterns
* Route paths are configured in the index.js file, but the actual logic is delegated to controllers in the controller folder.
* Following MVC, the truck data is always wrapped in a Truck entity (model) while passed around in the app. This also trims unused fields for us and make our app store only what it needs.
* The proximity library has a strong dependency on redis so they have been wrapped into a module using a Factory pattern
* The trucks are accessed using a Repository pattern over redis.
* The trucks are fetched from the external API using a Service pattern

### Missing things and next steps 
If I were to continue to work on this project the main things to do differently would be (in order of priority):
* More automated tests. Currently there is only a couple integration test for the API end point. I.e it fails when something breaks but doesn't tell you where. This didn't impact development velocity since the app is very small. I would definitely add more tests if the app were to grow.
* More workflow automation.
* Use Travis or another CI provider.
* Remove the truckCache module completely into its own micro service, for a more service oriented architecture.
* Implement a RabbitMQ message queue for a logging solution and for splitting the app into smaller services (see previous point).
* Serve the static files (front end) from a CDN.
* Include more services, cities, APIs. 
* Scaling horizontally with HAProxy load balancing user requests.

## Repositories
I have separated backend from front end in different repositories because it would be more consistent in case I need to add native applications (i.e third and fourth repositories independent from this one).

Also it keeps the 2 deploy cycles completely separate which allows me to focus on one part of the solution at a time.


## Front end Considerations

For the front end side of things, see [The front end repository](https://github.com/jjmerino/foodtruckr-web)
