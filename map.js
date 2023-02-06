var map, geojson;
var selected, features, layer_name, layerControl;
var content;
var popup = L.popup();



map = L.map('map', {
   
	crs: L.CRS.EPSG4326,
	center: [23.00, 82.00],
	zoom: 3,
	zoomControl: false
	// layers: [grayscale, cities]
});


var satellite = L.tileLayer('https://wi.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
   // maxZoom: 23,
		attribution: 'Source: Esri, Maxar, Earthstar Geographics, CNES/Airbus DS, USDA FSA, USGS, Getmapping, Aerogrid, IGN, IGP, and the GIS User Community'
	}).addTo(map);
	
var hillshade = L.tileLayer('https://whi.maptiles.arcgis.com/arcgis/rest/services/World_Hillshade/MapServer/tile/{z}/{y}/{x}', {
	//maxZoom: 19,
	attribution: 'Sources: Esri, Airbus DS, USGS, NGA, NASA, CGIAR, N Robinson, NCEAS, NLS, OS, NMA, Geodatastyrelsen, Rijkswaterstaat, GSA, Geoland, FEMA, Intermap, and the GIS user community',
});

var overlays = L.layerGroup();
var base = L.layerGroup();
base.addLayer(hillshade, 'hillshade');
base.addLayer(satellite, 'satellite');

layerControl = L.control.layers().addTo(map);

layerControl.addBaseLayer(hillshade, "hillshade");
layerControl.addBaseLayer(satellite, "satellite");

// Zoom bar
var zoom_bar = new L.Control.ZoomBar({
	position: 'topleft'
}).addTo(map);

// mouse position
L.control.mousePosition({
	position: 'bottomleft',
	prefix: "lat : long",
}).addTo(map);

//scale
L.control.scale({
	position: 'bottomleft'
}).addTo(map);

//geocoder
L.Control.geocoder({
	position: 'topright'
}).addTo(map);

// Initialising POI and utilities variables
var i=3;
var marker, popup, poi;
var initial_message = L.popup()
							.setLatLng([23.00, 82.00])
							.setContent('Hello World<button onclick="onClick2()">Onek hoyeche, ebar start!!</button>')
							.openOn(map);

initial_message.addTo(map);

// create popup contents
var customPopup = '<button id="dest" onclick = "del_route()"><img src="Utilities/airport-icon.jpg" height="20px" width="20px"></img> Airport</button>';

// specify popup options 
var customOptions =
    {
    'maxWidth': '400',
    'width': '200',
    'className' : 'popupCustom'
    }


var images = ['<img src="Utilities/1.jpg" height="200px" width="200px"/>','<img src="Utilities/2.jpg" height="200px" width="200px"/>',
	'<img src="Utilities/novcart.png" height="200px" width="200px"/>','<img src="Utilities/novfcc.png" height="200px" width="200px"/>'];
var photoImg = images[i];


marker_lat_longs = [[25.5895,91.8980], // Golf
	[25.575,91.887], // Wards
	[25.610, 91.949], // NIFT Shillong
	[26.105, 91.589], // GHY airport
	[22.6424,88.43937], // KOL airport
	[25.576, 91.883], // PB
	];

// Route list
var line = L.polyline([[26.105, 91.589],[22.6424,88.43937]]);

// Flight to Kolkta route
var frmGHY = L.icon({
	iconUrl: 'Utilities/plane_from_ghy.png',
	iconSize: [15, 25]
});
var flight_to_Kol = L.motion.polyline([[26.105, 91.589],[22.6566,88.4467]], {
			color: "red"
		}, {
			auto: true,
			duration: 11000,
			easing: L.Motion.Ease.easeInOutQuart
		}, {
			removeOnEnd: true,
			showMarker: true,
			icon: frmGHY
		});

var routes = [ShlToGhy(),flight_to_Kol];
var road;

var carIcon = L.icon({
			iconUrl: 'Utilities/car.png',
			iconSize: [15, 25]
		});



var jivaIcon = L.icon({
			iconUrl: 'Utilities/jiva.png',
			iconSize: [45, 30]
		});
var car = L.marker([0,0],{icon : carIcon});
var jiva = L.marker([25.92324,91.874],{icon : jivaIcon});

var popup = L.popup();

function add_i(){
	i=i+1;
	
	map.removeLayer(marker);
	map.removeLayer(poi);
	map.removeLayer(popup);
	onClick2();
	
}

function subtract_i(){
	i=i-1;
	
	map.removeLayer(marker);
	map.removeLayer(poi);
	map.removeLayer(popup);

	

	onClick2();
}

function onClick2(){
	poi = L.marker([marker_lat_longs[i][0],marker_lat_longs[i][1]],8);
	map.flyTo(poi.getLatLng(),17);
	
	poi.addTo(map);
	poi.on('mouseover', onClick);
}

function onClick() {
	if (i==2){
		poi.bindPopup('This is Picture' + (i+1) + '<br>'+ images[i] +
		'<br><button id="back" onclick = "subtract_i()"><span>Back</span></button>&emsp;&emsp;&emsp;&emsp;&emsp;<button id="next" onclick = "add_route()"><span>Start Journey</span></button>'
		)
		.openPopup();
	}
	else if (i==3){
		poi.bindPopup('This is Picture' + (i+1) + '<br>'+ images[i] +
		'<br><button id="back" onclick = "subtract_i()"><span>Back</span></button>&emsp;&emsp;&emsp;&emsp;&emsp;<button id="next" onclick = "add_route()"><span>Start Journey</span></button>'
		)
		.openPopup();
	}
	else{
		poi.bindPopup('This is Picture' + (i+1) + '<br>'+ images[i] +
		'<br><button id="back" onclick = "subtract_i()"><span>Back</span></button>&emsp;&emsp;&emsp;&emsp;&emsp;<button id="next" onclick = "add_i()"><span>Next</span></buton>'
		)
		.openPopup();
	}    
}

// Shillong to Guwahati route
function ShlToGhy(){

	var route = L.Routing.control({
	  waypoints: [
		L.latLng(25.610, 91.949),
		L.latLng(26.105, 91.589)
	  ],
	  show : false,
	  routeWhileDragging: true,
		fitSelectedRoutes: false
	}).on('routesfound', function (e) {
				var routes = e.routes;

				e.routes[0].coordinates.forEach(function (coord, index) {
					setTimeout(function () {
						car.setLatLng([coord.lat, coord.lng]);
						// map.panTo(car.getLatLng(),10);
						if (car.getLatLng()['lat']>25.99){
							jiva.bindPopup("Jiva Veg").openPopup().addTo(map);
						}
					}, 2 * index)
				});
		});
	return route;
}

function add_route(){
	
	if (i==2){
		map.flyTo([25.885,91.779],9.5);
		road = routes[0];
		map.removeLayer(poi);
		map.removeLayer(popup);
		car.addTo(map);
		road.addTo(map);

		marker = L.marker(L.latLng(26.105, 91.589));
		marker.bindPopup(customPopup,customOptions).on('mouseover',msover).addTo(map);
	}
	else if (i==3){
		map.flyTo([25.04,90.27],6);
		road = routes[1];
		road.addTo(map);
		map.removeLayer(poi);
		poi = L.marker(poi.getLatLng()).addTo(map);
		map.removeLayer(popup);
		marker = L.marker(L.latLng(22.6424,88.43937));
		marker.bindPopup(customPopup,customOptions).on('mouseover',msover).addTo(map);
	}
	
}

function msover(){
	marker.openPopup();
}

function del_route(){
	road.remove();
	map.removeLayer(car);
	jiva.remove();
	add_i();
}