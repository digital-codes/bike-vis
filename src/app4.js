/*
* https://deck.gl/docs/api-reference/geo-layers/trips-layer

from https://codepen.io/pen?&editors=001

https://deck.gl/docs/get-started/using-standalone

https://deck.gl/docs/api-reference/core/view


*/

import {Deck} from '@deck.gl/core';
import { TripsLayer } from '@deck.gl/geo-layers';
import {ScatterplotLayer} from '@deck.gl/layers';

const INITIAL_VIEW_STATE = {
    longitude: -122.4,
    latitude: 37.74,
    zoom: 11,
    maxZoom: 20,
    pitch: 0, // (Number, optional) - pitch angle in degrees. Default 0 (top-down). was 30
    bearing: 0 //  (Number, optional) - bearing angle in degrees. Default 0 (north).
  };
  

const scatter = new ScatterplotLayer({
      data: [
        {position: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude], color: [255, 0, 0], radius: 100}
      ],
      getColor: d => d.color,
      getRadius: d => d.radius
    })

const trips = new TripsLayer({
  id: 'TripsLayer',
  data: '/data/sf-trips.json',
  
  /* props from TripsLayer class */
  
  currentTime: 500,
  // fadeTrail: true,
  getTimestamps: d => d.waypoints.map(p => p.timestamp - 1554772579000),
  trailLength: 600,
  
  /* props inherited from PathLayer class */
  
  // billboard: false,
  capRounded: true,
  getColor: [253, 128, 93],
  getPath: d => d.waypoints.map(p => p.coordinates),
  // getWidth: 1,
  jointRounded: true,
  // miterLimit: 4,
  // rounded: true,
  // widthMaxPixels: Number.MAX_SAFE_INTEGER,
  widthMinPixels: 8,
  // widthScale: 1,
  // widthUnits: 'meters',
  
  /* props inherited from Layer class */
  
  // autoHighlight: false,
  // coordinateOrigin: [0, 0, 0],
  // coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
  // highlightColor: [0, 0, 128, 128],
  // modelMatrix: null,
  opacity: 0.8,
  // pickable: false,
  // visible: true,
  // wrapLongitude: false,
});

  
//new DeckGL({
const deckgl = new Deck({
    // The container to append the auto-created canvas to.
    parent: document.getElementById("#deck"), //document.body,
    mapStyle: '/data/sf-style.json', // trips
    //mapStyle: "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
  initialViewState: INITIAL_VIEW_STATE,
  controller: true,
  layers: [scatter, trips]
});
  
