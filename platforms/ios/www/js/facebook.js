function createMapandUser(response){	
	navigator.geolocation.getCurrentPosition(function(position){
    	function initialize (){
	    	var mapOptions = {
	    		center    : new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
	    		zoom      : 14
	    	};
	    	map = new google.maps.Map(document.getElementById("map-canvas"),
	    	    mapOptions);

	    	var events = []
	    	for(var i=0; i < response.events.data.length; i++){events.push(response.events.data[i].name)}

			$.ajax({
    		    	type: 'GET',
    		    	url:"http://hidden-brushlands-6469.herokuapp.com/createuser",
    		    	data: {
    		    		'latitude' : position.coords.latitude, 
    		    		'longitude': position.coords.longitude,
    		    		'ID'       : response.id,
    		    		'gender'   : response.gender,
    		    		'events'   : events || ''
    		    	},
    		    	dataType: 'jsonp',
    		    	contentType: 'application/json',
    		    	crossDomain: true,
    		    	success: function(data){console.log(data)},
    		    	error: function(){console.log('there was an error')}
    		    });	    	
		};

    	initialize();
    	var center = map.getCenter();
   	    google.maps.event.trigger(map, "resize");
   	    map.setCenter(center);
        heatmap = new google.maps.visualization.HeatmapLayer()
        map.setMap(map)
	},function(error){console.log(error)});	
}

function updateMapandUser(response){
	navigator.geolocation.getCurrentPosition(function(position){
    	function initialize (){
	    	var mapOptions = {
	    		center    : new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
	    		zoom      : 14
	    	};
	    	map = new google.maps.Map(document.getElementById("map-canvas"),
	    	    mapOptions)

	    	var events = []
	    	for(var i=0; i < response.events.data.length; i++){events.push(response.events.data[i].name)}

			$.ajax({
    		    	type: 'GET',
    		    	url:"http://hidden-brushlands-6469.herokuapp.com/updateuser",
    		    	data: {
    		    		'latitude' : position.coords.latitude, 
    		    		'longitude': position.coords.longitude,
    		    		'ID'       : response.id,
    		    		'events'   : events || ''
    		    	},
    		    	dataType: 'jsonp',
    		    	contentType: 'application/json',
    		    	crossDomain: true,
    		    	success: function(data){
    		    		console.log(data)
    		    		if(data.single === true){
    		    			$('#single').attr('checked' , true).checkboxradio('refresh')
    		    		} else {
    		    			$('#couple').attr('checked' , true).checkboxradio('refresh')
    		    		}

    		    		if(data.gender === 'male' || data.genderPrefOpposite === true){
    		    			$('#female').attr('checked' , true).checkboxradio('refresh')
    		    		} else if (data.gender === 'male' || data.genderPrefOpposite === false){
    		    			$('#male').attr('checked' , true).checkboxradio('refresh')
    		    		} else if (data.gender === 'female' || data.genderPrefOpposite === true){
    		    			$('#male').attr('checked' , true).checkboxradio('refresh')
    		    		} else if (data.gender === 'female' || data.genderPrefOpposite === false){
    		    			$('#female').attr('checked' , true).checkboxradio('refresh')
    		    		}
    		    	},
    		    	error: function(){console.log('error')}
    		    })	    	
		};

    	initialize();
    	var center = map.getCenter();
   	    google.maps.event.trigger(map, "resize");
   	    map.setCenter(center);
        heatmap = new google.maps.visualization.HeatmapLayer()
        map.setMap(map)
	},function(error){console.log(error)});	
}

function startLoad(){
	facebookConnectPlugin.getLoginStatus(
		function(response){
			console.log(response)
			if(response.status === 'connected'){
		    	$.mobile.pageContainer.pagecontainer('change' , '#homepage' , {transition:'none'});
		    	facebookConnectPlugin.api('/me?fields=events',[],
		    		function(response){
		    			console.log(response)
		    			updateMapandUser(response)
		    			var events = []
	    	            for(var i=0; i < response.events.data.length; i++){events.push(response.events.data[i].name)}
    	            	if(events.length > 0){
    	            		$('#facebookEvents input').remove();
    	            		var initialEvent = '<input type="radio" id="noEvents" name="radio-choice-4" checked="checked"/>'+'<label for="noEvents">' + 'NO EVENTS' + '</label>';
    	            		var eventRadios = ''
    	            		for(var i = 0 ; i <events.length ; i++){
    	            			eventRadios += '<input type="radio" name="radio-choice-4" id="' + events[i] + '"/>' + '<label for="' + events[i] + '">' + events[i] + '</label>';
    	            		}
    	            		$('#facebookEvents').append(initialEvent).enhanceWithin();
    	            		$('#facebookEvents').append(eventRadios).enhanceWithin();
    	            	}
		    		},
		    		function(error){console.log(error)})
			} else {
				$.mobile.pageContainer.pagecontainer('change' , '#login');
			}
		},
		function(failure){console.log(failure)}
	);
}

