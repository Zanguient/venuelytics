'use strict';

angular.module('venuelytics.version', [
  'venuelytics.version.interpolate-filter',
  'venuelytics.version.version-directive'
])

.value('version', '0.1');
