
var MAP;

// ELIU = Extremely Low Income Units
var urlELIU = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
var numberELIU = [];

// Neighborhood names
var urlNbhoodNames = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
var nbhoodNames = [];

// Crimes in NY
var urlCrimes = "https://data.cityofnewyork.us/api/views/qgea-i56i/rows.json?accessType=DOWNLOAD";
var crimes = [];

//Polygons neighborhoods
var urlPolygons = "https://data.cityofnewyork.us/api/views/q2z5-ai38/rows.json?accessType=DOWNLOAD";
var ngb = [];

var moreSecure = [];

var locationsMoreSecure = [];

// Function charge the map
function initMap() {
    MAP = new google.maps.Map(document.getElementById('map'), {
		zoom: 11,
	});

	var contentString = '<div id="content">' + '<h1 style="font-size: 20px; color: #027E94">NYU Stern School</h1>' +
        '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 200
    });

    MAP.data.loadGeoJson('http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson');
    
    var colors = ['red', 'blue', 'orange', 'white', 'purple'];

    MAP.data.setStyle(function(feature) {
	    var col = feature.getProperty('BoroCD');
	    
	    if (col > 100 && col < 200) {
	      color = colors[0];
	    }
	    else if (col > 200 && col < 300) {
	    	color = colors[1];
	    }
	    else if (col > 300 && col < 400) {
	    	color = colors[2];
	    }
	    else if (col > 400 && col < 500) {
	    	color = colors[3];
	    }
	    else {
	    	color = colors[4];
	    }
	    
	    return {
		    fillColor: color,
		    strokeWeight: 1
	    }
  	});

  	// var poly = MAP.data.getGeometry();

  	//  cityCircle = new google.maps.Circle ({
   //    strokeColor: '#FF0000',
   //    strokeOpacity: 0.8,
   //    strokeWeight: 2,
   //    fillColor: '#FF0000',
   //    fillOpacity: 0.35,
   //    map: MAP,
   //    center: {lat: 40.673949883, lng: -73.811122224},
   //    radius: 1000
   //  });

 //    var bounds = new google.maps.LatLngBounds (
	//     new google.maps.LatLng(40.6649667301588, -73.82296661846033),
	//     new google.maps.LatLng(40.682933035841195, -73.79927782953962)
	// );

	// var center = bounds.getCenter();  // still returns (55.04334815163844, -1.9917653831249726)

	// var x = bounds.contains({lat: 40.673949883, lng: -73.811122224});  // now returns true
  	
  	// console.log(cityCircle.getBounds());


	// Color each letter gray. Change the color when the isColorful property
	// is set to true.
	// MAP.data.setStyle(function(feature) {
	//   var color = 'green';
	//   if (feature.getProperty('isColorful')) {
	//     color = feature.getProperty('color');
	//   }
	//   return /** @type {google.MAPs.Data.StyleOptions} */({
	//     fillColor: color,
	//     strokeColor: color,
	//     strokeWeight: 1
	//   });
	// });

	// // When the user clicks, set 'isColorful', changing the color of the letters.
	// MAP.data.addListener('click', function(event) {
	//   event.feature.setProperty('isColorful', true);
	// });

	// // When the user hovers, tempt them to click by outlining the letters.
	// // Call revertStyle() to remove all overrides. This will use the style rules
	// // defined in the function passed to setStyle()
	// MAP.data.addListener('mouseover', function(event) {
	//   MAP.data.revertStyle();
	//   MAP.data.overrideStyle(event.feature, {strokeWeight: 6});
	// });

	// MAP.data.addListener('mouseout', function(event) {
	//   MAP.data.revertStyle();
	// });

	var adrss = "NYU Stern School of Business";
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address' : adrss}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			MAP.setCenter({lat: 40.730610, lng: -73.935242});
			var marker = new google.maps.Marker({
	          position: results[0].geometry.location,
	          map: MAP
	        });
	        marker.addListener('click', function() {
          	infowindow.open(map, marker);
        });
		}
	});
}

// function for change color navbar
function chgColorNavbar() {
	$(window).scroll(function() {
	    	if ($("#bar").offset().top > 631) {
	            $("#bar").addClass("bg-white");
	        }
	        else {
	            $("#bar").removeClass("bg-white");
	        }
	    });
}