function FBlogin(){
	facebookConnectPlugin.login(['user_events'],
		function(response){
			console.log(response)
			if(response.status === 'connected'){
				$.mobile.pageContainer.pagecontainer('change' , '#homepage' , {transition:'none'});
				facebookConnectPlugin.api('/me?fields=events,gender',[],
					function(response){
						console.log(response)
    		    		$('#single').attr('checked' , true).checkboxradio('refresh')
    		    		if(response.gender === 'male'){
    		    			$('#female').attr('checked' , true).checkboxradio('refresh')
    		    		} else if(response.gender === 'female'){
    		    			$('#male').attr('checked' , true).checkboxradio('refresh')
    		    		}
						createMapandUser(response)
		    			var events = []
	    	            for(var i=0; i < response.events.data.length; i++){events.push(response.events.data[i].name)}
    	            	if(events.length > 0){
    	            		$('#facebookEvents input').remove();
    	            		var initialEvent = '<input type="radio" id="noEvents" name="radio-choice-4" checked="checked"/>'+'<label for="noEvents">' + 'NO EVENTS' + '</label>';
    	            		var eventRadios = ''
    	            		for(var i = 0 ; i <events.length ; i++){
    	            			eventRadios += '<input class="facebookEvents" type="radio" name="radio-choice-4" id="' + events[i] + '"/>' + '<label for="' + events[i] + '">' + events[i] + '</label>';
    	            		}
    	            		$('#facebookEvents').append(initialEvent).enhanceWithin();
    	            		$('#facebookEvents').append(eventRadios).enhanceWithin();
    	            	}
					},
					function(error){console.log(error)})
			} else {
				$.mobile.pageContainer.pagecontainer('change' , '#login')
			}
		},
		function(error){console.log(error)})
}

function getStatus(){
	facebookConnectPlugin.getLoginStatus(function(response){
		if(response.status === 'connected'){
			console.log(response)
			startLoad()
		} else {
			$.mobile.pageContainer.pagecontainer('change' , '#login')
		}
	}, function(error){console.log(error)})
}

function relationshipChange(){
	facebookConnectPlugin.api('/me',[],
		function(response){
			console.log(response)
			var single
			if($('#single').is(':checked')){single = true}else{single = false}
			console.log(single)
			$.ajax({
    		    	type: 'GET',
    		    	url:"http://hidden-brushlands-6469.herokuapp.com/updaterelationship",
    		    	data: {
    		    		'ID'      : response.id,
    		    		'status'  : single
    		    	},
    		    	dataType: 'jsonp',
    		    	contentType: 'application/json',
    		    	crossDomain: true,
    		    	success: function(data){console.log(data)},
    		    	error: function(){console.log('there was an error')}
    		    });	 
		},
		function(error){console.log(error)})
}

function preferenceChange(){
	facebookConnectPlugin.api('/me',[],
		function(response){
			console.log(response)
			var preferenceOpposite
			if(response.gender == 'male'){
				if($('#male').is(':checked')){preferenceOpposite = false} else {preferenceOpposite = true}
			} else if (response.gender == 'female'){
				if($('#female').is(':checked')){preferenceOpposite = false} else {preferenceOpposite = true}
			}
			console.log(preferenceOpposite)
			$.ajax({
    		    	type: 'GET',
    		    	url:"http://hidden-brushlands-6469.herokuapp.com/updatepreference",
    		    	data: {
    		    		'ID'                  : response.id,
    		    		'preferenceOpposite'  : preferenceOpposite
    		    	},
    		    	dataType: 'jsonp',
    		    	contentType: 'application/json',
    		    	crossDomain: true,
    		    	success: function(data){console.log(data)},
    		    	error: function(){console.log('there was an error')}
    		    });	 
		},
		function(error){console.log(error)})
}

function readAll(){
			$.ajax({
    		    	type: 'GET',
    		    	url:"http://hidden-brushlands-6469.herokuapp.com/readall",
    		    	data: {'readAll':'readall'},
    		    	dataType: 'jsonp',
    		    	contentType: 'application/json',
    		    	crossDomain: true,
    		    	success: function(data){
    		    		console.log(data)
    		    		var latitude     = []
    		    		var longitude    = []
    		    		var locationData = []
    		    		for(var i=0; i < data.length; i++){
    		    			latitude.push(data[i].latitude)
    		    			longitude.push(data[i].longitude)
    		    		}
    		    		for(var i=0; i < latitude.length; i++){locationData.push(new google.maps.LatLng(latitude[i],longitude[i]))}

    		    		heatmap = new google.maps.visualization.HeatmapLayer({data: locationData});
    		    		heatmap.setMap(map);
    		    	},
    		    	error: function(){console.log('there was an error')}
    		    });		
}

