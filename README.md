## Ready Map

Simple implementation of a map wrapper module using Leaflet. 

The aim is to bootstrap the implementing of a event-exploratory type map.

Some custom behaviours implemented in this map wrapper include: 
- Map created with 2 layers - base tiles & markers
- Using of any base tile layer url
- Default user and event markers for quick use
- Re-center button that focuses on the user marker when clicked
- Map boundaries restricted to singapore coordinates

### Run Sample 

Restore packages with `npm install`.

Run sample map page with `npm start`.

View sample map using this map wrapper @ [http://localhost:8080/sample](http://localhost:8080/sample).

### Run Tests 
Run tests with `npm test`.


### Quick Start

#### Importing Dependencies
Import depedencies and source files in html page. Project is dependent on [Leaflet v1.0.2](http://leafletjs.com/reference-1.0.2.html).

```html
<head>
	<!--import leaflet dependencies-->
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.2/dist/leaflet.css" />
	<script src="https://unpkg.com/leaflet@1.0.2/dist/leaflet.js"></script>
	
	<!--import ready map dependencies-->
	<script src="./map/user-recenter-custom-control.js"></script>
	<script src="./map/map.js"></script>
</head>
```
#### Creating Map
Create map with `createMapView(mapDivName, mapTileUrl, isDraggable, isZoomable, hasZoomControl, initialZoomLvl, mapLoadedCallback, mapErrorCallback)`.
```javascript 
<body>
	<div id="map"></div>
	<script type="text/javascript">
		var mapUrl = '<your base map tile url>';
		initMap(L);
		createMapView("map", mapUrl, true, true, true, 13, function(){
			// map loaded
			quickAddCaseMarker(1.3116, 103.779);
			quickAddUserMarker(1.311, 103.783895, 'you can add a popup to user marker');
			quickAddCaseMarker(1.306, 103.791, 'this is a event popup that you can use too');
				
			// Setup recenter button control
			setupRecenterBtnOnMap(getRecenterBtn());
			displayRecenterBtnOnMap();
		}, function(error){
			// handle map error
		});
	</script>
	...
```

### Contributing 
- [Refactor] Better modularity and structure for better usability
- [Tests] More unit tests
- [Upgrading Dependency] Update leaflet version
- [Feature] Bulk insert of markers via a json input
- [Feature] Adding of new layers at certain position
- [Feature] Add custom control to hide/show a marker layer
- [Feature] Handling marker clustering when markers are too close to each other