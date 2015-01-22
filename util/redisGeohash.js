/*
 * This module initializes the redis client and the geohashing library
 */

var url = require('url');
var redisURL = url.parse(process.env.REDISCLOUD_URL || 'redis://localhost:6379');
var redis = require('redis');
var proximity = require('geo-proximity');
var RedisGeohash = function(){

    this.client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});

    // rediscloud requires authentication
    if(process.env.REDISCLOUD_URL){
        this.client.auth(redisURL.auth.split(":")[1]);
    }

    this.proximity = proximity.initialize(this.client,"truck:locations");
};

module.exports = new RedisGeohash();
