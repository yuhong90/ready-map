var recenterBtnImg;
var RECENTER_BTNON_SOURCE = '';
var RECENTER_BTNOFF_SOURCE = '';
var recenterOffBase64URL;
var recenterOnBase64URL;
var isRecenterBtnActive = false;
var pressedRecenterBefore = false;
var recenterBtn = {};

var recenterControl = L.Control.extend({
	initialize: function (foo, options) {
		L.Util.setOptions(this, options);
	},

	options: {
		position: 'bottomright'
	},

	onAdd: function (map) {
		// create the control container with a particular class name 
		recenterBtnImg = L.DomUtil.create('img', 'recenterbtn');
		recenterBtnImg.id = "recenter-btn";
		recenterBtnImg.style.width = "60px";
		recenterBtnImg.style.height = "60px";
		recenterBtnImg.style.opacity = "0.88";
		recenterBtnImg.style.visibility = "hidden";

		return recenterBtnImg;
	}
});

function getRecenterBtn() {
	if (recenterBtn.leafletControl === undefined) {
		recenterBtn.leafletControl = new recenterControl();
	}
	return recenterBtn
}

function setupRecenterBtn(userMarker) {
	recenterBtnImg.addEventListener("touchend", function (event) {
		handleRecenterBtnClicked(event, userMarker);
	}, false);

	recenterBtnImg.addEventListener("mouseup", function (event) {
		handleRecenterBtnClicked(event, userMarker);
	}, false);
}

function handleRecenterBtnClicked(event, userMarker) {
	event.preventDefault();
	toggleRecenterButtonImage(userMarker);
}

function initRecenterBtnImg(map, userMarker, btnOffImgSource, btnOnImgSource) {
	// Encoding RecenterBtnImg for caching 
	RECENTER_BTNOFF_SOURCE = btnOffImgSource;
	RECENTER_BTNON_SOURCE = btnOnImgSource;
	encodeBase64ForStorage(RECENTER_BTNOFF_SOURCE, RECENTER_BTNON_SOURCE, recenterOffBase64URL, recenterOnBase64URL, recenterBtnImg, function () {
		console.log('setting up recenter');
		setupRecenterBtn(userMarker);
	});
}

function displayRecenterBtn() {
	if (recenterBtnImg != undefined) {
		recenterBtnImg.style.visibility = "visible";
	}
}

function toggleRecenterButtonImage(userMarker) {
	pressedRecenterBefore = true;
	if (!isRecenterBtnActive) {
		toggleRecenterBtnOn(userMarker);
		isRecenterBtnActive = !isRecenterBtnActive;
		updateMapExtent(false);
	} else {
		toggleRecenterBtnOff();
	}
}

function toggleRecenterBtnOn(userMarker) {
	if (recenterBtnImg === undefined) {
		return;
	}

	if (recenterOnBase64URL != undefined) {
		recenterBtnImg.src = recenterOnBase64URL;
	} else {
		recenterBtnImg.src = RECENTER_BTNON_SOURCE;
	}

	aryViewableBounds = [];
	aryViewableBounds.push(userMarker.getLatLng());
}

function toggleRecenterBtnOff() {
	if (recenterBtnImg === undefined) {
		return;
	}

	if (recenterOffBase64URL != undefined) {
		recenterBtnImg.src = recenterOffBase64URL;
	} else {
		recenterBtnImg.src = RECENTER_BTNOFF_SOURCE;
	}
	isRecenterBtnActive = false;
	aryViewableBounds = [];
}

//Encode Utility Functions
function encodeBase64ForStorage(BTNON_SOURCE, BTNOFF_SOURCE, offBase64URL, onBase64URL, btnImg, callback) {

	convertToDataURLviaCanvas(BTNOFF_SOURCE, function (base64Img) {
		// encode btnOff into base64url for storage
		offBase64URL = base64Img;

		convertToDataURLviaCanvas(BTNON_SOURCE, function (base64Img) {
			// encode btnOn into base64url for storage
			onBase64URL = base64Img;
			btnImg.src = onBase64URL;
			callback();
		});
	});
}

function convertToDataURLviaCanvas(url, callback, outputFormat) {
	console.log('convertToDataURLviaCanvas: ' + url);
	var img = new Image();
	img.crossOrigin = 'anonymous';
	img.onload = function () {
		var canvas = document.createElement('CANVAS');
		var ctx = canvas.getContext('2d');
		var dataURL;
		canvas.height = this.height;
		canvas.width = this.width;
		ctx.drawImage(this, 0, 0);
		dataURL = canvas.toDataURL(outputFormat);
		callback(dataURL);
		canvas = null;
	};
	img.src = url;
}

recenterBtn.initRecenterBtnImg = initRecenterBtnImg;
recenterBtn.displayRecenterBtn = displayRecenterBtn;
recenterBtn.toggleRecenterButtonImage = toggleRecenterButtonImage;
recenterBtn.toggleRecenterBtnOn = toggleRecenterBtnOn;
recenterBtn.toggleRecenterBtnOff = toggleRecenterBtnOff;