// function that asks for the data ELIU
function getELIU(url) {
	var dt = $.get(url, function(){})

		.done(function() {
			var dts = dt.responseJSON.data;
			for (var i = 0; i < dts.length; i++) {
				numberELIU.push([dts[i][15], dts[i][23], dts[i][24], dts[i][31]]);
				numberELIU.sort();
			}
		});
}

// function that asks for the data Neighborhood Names 
function getNbhoodNames(url) {
	var dt = $.get(url, function(){})

		.done(function() {
			var dts = dt.responseJSON.data;
			for (var i = 0; i < dts.length; i++) {
				nbhoodNames.push([dts[i][10], dts[i][9], dts[i][16]]);
			}
		});
}

function getPolygons(url) {
	var dt = $.get(url, function(){})

		.done(function() {
			var dts = dt.responseJSON.data;
			for (var i = 0; i < dts.length; i++) {
				for (var j = 0; j < nbhoodNames.length; j++) {
					if (dts[i][13] === nbhoodNames[j][0]) {
						ngb.push([nbhoodNames[j][0], nbhoodNames[j][1], nbhoodNames[j][2], dts[i][9]]);
					}	
				}
			}
		});
}

// function that asks for the data Crimes in NY 
function getCrimes() {
	$.ajax({
	    url: "https://data.cityofnewyork.us/resource/9s4h-37hy.json?$select=boro_nm,addr_pct_cd,cmplnt_fr_dt,ofns_desc,lat_lon&$where=within_circle(lat_lon, 40.730610, -73.935242, 100000)&cmplnt_fr_dt=2015-12-31",
	    type: "GET",
	    data: {
	      "$limit" : 5000,
	    }
	})
		.done(function(data) {
			var latlng;
			for(i = 0; i < data.length; i++) {
				latlng = new google.maps.LatLng(data[i].lat_lon.coordinates[1], data[i].lat_lon.coordinates[0]);
				crimes.push([data[i].boro_nm, data[i].addr_pct_cd, data[i].cmplnt_fr_dt, latlng.toJSON(), data[i].ofns_desc]);
				// crimes.push([data[i].addr_pct_cd]);
			}
			crimes.sort(); 

			var indices = new Array(124); 
			indices.fill(0);

			for (var i = 1; i <= indices.length; i++) {
		        for (var j = 0; j < crimes.length; j++) {
			        if (i == crimes[j][1]) {
			      	    indices[i] = indices[i] + 1;
			    	} 
			  	} 
			}
			
			var arr = [];
			for (var i = 0; i < indices.length; i++) {
				if (indices[i] != 0 && indices[i] < 7 && indices[i] > 1) {
				   arr.push(i);
				}
			}
			for (var i = 0; i < arr.length; i++) {
				for (var j = 0; j < crimes.length; j++) {
					if (arr[i] == crimes[j][1]) {
						moreSecure.push([crimes[j][0], crimes[j][1], crimes[j][3], crimes[j][4]]);
					}
				}
			}		

			for (var i = 0; i < moreSecure.length; i++) {
				locationsMoreSecure.push(moreSecure[i][2]);
			}

			 var markers = locationsMoreSecure.map(function(location, i) {
		         return new google.maps.Marker({
		            position: location,
		            map: MAP,
		        });
		    });
		});	
}

function updateTable() {
	var tableReference = $("#mainTableBody")[0];
	var newRow, borough, precinct, crime, location;

	for(var i = 0; i < moreSecure.length; i++) {
		latlng = [crimes[i][3].lat, crimes[i][3].lng];
		console.log(latlng);
		newRow = tableReference.insertRow(tableReference.rows.length);
		borough = newRow.insertCell(0);
		precinct = newRow.insertCell(1);
		location = newRow.insertCell(2)
		crime = newRow.insertCell(3);

		borough.innerHTML = moreSecure[i][0]
		precinct.innerHTML = moreSecure[i][1];
		location.innerHTML = latlng;
		crime.innerHTML = moreSecure[i][3];
	}
} 

// console.log(numberELIU);
// console.log(nbhoodNames);
// console.log(crimes);
// console.log(ngb);
// console.log(moreSecure);

$(document).ready(function() {
	// getELIU(urlELIU);
	getNbhoodNames(urlNbhoodNames);
	getPolygons(urlPolygons);
	getCrimes();
	$(".btn").on("click", updateTable);
	chgColorNavbar();	
});

