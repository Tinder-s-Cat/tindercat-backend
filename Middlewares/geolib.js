const { getDistance, convertDistance } = require('geolib')


function distance(userPoint, ownerPoint) {
  return convertDistance(getDistance(userPoint, ownerPoint, 1000), 'km')
}

// console.log(distance({
//   latitude: 0.6998597,
//   longitude: 101.562321
// }, {
//   latitude: 0.5941741,
//   longitude:101.6436178
// }), 'km');
module.exports = distance