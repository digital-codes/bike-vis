// see https://deck.gl/docs/api-reference/geo-layers/trips-layer

import {TripsLayer} from '@deck.gl/geo-layers';

function App({data, viewState}) {
  /**
   * Data format:
   * [
   *   {
   *     waypoints: [
   *      {coordinates: [-122.3907988, 37.7664413], timestamp: 1554772579000}
   *      {coordinates: [-122.3908298,37.7667706], timestamp: 1554772579010}
   *       ...,
   *      {coordinates: [-122.4485672, 37.8040182], timestamp: 1554772580200}
   *     ]
   *   }
   * ]
   */
  const layer = new TripsLayer({
    id: 'trips-layer',
    data,
    getPath: d => d.waypoints.map(p => p.coordinates),
    // deduct start timestamp from each data point to avoid overflow
    getTimestamps: d => d.waypoints.map(p => p.timestamp - 1554772579000),
    getColor: [253, 128, 93],
    opacity: 0.8,
    widthMinPixels: 5,
    rounded: true,
    fadeTrail: true,
    trailLength: 200,
    currentTime: 100
  });

  return <DeckGL viewState={viewState} layers={[layer]} />;
}

/*
Render Options
currentTime (Number, optional) transition-enabled

    Default: 0

The current time of the frame, i.e. the playhead of the animation.

This value should be in the same units as the timestamps from getPath.
fadeTrail (Boolean, optional)

    Default: true

Whether or not the path fades out.

If false, trailLength has no effect.
trailLength (Number, optional) transition-enabled

    Default: 120

How long it takes for a path to completely fade out.

This value should be in the same units as the timestamps from getPath.
Data Accessors
getPath (Function, optional)

    Default: d => d.path

Called for each data object to retrieve paths. Returns an array of navigation points on a single path.

See PathLayer documentation for supported path formats.
getTimestamps (Function, optional)

    Default: d => d.timestamps

Returns an array of timestamps, one for each navigation point in the geometry returned by getPath, representing the time that the point is visited.

Because timestamps are stored as 32-bit floating numbers, raw unix epoch time can not be used. You may test the validity of a timestamp by calling Math.fround(t) to check if there would be any loss of precision.

*/