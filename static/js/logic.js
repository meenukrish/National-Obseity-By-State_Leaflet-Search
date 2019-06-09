// Creating map object
var map = L.map("map", {
  center: new L.latLng([37.8, -96]) ,
  zoom: 5
});

// Adding tile layer
L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  // attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
}).addTo(map);

// Link to GeoJSON


var data = "static/data/National_Obesity_By_State.geojson";

var mapStyle = {
  color: "white",
  fillColor: '#bfa357',
  fillOpacity: 0.5,
  weight: 5
};


var featuresLayer;

function createfeatures(featuresdata)
  {
    featuresLayer= L.geoJson(featuresdata, {
    style: mapStyle,  
    onEachFeature: function(feature, marker) {
      // console.log(feature);
     marker.bindPopup('<p><strong>'+'State: '+feature.properties.NAME+'</strong></p>'+'<hr><p>'+ 'Obesity: '+ feature.properties.Obesity +'</p>');
    }
     })

     map.addLayer(featuresLayer);
  

     var searchControl = new L.Control.Search({
      layer: featuresLayer,
      propertyName: 'NAME',
      marker: false,
      moveToLocation: function(latlng, title, map) {
        //map.fitBounds( latlng.layer.getBounds() );
        var zoom = map.getBoundsZoom(latlng.layer.getBounds());
          map.setView(latlng, zoom); // access the zoom
      }
    });
    
       
    searchControl.on('search:locationfound', function(e) {
             
      e.layer.setStyle({fillColor: '#3f0', color: '#0f0'});
      if(e.layer._popup)
        e.layer.openPopup();
    
    }).on('search:collapsed', function(e) {
    
      featuresLayer.eachLayer(function(layer) {	//restore feature color
        featuresLayer.resetStyle(layer);
      });	
    });
    
    map.addControl( searchControl );  //inizialize search control

}

$.ajax({
  dataType: "json",
  url: data,
  success: function(d){ createfeatures(d.features)}
  }).error(function() {});
	



