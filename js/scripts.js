mapboxgl.accessToken = 'pk.eyJ1IjoiYXNwOTA4OSIsImEiOiJja2xrMHk3ZW01Mmk2MnZucmFrM3podmh3In0.qZ1N12EiB17J56BQ5Oy5QQ'

// connecting to the datasource for the map and setting load view
var map = new mapboxgl.Map({
  container: 'mapContainer', // container ID
  style: 'mapbox://styles/mapbox/light-v10', // style URL
  center: [-73.97992, 40.76721], // starting position [lng, lat]
  zoom: 14.5, // starting zoom
//  pitch: 60, // pitch in degrees
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
          ['get', 'NumFloors'],
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
