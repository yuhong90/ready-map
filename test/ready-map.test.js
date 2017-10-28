let sinon = require('sinon');
let chai = require('chai');
let expect = chai.expect;

const fs = require('fs');
const { JSDOM } = require('jsdom');

let document;
let window;

describe('ready-map.test.js', function () {

	beforeEach(() => {
		document = new JSDOM(`<!DOCTYPE html><html><body><div id="map"></div></body></html>`, { runScripts: "dangerously" });
		window = document.window;

		let leaflet = fs.readFileSync('./node_modules/leaflet/dist/leaflet.js', { encoding: "utf-8" });
		const scriptEl = window.document.createElement("script");
		scriptEl.textContent = leaflet;
		window.document.body.appendChild(scriptEl);

		let map = fs.readFileSync('./src/ready-map.js', { encoding: "utf-8" });
		// Execute leaflet by inserting a <script> tag containing it.
		const scriptMapEl = window.document.createElement("script");
		scriptMapEl.textContent = map;
		window.document.body.appendChild(scriptMapEl);

		window.eval(`
		var onemapbetalink = 'http://maps-{s}.onemap.sg/v2/Default/{z}/{x}/{y}.png';
		initMap(L);

		initDefaultMarkerIcons();
		setupBaseTitleLayer(onemapbetalink);
	  `);
	});

	it('Should create map object and set boundaries properly according to options defined', () => {
		let singaporeMaxBounds = {
			_southWest: { lat: 1.156, lng: 103.607 },
			_northEast: { lat: 1.478, lng: 104.09 }
		};

		window.eval(`
		var testData = { mapDivName: 'map', isDraggable: true, isZoomable: true, hasZoomControl: true, initialZoomLvl: 13 };
		var createdMap = setupMapObject(testData.mapDivName, testData.isDraggable, testData.isZoomable, testData.hasZoomControl, testData.initialZoomLvl);
	  `);

		expect(window.createdMap.options.layers.length).to.eql(2);
		expect(window.createdMap.options.zoom).to.eql(13);
		expect(window.createdMap.options.dragging).to.eql(true);
		expect(window.createdMap.options.touchZoom).to.eql(true);
		expect(window.createdMap.options.zoomControl).to.eql(true);
		expect(window.createdMap.options.maxBounds._southWest.lat).to.equal(singaporeMaxBounds._southWest.lat);
		expect(window.createdMap.options.maxBounds._southWest.lng).to.equal(singaporeMaxBounds._southWest.lng);
		expect(window.createdMap.options.maxBounds._northEast.lat).to.equal(singaporeMaxBounds._northEast.lat);
		expect(window.createdMap.options.maxBounds._northEast.lng).to.equal(singaporeMaxBounds._northEast.lng);
	});
});

