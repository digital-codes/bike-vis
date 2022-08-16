/*
* https://deck.gl/docs/api-reference/geo-layers/trips-layer

from https://codepen.io/pen?&editors=001

https://deck.gl/docs/get-started/using-standalone

https://deck.gl/docs/api-reference/core/view

https://ckochis.com/deck-gl-time-frame-animations

https://deck.gl/docs/developer-guide/custom-layers/layer-lifecycle

https://deck.gl/docs/faq

https://stackoverflow.com/questions/59296549/deck-gl-without-react-but-with-webpack-is-not-rendered-the-specified-container

https://deck.gl/docs/developer-guide/interactivity

https://github.com/streamlit/streamlit/issues/475

https://deck.gl/docs/api-reference/layers/bitmap-layer


*/

import {Deck} from '@deck.gl/core';
import { TripsLayer } from '@deck.gl/geo-layers';
import {ScatterplotLayer} from '@deck.gl/layers';
import {PolygonLayer} from '@deck.gl/layers';
import {BitmapLayer} from '@deck.gl/layers';

//import {MapView} from '@deck.gl/core';

import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';


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
  effects: DEFAULT_THEME.effects,
  layers: [scatter,bmap,bg],

});
  
var tm = 0;
var speed = 10

function setView() {
  const w = document.getElementById("setw").value
  const h = document.getElementById("seth").value
  //console.log(w,h)
  //deckgl.setProps({views:mkView(w,h)})
  deckgl.setProps({width:w+"px"})
  deckgl.setProps({height:h+"px"})
  // setting the initial state here prevents mouse controls!! 
  //deckgl.setProps({viewState: INITIAL_VIEW_STATE})
}

function setW(e) {
  setView()
}

function setH(e) {
  setView()
}

function setS(e) {
  speed = parseInt(e.target.value)
  console.log("Speed:",speed)
}

function setTm(e) {
  const t = e.target.value
  document.getElementById("tv").innerHTML = t
  restartTime = parseInt(t)
  console.log("Restart at: ", restartTime)
}

var restartTime = 0
async function restart() {
  const t = document.getElementById("sett").value
  tm = restartTime
  //const trips = await mkTrips(tm)
  //deckgl.setProps({layers: [scatter, trips]});
  //setTimeout(animate,100)
}

document.getElementById("setw").addEventListener("input",setW)
document.getElementById("seth").addEventListener("input",setH)
document.getElementById("sett").addEventListener("input",setTm)
document.getElementById("sets").addEventListener("input",setS)
document.getElementById("restart").addEventListener("click",restart)

async function animate() {
  const tmVal = document.getElementById("tm") || null
  if (tmVal != null)
    tmVal.innerHTML = tm.toString()

  if (tm == 0) {
      // maybe we could load the data here and initialize all paths.
      // don't know how to do this yet ...
    }
    if (tm < 15000) {
        tm += speed
        //console.log("Current:",tm)
        const trips = await mkTrips(tm)
        setView()
        deckgl.setProps({layers: [trips, scatter, bmap, bg]});
        setTimeout(animate,100)
    } else {
        console.log("Finished")
        tm = restartTime
        setTimeout(animate,100)
    }
  }

/*
  // load data 
fetch("/data/trips.json")
.then((response) => response.json())
.then((data) => {
  console.log(data.data)
  tripData = data.data
  setTimeout(animate,1000)
  }
)
*/
setTimeout(animate,1000)

