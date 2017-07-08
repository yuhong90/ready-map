//markers 
var markerIconList = {};
var userMarker;
var defaultRecenterBtnImgUrl = {
	on: "../assets/recenter_on.png",
	off: "../assets/recenter_off.png"
};
var defaultIconOptions = {
	green: {
		iconUrl: "../assets/green_marker.png",
		zIndexOffset: 2,
		iconSize: [20, 33], // size of the icon 
		iconAnchor: [10, 33], // point of the icon which will correspond to marker's location 
		popupAnchor: [0, -26] // point from which the popup should open relative to the iconAnchor
	},
	blue: {
		iconUrl: "../assets/blue_marker.png",
		zIndexOffset: 300,
		iconSize: [20, 20], // size of the icon 
		iconAnchor: [10, 10], // point of the icon which will correspond to marker's location 
		popupAnchor: [0, -7] // point from which the popup should open relative to the iconAnchor
	}
};

//map properties
var isMapError = false;
var MAX_ZOOM = 19;
var VIEWBOUND_PAD_RATIO = 0.2;
var aryViewableBounds = [];             //for map extent
var centerPoint = new L.LatLng(1.319536, 103.842);

//map layers var
var map;
var base;	                            //map baselayer
var markerLayer = L.featureGroup();
var mapControls = {};

//setup map components
function initDefaultMarkerIcons() {
	//setup default map icons
	markerIconList.greenIcon = L.icon(defaultIconOptions.green);
	markerIconList.blueIcon = L.icon(defaultIconOptions.blue);
}

function addCustomMarkerIcon(iconName, options) {
	try {
		markerIconList[name] = L.icon(options);
	} catch (err) {
		console.log('Error init-ing and adding Custom Marker Icon')
		console.log(err);
	}
}

function setupBaseTitleLayer(mapTileUrl, mapErrorCallback) {
	////////////////////////////loading map tile//////////////////////////// 
	try {
		base = new L.TileLayer(mapTileUrl);
		base.on('tileerror', function (error, tile) {
			if (!isMapError) {
				console.log('map tile error');
				isMapError = true;
				mapErrorCallback();
			}
		});
	} catch (err) {
		mapErrorCallback(err);
	}
}

function setMapMaxBoundsWithinSG() {
	//keep map within singapore 
	map.setMaxBounds([[1.478, 104.090], [1.156, 103.607]]);
}

function setupMapObject(mapDivName, draggable, touchZoom, zoomControl, initialZoom) {
	map = new L.Map(mapDivName, {
		layers: [base, markerLayer],
		center: centerPoint,
		dragging: draggable,
		zoom: initialZoom,
		minZoom: 11,
		zoomControl: zoomControl,
		touchZoom: touchZoom,		    	//for mobile zoom
		doubleClickZoom: false,
		tap: true,				    		//remove mobile tap delay
		fullscreenControl: false,
		bounceAtZoomLimits: false
	});
	map.attributionControl.setPrefix('Leaflet');    //remove hyperlink from attribution
	setMapMaxBoundsWithinSG();
}

function updateMapExtent() {
	console.log('updateMapExtent:' + aryViewableBounds + ' items in view');
	var viewableBounds = L.latLngBounds(aryViewableBounds);
	map.fitBounds(viewableBounds.pad(VIEWBOUND_PAD_RATIO), { padding: [5, 5] });
}

function createMapView(mapDivName, mapTileUrl, isDraggable, isZoomable, hasZoomControl, initialZoomLvl, mapLoadedCallback, mapErrorCallback) {
	initDefaultMarkerIcons();
	setupBaseTitleLayer(mapTileUrl, mapErrorCallback);
	setupMapObject(mapDivName, isDraggable, isZoomable, hasZoomControl, initialZoomLvl);

	mapLoadedCallback();
}

//handle markers
function addMarker(loc, mIcon, mContent, canClick, mLayer, zIndex) {
	var newMarker = L.marker(
		loc,
		{
			icon: mIcon,
			draggable: false,
			clickable: canClick,
			title: mContent,
			zIndexOffset: zIndex,
			opacity: 0.9
		}).bindPopup(mContent);
	mLayer.addLayer(newMarker);
	return newMarker;
}

function addUserMarker(loc, content) {
	userMarker = this.addMarker(loc, markerIconList.blueIcon, content, false, markerLayer, 1);
}

function addCaseMarker(loc, content) {
	this.addMarker(loc, markerIconList.greenIcon, content, false, markerLayer, 1);
}

function addCaseMarkerWithPopup(loc, content) {
	this.addMarker(loc, markerIconList.greenIcon, content, true, markerLayer, 1);
}

function quickAddUserMarker(userLat, userLon, content) {
	var userLoc = L.latLng(userLat, userLon);
	var popupContent = (content === undefined) ? userLat + "," + userLon : content;
	addUserMarker(userLoc, popupContent);
	aryViewableBounds.push(userLoc);
	updateMapExtent();
}

function quickAddCaseMarker(caseLat, caseLon, content) {
	var caseLoc = L.latLng(caseLat, caseLon);
	var popupContent = (content === undefined) ? caseLat + "," + caseLon : content;
	centerPoint = caseLoc;
	addCaseMarker(caseLoc, popupContent);
	aryViewableBounds.push(centerPoint);
	updateMapExtent();
}

// Recenter Custom Control
function setupRecenterBtnOnMap(recenterBtnObj) {
	mapControls.recenterBtn = recenterBtnObj;
	map.addControl(recenterBtnObj.leafletControl);
	mapControls.recenterBtn.initRecenterBtnImg(map, userMarker, defaultRecenterBtnImgUrl.off, defaultRecenterBtnImgUrl.on);
}

function displayRecenterBtnOnMap() {
	if (mapControls.recenterBtn !== undefined) {
		mapControls.recenterBtn.displayRecenterBtn();
		setupPanListener();
	}
}

function setupPanListener() {
	if (recenterBtnImg != undefined) {
		map.on('dragstart', function (e) {
			if (mapControls.recenterBtn !== undefined) {
				mapControls.recenterBtn.toggleRecenterBtnOff();
			}
		});
	}
}
