// This file contains services for the app

angular.module('starter.services', [])

.factory('Beacons', function() {
	// Might use a resource here that returns a JSON array

	// Beacon dictionary used to store beacon objects.
	var beaconDict = {};

	// Beacon data array
	var beacons = [];

	// Ranging callback.
	var onBeaconsRangedCallback = null;

	//Monitoring callback.
	var onBeaconsMonitorCallback = null;


	function startMonitorRegion(success, error){
		console.log("startMonitoring");
		// Save reference to controller success callback.
		onBeaconsMonitorCallback = success;

		// Request permission from user to access location info.
		// This is needed on iOS 8.
		EstimoteBeacons.requestAlwaysAuthorization();

		EstimoteBeacons.startMonitoringForRegion({}, 
			onMonitor, 
			onError);

	}

	function startRangingBeacons(success, error) {
		// Save reference to controller success callback.
		onBeaconsRangedCallback = success;

		// Request permission from user to access location info.
		// This is needed on iOS 8.
		EstimoteBeacons.requestAlwaysAuthorization();

		// Start ranging Estimote beacons.
		EstimoteBeacons.startRangingBeaconsInRegion(
			{}, // Empty region matches all beacons
			    // with the Estimote factory set UUID.
			onBeaconsRanged,
			error);
	}

	function getBeaconData(beaconId, property) {
		if (window.ApplicationBeaconData
			&& window.ApplicationBeaconData[beaconId]
			&& window.ApplicationBeaconData[beaconId][property]) {
			return window.ApplicationBeaconData[beaconId][property]
		}
		else {
			return 'unknown';
		}
	}

	function getBeaconTitle(beaconId) {
		return getBeaconData(beaconId, 'title');
	}

	function getBeaconDescription(beaconId) {
		return getBeaconData(beaconId, 'description');
	}

	function getBeaconImage(beaconId) {
		return getBeaconData(beaconId, 'image');
	}

    function onMonitor(regionState)
	{

		console.log("Monitor : " + JSON.stringify(regionState));
		//console.log(regionState.major);
		//displayRegionInfo(regionState);
		onBeaconsMonitorCallback(regionState);
	}

	function onError(errorMessage)
	{
		console.log('Monitor error: ' + errorMessage);
		return errorMessage;
	}
   
	function onBeaconsRanged(beaconInfo) {
		// Update beacon dictionary.
		//console.log(JSON.stringify(beaconInfo));
		//beaconDict = {};
		//console.log(beaconInfo.beacons.length);
		for (var i in beaconInfo.beacons)
		{
			var beacon = beaconInfo.beacons[i];
			beacon.timeStamp = Date.now();
			var key = beacon.major + '_' + beacon.minor;
			//console.log(key);
			beaconDict[key] = beacon;
		}
		// Create list with beacon data.
		var items = [];
		for (var key in beaconDict) {
			if (beaconDict.hasOwnProperty(key)) {
				var beacon = beaconDict[key];
				items.push({
					id: key,
					distance: beacon.distance.toFixed(2),
					proximity: beacon.proximity,
					title: getBeaconTitle(key),
					description: getBeaconDescription(key),
					image: getBeaconImage(key)
				});
			}
		}

		// Sort list by distance.
		items.sort(function(beacon1, beacon2) {
			return beacon1.distance > beacon2.distance; });

		// Set list.
		beacons = items;

		// Call callback function.
		onBeaconsRangedCallback && onBeaconsRangedCallback(beacons);
	}

	function stopRangingBeacons() {
		onBeaconsRangedCallback = null;
		EstimoteBeacons.stopRangingBeaconsInRegion({})
	}

	function getBeaconDataById(beaconId) {
		for (var i = 0; i < beacons.length; i++) {
			if (beacons[i].id == beaconId) {
				return beacons[i];
			}
		}
		return null;
	}

	// Return object with public functions for this service
	return {
		startRangingBeacons: function(success, error) {
			startRangingBeacons(success, error);
		},
		stopRangingBeacons: function() {
			//console.log("stopRangingBeacons");
			stopRangingBeacons();
		},
		startMonitorRegion : function(success, error){
			startMonitorRegion(success, error);
		},
		get: function(beaconId) {

			return getBeaconDataById(beaconId);
		}
	}
})

; // End of angular.module