function readSingles(){
	facebookConnectPlugin.api('/me',[],
		function(response){
			var preferenceOpposite
			if(response.gender == 'male'){
				if($('#male').is(':checked')){preferenceOpposite = false} else {preferenceOpposite = true}
			} else if (response.gender == 'female'){
				if($('#female').is(':checked')){preferenceOpposite = false} else {preferenceOpposite = true}
			}
			$.ajax({
    		    	type: 'GET',
    		    	url:"http://hidden-brushlands-6469.herokuapp.com/readsingles",
    		    	data: {'gender':response.gender,'preferenceOpposite':preferenceOpposite},
    		    	dataType: 'jsonp',
    		    	contentType: 'application/json',
    		    	crossDomain: true,
    		    	success: function(data){
    		    		console.log(data)
    		    		var latitude     = []
    		    		var longitude    = []
    		    		var locationData = []
    		    		for(var i=0; i < data.length; i++){
    		    			latitude.push(data[i].latitude)
    		    			longitude.push(data[i].longitude)
    		    		}
    		    		for(var i=0; i < latitude.length; i++){locationData.push(new google.maps.LatLng(latitude[i],longitude[i]))}

    		    		heatmap = new google.maps.visualization.HeatmapLayer({data: locationData});
    		    		heatmap.setMap(map);
    		    	},
    		    	error: function(){console.log('there was an error')}
    		    });		
		},
		function(error){console.log(error)})
}

function readCouples(){
	facebookConnectPlugin.api('/me',[],
		function(response){
			var preferenceOpposite
			if(response.gender == 'male'){
				if($('#male').is(':checked')){preferenceOpposite = false} else {preferenceOpposite = true}
			} else if (response.gender == 'female'){
				if($('#female').is(':checked')){preferenceOpposite = false} else {preferenceOpposite = true}
			}
			$.ajax({
    		    	type: 'GET',
    		    	url:"http://hidden-brushlands-6469.herokuapp.com/readcouples",
    		    	data: {'gender':response.gender,'preferenceOpposite':preferenceOpposite},
    		    	dataType: 'jsonp',
    		    	contentType: 'application/json',
    		    	crossDomain: true,
    		    	success: function(data){
    		    		console.log(data)
    		    		var latitude     = []
    		    		var longitude    = []
    		    		var locationData = []
    		    		for(var i=0; i < data.length; i++){
    		    			latitude.push(data[i].latitude)
    		    			longitude.push(data[i].longitude)
    		    		}
    		    		for(var i=0; i < latitude.length; i++){locationData.push(new google.maps.LatLng(latitude[i],longitude[i]))}

    		    		heatmap = new google.maps.visualization.HeatmapLayer({data: locationData});
    		    		heatmap.setMap(map);
    		    	},
    		    	error: function(){console.log('there was an error')}
    		    });		
		},
		function(error){console.log(error)})
}

function readEvents(){
    var events 
    events = $('input[name=radio-choice-4]:checked').attr('id')
    console.log(events)
            $.ajax({
                    type: 'GET',
                    url:"http://hidden-brushlands-6469.herokuapp.com/readevents",
                    data: {'events':events},
                    dataType: 'jsonp',
                    contentType: 'application/json',
                    crossDomain: true,
                    success: function(data){
                        console.log(data)
                        var latitude     = []
                        var longitude    = []
                        var locationData = []
                        for(var i=0; i < data.length; i++){
                            latitude.push(data[i].latitude)
                            longitude.push(data[i].longitude)
                        }
                        for(var i=0; i < latitude.length; i++){locationData.push(new google.maps.LatLng(latitude[i],longitude[i]))}

                        heatmap = new google.maps.visualization.HeatmapLayer({data: locationData});
                        heatmap.setMap(map);
                    },
                    error: function(){console.log('there was an error')}
                });
}

function clearMap(callback){
    heatmap.setMap(null)
    callback()
}


$(document).on('ready' , function(){
	var map,heatmap;

	$('#login-with-facebook').on('click' , function(){FBlogin()});
	$('.relationshipButton').bind('change' , function(){relationshipChange()});
	$('.preferenceButton').bind('change' , function(){preferenceChange()});

	$('#viewAllBtn').on('click' , function(){clearMap(readAll)});

	$('#singlesBtn').on('click' , function(){clearMap(readSingles)});
	$('#couplesBtn').on('click' , function(){clearMap(readCouples)});

	$('#facebookEvents').bind('change' , function(){clearMap(readEvents)});

	document.addEventListener("deviceready" , getStatus, false);
	document.addEventListener("resume", startLoad, false);

})