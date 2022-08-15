/* eslint-disable */
import * as L from 'leaflet';
import {LeafletLayer} from 'deck.gl-leaflet';
import {MapView} from '@deck.gl/core';
import {GeoJsonLayer, ArcLayer} from '@deck.gl/layers';

import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';

import { TripsLayer } from '@deck.gl/geo-layers';

const INITIAL_VIEW_STATE = {
  latitude: 52.500869,
  longitude: 13.419047,
	zoom: 16,
	maxZoom: 15,
  	minZoom: 13,
	pitch: 45,
	bearing: 0
	};
	


const ambientLight = new AmbientLight({
color: [255, 255, 255],
intensity: 1.0
});

const pointLight = new PointLight({
color: [255, 255, 255],
intensity: 2.0,
position: [-74.05, 40.7, 8000]
});

const paintLayer = {
'fill-extrusion-color': '#aaa',
'fill-extrusion-height': {
  type: 'identity',
  property: 'height'
},
'fill-extrusion-base': {
  type: 'identity',
  property: 'min_height'
},
'fill-extrusion-opacity': 0.6
};

const lightingEffect = new LightingEffect({ambientLight, pointLight});


// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const AIR_PORTS =
    "/data/ne_10m_airports.geojson"
  //'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';

const map = L.map(document.getElementById('map'), {
  center: [51.47, 0.45],
  zoom: 4
});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const deckLayer = new LeafletLayer({
  views: [
    new MapView({
      repeat: true
    })
  ],
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
map.addLayer(deckLayer);

const featureGroup = L.featureGroup();
featureGroup.addLayer(L.marker([51.4709959, -0.4531566]));
map.addLayer(featureGroup);
