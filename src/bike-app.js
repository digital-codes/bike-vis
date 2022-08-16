/* eslint-disable */
import * as L from 'leaflet';
import {LeafletLayer} from 'deck.gl-leaflet';


import {Deck} from '@deck.gl/core';
import { TripsLayer } from '@deck.gl/geo-layers';
import {ScatterplotLayer} from '@deck.gl/layers';
import {PolygonLayer} from '@deck.gl/layers';
import {BitmapLayer} from '@deck.gl/layers';

import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';

import {MapView} from '@deck.gl/core';


const ambientLight = new AmbientLight({
  color: [0, 0, 255],
  intensity: 1.0
});

const pointLight = new PointLight({
  color: [0, 255, 0],
  intensity: 2.0,
  position: [-122.42, 37.75, 10000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight});

const material = {
  ambient: 0.5,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [60, 64, 170]
};

const DEFAULT_THEME = {
  bgColor: [0,0,50],
  material,
  effects: [lightingEffect]
};

const INITIAL_VIEW_STATE = {
    longitude: -122.4,
    latitude: 37.74,
    zoom: 11,
    maxZoom: 20,
    pitch: 0, // (Number, optional) - pitch angle in degrees. Default 0 (top-down). was 30
    bearing: 0 //  (Number, optional) - bearing angle in degrees. Default 0 (north).
  };


const map = L.map(document.getElementById('map'), {
  center: [INITIAL_VIEW_STATE.latitude, INITIAL_VIEW_STATE.longitude],
  zoom: INITIAL_VIEW_STATE.zoom
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// ---------------

const scatter = new ScatterplotLayer({
  data: [
    {position: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude], color: [255, 0, 0], radius: 100}
  ],
  getColor: d => d.color,
  getRadius: d => d.radius,
  getFillColor: [0,0,100],
  material: DEFAULT_THEME.material
})

const bg = new PolygonLayer({
id: 'bg',
data: [
/* 
first: 8, second: y
larger x => left
larger y: up
*/
{
  "height": 17,
  "polygon": [
    [-122.3, 37.8],
    [-122.5, 37.8],
    [-122.5, 37.68],
    [-122.3, 37.68],
  ]
},
{
  "height": 30,
  "polygon": [
    [-122.35, 37.75],
    [-122.4, 37.75],
    [-122.4, 37.7],
    [-122.35, 37.7],
  ]
}
],
extruded: true,
wireframe: false,
opacity: 0.1,
getPolygon: f => f.polygon,
getElevation: f => f.height,
getFillColor: DEFAULT_THEME.bgColor,
material: DEFAULT_THEME.material
})

const bmap = new BitmapLayer({
id: 'bitmap-layer',
opacity: .3,
bounds: [-122.42, 37.68, -122.32, 37.78],
image: '/data/sf-districts.png'
});



var tripData = []

async function mkTrips(tm = 500) {
const trips = await new TripsLayer({
id: 'TripsLayer',
data: '/data/trips2.json', // sf-trips.json',

/* props from TripsLayer class */

currentTime: tm,
//fadeTrail: true,
// modify timetamps
//getTimestamps: d => d.waypoints.map(p => p.timestamp - 1554772579000),
getTimestamps: d => d.waypoints.map(p => p.timestamp),
//getColor: [253, 128, 93],
getColor: d => d.waypoints.map(p => p.color),
trailLength: 600,

/* props inherited from PathLayer class */

// billboard: false,
capRounded: true,
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
return trips
}    

var trackData


//new DeckGL({
const deckgl = new LeafletLayer({
// The container to append the auto-created canvas to.
//parent: document.getElementById("#deck"), //document.body,
//canvas: "cv", // document.getElementById("#cv"), // unset
//width: "100%", //"600px",
//height: "300px",
//mapStyle: '/data/sf-style.json', // trips
//mapStyle: "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
initialViewState: INITIAL_VIEW_STATE,
controller: true,
effects: DEFAULT_THEME.effects,
layers: [scatter,bmap,bg],
views: [
  new MapView({
    repeat: true
  })
],

});

// --------------------------------
/*
const deckLayer = new LeafletLayer({
  layers: [
    new GeoJsonLayer({
      id: 'airports',
      data: AIR_PORTS,
      // Styles
      filled: true,
      pointRadiusMinPixels: 2,
      pointRadiusScale: 2000,
      getPointRadius: f => 11 - f.properties.scalerank,
      getFillColor: [200, 0, 80, 180]
    }),
    new ArcLayer({
      id: 'arcs',
      data: AIR_PORTS,
      dataTransform: d => d.features.filter(f => f.properties.scalerank < 4),
      // Styles
      getSourcePosition: f => [-0.4531566, 51.4709959], // London
      getTargetPosition: f => f.geometry.coordinates,
      getSourceColor: [0, 128, 200],
      getTargetColor: [200, 0, 80],
      getWidth: 1
    })
  ]
});
*/
map.addLayer(deckgl);

const featureGroup = L.featureGroup();
featureGroup.addLayer(L.marker([51.4709959, -0.4531566]));
map.addLayer(featureGroup);



// ---------
var tm = 0;
var speed = 10


async function animate() {
  if (tm == 0) {
      // maybe we could load the data here and initialize all paths.
      // don't know how to do this yet ...
    }
    if (tm < 15000) {
        tm += speed
        console.log("Current:",tm)
        const trips = await mkTrips(tm)
        deckgl.setProps({layers: [trips, scatter, bmap, bg]});
        setTimeout(animate,100)
    } else {
        console.log("Finished")
        tm = 0
        setTimeout(animate,100)
    }
}

setTimeout(animate,1000)


