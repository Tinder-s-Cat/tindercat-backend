const { getDistance, convertDistance } = require('geolib')


function distance(userPoint, ownerPoint) {
  return convertDistance(getDistance(userPoint, ownerPoint, 1000), 'km')
}

module.exports = distance