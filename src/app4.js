/*
* https://deck.gl/docs/api-reference/geo-layers/trips-layer

from https://codepen.io/pen?&editors=001

https://deck.gl/docs/get-started/using-standalone

https://deck.gl/docs/api-reference/core/view

https://ckochis.com/deck-gl-time-frame-animations

https://deck.gl/docs/developer-guide/custom-layers/layer-lifecycle

https://deck.gl/docs/faq

https://stackoverflow.com/questions/59296549/deck-gl-without-react-but-with-webpack-is-not-rendered-the-specified-container

*/

import {Deck} from '@deck.gl/core';
import { TripsLayer } from '@deck.gl/geo-layers';
import {ScatterplotLayer} from '@deck.gl/layers';

import {MapView} from '@deck.gl/core';

const INITIAL_VIEW_STATE = {
    toggle: true,
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


async function mkTrips(tm = 500) {
  const trips = await new TripsLayer({
    id: 'TripsLayer',
    data: '/data/sf-trips.json',
    
    /* props from TripsLayer class */
    
    currentTime: tm,
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
  return trips
}    

var trackData

 
//new DeckGL({
const deckgl = new Deck({
    // The container to append the auto-created canvas to.
    parent: document.getElementById("#deck"), //document.body,
    canvas: "cv", // document.getElementById("#cv"), // unset
    //width: "100%", //"600px",
    //height: "300px",
    //mapStyle: '/data/sf-style.json', // trips
    //mapStyle: "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
  initialViewState: INITIAL_VIEW_STATE,
  controller: true,
  layers: [scatter],

});
  
var tm = 0;
var toggle = true

function setView() {
  const w = document.getElementById("setw").value
  const h = document.getElementById("seth").value
  console.log(w,h)
  //deckgl.setProps({views:mkView(w,h)})
  deckgl.setProps({width:w+"px"})
  deckgl.setProps({height:h+"px"})
  INITIAL_VIEW_STATE.toggle = !INITIAL_VIEW_STATE.toggle
  deckgl.setProps({viewState: INITIAL_VIEW_STATE})
}

function setW(e) {
  setView()
}

function setH(e) {
  setView()
}


document.getElementById("setw").addEventListener("input",setW)
document.getElementById("seth").addEventListener("input",setH)

async function animate() {
    if (tm == 0) {
      // maybe we could load the data here and initialize all paths.
      // don't know how to do this yet ...
    }
    if (tm < 500) {
        tm += 10
        //console.log("Current:",tm)
        const trips = await mkTrips(tm)
        setView()
        deckgl.setProps({layers: [scatter, trips]});
        setTimeout(animate,100)
    } else {
        console.log("Finished")
        tm = 0
        setTimeout(animate,100)
    }
}

setTimeout(animate,1000)

