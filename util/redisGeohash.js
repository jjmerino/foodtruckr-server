var url = require('url');
var redisURL = url.parse(process.env.REDISCLOUD_URL || 'redis://localhost:6379');
var redis = require('redis');
var proximity = require('geo-proximity');

/**
 * Initializes the redis client and the geohashing library
 */
var RedisGeohash = function(port, hostname, auth){

    this.client = redis.createClient(port, hostname, {no_ready_check: true});
    if(auth){ this.client.auth(auth); }
    this.proximity = proximity.initialize(this.client,"truck:locations");
};
var auth = process.env.REDISCLOUD_URL ? redisURL.auth.split(":")[1] : false;
module.exports = new RedisGeohash(redisURL.port, redisURL.hostname, auth);
