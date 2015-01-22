/*
 * This module exposes environment configuration to the rest of the app
 */
var config = {
  port: process.env.PORT,
  redisPort: process.env.REDIS_PORT,
  redisHost: process.env.REDIS_HOST,
};

module.exports = config;
