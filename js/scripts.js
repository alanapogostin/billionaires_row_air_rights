mapboxgl.accessToken = 'pk.eyJ1IjoiYXNwOTA4OSIsImEiOiJja2xrMHk3ZW01Mmk2MnZucmFrM3podmh3In0.qZ1N12EiB17J56BQ5Oy5QQ'

// connecting to the datasource for the map and setting load view
var map = new mapboxgl.Map({
  container: 'mapContainer', // container ID
  style: 'mapbox://styles/mapbox/light-v10', // style URL
  center: [-73.97992, 40.76721], // starting position [lng, lat]
  zoom: 14.5, // starting zoom
  pitch: 40, // pitch in degrees
  bearing: -61,
});

map.on('style.load', function (){
  //add the geo source
  map.addSource('57th_lots' , {
    type: 'geojson',
    data: 'data/57th_street.geojson'


});
  var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

  map.addLayer({
    'id': '57th_street_floors_fill',
    'type': 'fill',
    'source': '57th_lots',
    'layout': {},
    'paint': {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'numfloors'],
          0,
          '#fef0d9',
          20,
          '#fdcc8a',
          40,
          '#fc8d59',
          60,
          '#e34a33',
          80,
          '#b30000'
        ]
      ,
      'fill-outline-color': '#ccc',
      'fill-opacity': 0.8
    }
  });
})

map.on('load', function() {
var layers = ['0-20', '20-40', '40-60', '60-80', '80+'];
var colors = ['#fef0d9', '#fdcc8a', '#fc8d59', '#e34a33', '#b30000'];

for (i = 0; i < layers.length; i++) {
  var layer = layers[i];
  var color = colors[i];
  var item = document.createElement('div');
  var key = document.createElement('span');
  key.className = 'legend-key';
  key.style.backgroundColor = color;

  var value = document.createElement('span');
  value.innerHTML = layer;
  item.appendChild(key);
  item.appendChild(value);
  legend.appendChild(item);
}

});

// Adding 3d Buildings
map.on('load', function () {
// Insert the layer beneath any symbol layer.
var layers = map.getStyle().layers;

var labelLayerId;
for (var i = 0; i < layers.length; i++) {
if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
labelLayerId = layers[i].id;
break;
}
}

map.addLayer(
{
'id': '3d-buildings',
'source': 'composite',
'source-layer': 'building',
'filter': ['==', 'extrude', 'true'],
'type': 'fill-extrusion',
'minzoom': 15,
'paint': {
'fill-extrusion-color': '#aaa',

// use an 'interpolate' expression to add a smooth transition effect to the
// buildings as the user zooms in
'fill-extrusion-height': [
'interpolate',
['linear'],
['zoom'],
15,
0,
15.05,
['get', 'height']
],
'fill-extrusion-base': [
'interpolate',
['linear'],
['zoom'],
15,
0,
15.05,
['get', 'min_height']
],
'fill-extrusion-opacity': 0.6
}
},
labelLayerId
);
});

// Adding a interactive feature
var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
});
map.on('mousemove', function (e) {

  var features = map.queryRenderedFeatures(e.point, {
      layers: ['57th_street_floors_fill'],
  });

  if (features.length > 0) {

    var hoveredFeature = features[0];
    var address = hoveredFeature.properties.address;
    var numfloors = hoveredFeature.properties.numfloors;
    var far = hoveredFeature.properties.far;
    var ownername = hoveredFeature.properties.ownername;

    var popupContent = `
      <div>
        <b> Building Information</b><br/>
        ${address}<br/>
        Number of Floors: ${numfloors}<br/>
        Floor Area Ratio: ${far}<br/>
        Building Owner: ${ownername}
      </div>
    `
    popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(map);
    map.getSource('57th_street').setData(hoveredFeature.geometry);
    map.getCanvas().style.cursor = 'pointer';
  }
  else {
    popup.remove();
    map.getCanvas().style.cursor = '';
  ;}

})
// // adding in the skyscraper points
// map.on('style.load', function (){
//   //add the geo source
//   map.addSource('landmarks' , {
//     type: 'json',
//     data: 'data/landmark_points.json'
//
//
// });
// $.getJSON('data/landmark_points.json', function(landmark){
//     console.log(landmark)
//
//   //looping it all to make points
//
// landmark.forEach(function(landmarkrow){
//   console.log(landmarkrow.address)
//
//   new mapboxgl.Marker({
//    })
//      .setLngLat([landmarkrow.coordinates]) // use [] to make it an array
//      // .setPopup(new mapboxgl.Popup().setHTML(html))
//      .addTo(map);
//    })}
