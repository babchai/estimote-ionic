// This file contains controllers for the pages/tabs of the app

angular.module('starter.controllers', [])

// Controller for info page has no functionality
.controller('InfoCtrl', function($scope) {})

.controller('TrackerCtrl', function($scope, $rootScope, $ionicModal, $state ,$cordovaMedia, Beacons,$ionicLoading){

     	//navigator.notification.vibrate(1000);

   $scope.play = function(src) {
     	//navigator.notification.vibrate(1000);

        
        //var media = new Media(src, null, null);
        //$cordovaMedia.play(media);

    }

    $scope.stopplay = function()
    {

    	//$cordovaMedia.stop();
    }
 
    var mediaStatusCallback = function(status) {
        if(status == 1) {
            $ionicLoading.show({template: 'Loading...'});
        } else {
            $ionicLoading.hide();
        }
    }
 

	$scope.alertMark = [];
	function startRanging() {
		Beacons.stopRangingBeacons();
		Beacons.startRangingBeacons(beaconsRanged, rangingError);
	}

   function stopRanging(){
   		Beacons.stopRangingBeacons();
   }

	function startMonitorRegion(){
		Beacons.startMonitorRegion(onMonitor, monitorError);
	}

	function onMonitor(regionState){
		console.log(JSON.stringify(regionState));
		if(regionState.state =="inside")
		{
			console.log("customer into mall.");
            startRanging();
		}
		else
		{
			console.log("customer leave mall.");
			stopRanging();
		}

	}

	function monitorError(error){

		console.log(error);
	}

	function beaconsRanged(beacons) {
	
       for(key in beacons)
       {
       	
       	  if((beacons[key].id == "18774_17060" && beacons[key].proximity == 1))
       	  {
       	  	console.log("green zone");
       	  	$scope.warning=false;
       	  	$scope.stopplay();

       	  	
       	  }
       	  else if((beacons[key].id == "18774_17060" &&  beacons[key].proximity != 1))
       	  {
       	  	console.log("hot zone");
       	  	$scope.warning=true;
       	  	//$scope.play("http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3");
       	  }

       }

		$scope.$apply(function() {
            //$scope.beacons = {};   
			$scope.beacons = beacons;
		});

		// Update detail view.
		$rootScope.theDetailScopeUpdateFun && $rootScope.theDetailScopeUpdateFun();
	}

	function rangingError(error) {
		console.log('rangingError ' + error)
	}

	// Use 'deviceready' event to make sure plugins have loaded
	// before starting ranging for beacons.
	document.addEventListener('deviceready', startMonitorRegion, false);
})

// Controller for page with list of beacons
.controller('BeaconsCtrl', function($scope, $rootScope, $ionicModal, $state, Beacons) {


   
   $scope.alertMark = [];
	function startRanging() {
		Beacons.stopRangingBeacons();
		Beacons.startRangingBeacons(beaconsRanged, rangingError);
	}

   function stopRanging(){
   		Beacons.stopRangingBeacons();
   }

	function startMonitorRegion(){
		Beacons.startMonitorRegion(onMonitor, monitorError);
	}

	function onMonitor(regionState){
		console.log(JSON.stringify(regionState));
		if(regionState.state =="inside")
		{
			console.log("customer into mall.");
            startRanging();
		}
		else
		{
			console.log("customer leave mall.");
			stopRanging();
		}

	}

	function monitorError(error){

		console.log(error);
	}

	function beaconsRanged(beacons) {
	
       for(key in beacons)
       {
       	
       	  if((beacons[key].id == "18774_17060" && beacons[key].proximity == 1))
       	  {
       	  	if($scope.alertMark.indexOf(beacons[key].id) < 0)
       	  	{
       	  		console.log("wall by gate")
       	  		$scope.alertMark.push(beacons[key].id);
       	  		alert("Welcome to HoboWorksop");
       	  	}
       	  }
       	  else if((beacons[key].id == "18774_17060" &&  beacons[key].proximity != 1))
       	  {

	       	  	var index = $scope.alertMark.indexOf(beacons[key].id);

				if(index!=-1){
				   console.log("wall away from gate")
				   $scope.alertMark.splice(index, 1);
				}
       	  }

       	  if(beacons[key].id == "20718_65430" &&  beacons[key].proximity == 1)
       	  {

       	  	if($scope.alertMark.indexOf(beacons[key].id) < 0)
       	  	{
       	  	  console.log("near a item");
       	  	  $scope.alertMark.push(beacons[key].id);
       	  	  alert(beacons[key].title.line1 + " "+ beacons[key].title.line2);
       	  	 // $state.go('#/tab/beacon-detail/'+beacons[key].id);

       	  	}
       	  }
       	  else if((beacons[key].id == "20718_65430" &&  beacons[key].proximity != 1))
       	  {

	       	  	var index = $scope.alertMark.indexOf(beacons[key].id);

				if(index!=-1){
				   console.log("walk away from item");
				   $scope.alertMark.splice(index, 1);
				   $scope.$apply();
				}
       	  }


       	  if(beacons[key].id == "25314_34247" && beacons[key].proximity == 1)
       	  {
       	  	if($scope.alertMark.indexOf(beacons[key].id) < 0)
       	  	{
       	  	   console.log("approaching payment counter");	
       	      $scope.alertMark.push(beacons[key].id);
       	  	  alert("Make payment");
       	  	}
       	  }
       	  else if((beacons[key].id == "25314_34247" &&  beacons[key].proximity != 1))
       	  {

	       	  	var index = $scope.alertMark.indexOf(beacons[key].id);

				if(index!=-1){
					console.log("leaving payment counter");
				   $scope.alertMark.splice(index, 1);
				}
       	  }

       }

		$scope.$apply(function() {
            //$scope.beacons = {};   
			$scope.beacons = beacons;
		});

		// Update detail view.
		$rootScope.theDetailScopeUpdateFun && $rootScope.theDetailScopeUpdateFun();
	}

	function rangingError(error) {
		console.log('rangingError ' + error)
	}

	// Use 'deviceready' event to make sure plugins have loaded
	// before starting ranging for beacons.
	document.addEventListener('deviceready', startMonitorRegion, false);
})

// Controller for beacon info page
.controller('BeaconDetailCtrl', function($scope, $rootScope, $stateParams, Beacons) {
	function update() {
		$scope.beacon = Beacons.get($stateParams.beaconId);
	}

	$scope.$on('$ionicView.afterEnter', function() {
		// Called when beacons are ranged.
		$rootScope.theDetailScopeUpdateFun = function() {
			$scope.$apply(update);
		};
		// Initial update.
		update();
	});

	$scope.$on('$ionicView.beforeLeave', function() {
		$rootScope.theDetailScopeUpdateFun = null;
	});

})

; // End of angular.module
