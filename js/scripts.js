mapboxgl.accessToken = 'pk.eyJ1IjoiYXNwOTA4OSIsImEiOiJja2xrMHk3ZW01Mmk2MnZucmFrM3podmh3In0.qZ1N12EiB17J56BQ5Oy5QQ'
// dropping in basic points to mark off the huge sky scrapers
 $.getJSON('./data/community-fridges.json', function(fridges){
   console.log(fridges)

 //looping it all to make points
fridges.forEach(function(fridgerow){
 console.log(fridgerow.organization, fridgerow.location_type, fridgerow.instagram, fridgerow.url)

//function to translate NYC land use codes
var LandUseLookup = (code) => {
  switch (code) {
    case 1:
      return {
        color: '#f4f455',
        description: '1 & 2 Family',
      };
    case 2-3:
      return {
        color: '#f7d496',
        description: 'Multifamily Walk-up',
      };
    case 3:
      return {
        color: '#FF9900',
        description: 'Multifamily Elevator',
      };
    case 4:
      return {
        color: '#f7cabf',
        description: 'Mixed Res. & Commercial',
      };
    case 5:
      return {
        color: '#ea6661',
        description: 'Commercial & Office',
      };
    case 6:
      return {
        color: '#d36ff4',
        description: 'Industrial & Manufacturing',
      };
    case 7:
      return {
        color: '#dac0e8',
        description: 'Transportation & Utility',
      };
    case 8:
      return {
        color: '#5CA2D1',
        description: 'Public Facilities & Institutions',
      };
    case 9:
      return {
        color: '#8ece7c',
        description: 'Open Space & Outdoor Recreation',
      };
    case 10:
      return {
        color: '#bab8b6',
        description: 'Parking Facilities',
      };
    case 11:
      return {
        color: '#5f5f60',
        description: 'Vacant Land',
      };
    case 12:
      return {
        color: '#5f5f60',
        description: 'Other',
      };
    default:
      return {
        color: '#5f5f60',
        description: 'Other',
      };
  }
};
// connecting to the datasource for the map and setting load view
var map = new mapboxgl.Map({
  container: 'mapContainer', // container ID
  style: 'mapbox://styles/mapbox/light-v10', // style URL
  center: [-73.97992, 40.76521], // starting position [lng, lat]
  zoom: 14.5, // starting zoom
//  pitch: 60, // pitch in degrees
  bearing: -60,
});
map.on('style.load', function (){
  //add the geo source
  map.addSource('57th_lots' , {
    type: 'geojson',
    data: '/data/57th_street.geojson'
  });

var nav = new mapboxgl.NavigationControl();
  map.addControl(nav, 'top-left');

  map.addLayer({
    'id': '57th_street_fill',
    'type': 'fill',
    'source': '57th_lots',
    'layout': {},
    'paint': {
        'fill-color': {
          type: 'categorical',
            property: 'LandUse',
            stops: [
              [
                '01',
                LandUseLookup(1).color,
              ],
              [
                '02',
                LandUseLookup(2).color,
              ],
              [
                '03',
                LandUseLookup(3).color,
              ],
              [
                '04',
                LandUseLookup(4).color,
              ],
              [
                '05',
                LandUseLookup(5).color,
              ],
              [
                '06',
                LandUseLookup(6).color,
              ],
              [
                '07',
                LandUseLookup(7).color,
              ],
              [
                '08',
                LandUseLookup(8).color,
              ],
              [
                '09',
                LandUseLookup(9).color,
              ],
              [
                '10',
                LandUseLookup(10).color,
              ],
              [
                '11',
                LandUseLookup(11).color,
              ],
          ]
      },
      'fill-outline-color': '#ccc',
      'fill-opacity': 0.6
    },
  });

//Making Pop-up features
})
map.on('mousemove', function (e) {
  // query for the features under the mouse, but only in the lots layer
  var features = map.queryRenderedFeatures(e.point, {
      layers: ['brooklyn-cd6-fill'],
  });

  if (features.length > 0) {
    // show the popup
    // Populate the popup and set its coordinates
    // based on the feature found.

    var hoveredFeature = features[0]
    var address = hoveredFeature.properties.Address
    var landuseDescription = LandUseLookup(parseInt(hoveredFeature.properties.LandUse)).description

    var popupContent = `
      <div>
        ${address}<br/>
        ${landuseDescription}
      </div>
    `

    popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(map);

    // set this lot's polygon feature as the data for the highlight source
    map.getSource('highlight-feature').setData(hoveredFeature.geometry);

    // show the cursor as a pointer
    map.getCanvas().style.cursor = 'pointer';
  } else {
    // remove the Popup
    popup.remove();

    map.getCanvas().style.cursor = '';
  }

}