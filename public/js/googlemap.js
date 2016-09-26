function Business(id,data) {
	this.id = id;
	this.idView = id + '. ';
    this.title = ko.observable(data.name);
    this.rating = ko.observable("star-img stars_" + data.rating.toString().replace(/\.5/g, "_half"));
    this.price = ko.observable(data.price + ' . ');
    this.url = ko.observable(data.url);
    this.image_url = ko.observable(data.image_url);
    this.category = ko.observable(data.categories[0].title);
    this.address = ko.observable(data.location.address1);
    this.city = ko.observable(data.location.city+', '+data.location.state+' '+data.location.zip_code);
    this.phone = ko.observable(data.phone);
    this.lat = ko.observable(data.coordinates.latitude);
    this.lng = ko.observable(data.coordinates.longitude);
}

function MapViewModel() {
    // Data
    var self = this;
    self.searchTerm = ko.observable();
    self.searchAddress = ko.observable();
    self.businessList = ko.observableArray();
    var map;
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 10
    });
    var largeInfowindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();
	self.markers = ko.observableArray();


	// convert address to zipcode
    function codeAddress(zipcode) {
    	var geocoder = new google.maps.Geocoder();
	    geocoder.geocode( { 'address': zipcode}, function(results, status) {
		    if (status == google.maps.GeocoderStatus.OK) {
		        //Got result, center the map and put it out there
		        map.setCenter(results[0].geometry.location);
		    } else {
		        console.log("Geocode was not successful for the following reason: " + status);
		    }
	    });
  	}


  	//get current location
    if (navigator.geolocation){
    	navigator.geolocation.getCurrentPosition(function(pos){
    			var lat = pos.coords.latitude;
    			var lng = pos.coords.longitude;
    			var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=true';
    			$.get(url,function(res){
    				var address = res.results[0]["address_components"];
    				self.searchAddress(address[address.length-1]["long_name"]);
    				codeAddress(address[address.length-1]["long_name"]);
    			});
    	});   	
    }else{
    	$.getJSON('http://ipinfo.io', function(data){
            self.searchAddress(data.postal);
            codeAddress(data.postal);
    	});
    }
   	

    // get yelp data
	self.getYelp = function(){
		var term = this.searchTerm(),
			location = this.searchAddress(),
			url = "/yelp?term="+ term.replace(/\s/g,"") + "&location=" + location;
		
		$.get(url, function(allData){
			self.businessList([]);
			clearMarker();
			var res = JSON.parse(allData).businesses;
			for (var i = 0; i < res.length; i++) {
				self.businessList.push(new Business(i+1, res[i]));
				addMapMark(res[i]);
			}
			map.fitBounds(bounds);
    	});   	
	};



	//click list to open infowindow event
	self.clickedListToMarker = function(clickedList){
		var marker = self.markers()[clickedList.id-1];
		var infowindow = largeInfowindow;
		populateinfowindow(marker, infowindow, clickedList, 0);
    	
	}


	//clear markers
	function clearMarker() {
	    self.markers().forEach(function (marker) {
	      marker.setMap(null);
	    });
	    self.markers([]);
 	}


 	//add markers
	function addMapMark(res){
		var position = new google.maps.LatLng(res.coordinates.latitude,res.coordinates.longitude);
		var iconIamge = {
			url: '/lib/images/yelp_star.png',
			size: new google.maps.Size(24,32)
		};

		var marker = new google.maps.Marker({
			position: position,
			map: map,
			icon: iconIamge,
			animation: google.maps.Animation.DROP,
		});
		self.markers.push(marker);
		bounds.extend(marker.position);
		marker.addListener('click',function(){
			populateinfowindow(this, largeInfowindow, res, 1);
		});
	}


	//set indowindows
	function populateinfowindow(marker, infowindow, res, flag){
    	if(infowindow.marker != marker){
    		infowindow.marker = marker;
    	}
    	map.panTo(marker.position);
        map.setZoom(14);
    	infowindow.setContent(infoWindowTemplate(res,flag));
    	infowindow.open(map,marker);
    	infowindow.addListener('closeclick',function(){
    		infowindow.setMarker(null);
    	});

    }


    //build infowindow templates
	function infoWindowTemplate(data,flag){
		var businessName,
			businessImage,
			businessUrl,
			businessRating,
			businessAddress,
			businessCity;

		if(flag === 1){
			businessName = data.name,
			businessImage = data.image_url,
			businessUrl = data.url,
			businessRating = "star-img stars_" + data.rating.toString().replace(/\.5/g, "_half");
			businessAddress = data.location.address1;
			businessCity = data.location.city+', '+data.location.state+' '+data.location.zip_code;
		}else{
			businessName = data.title(),
			businessImage = data.image_url(),
			businessUrl = data.url(),
			businessRating = data.rating();
			businessAddress = data.address();
			businessCity = data.city();
		}

		var img = "<div class='infowindow'><div class='image'><a href='"+ businessUrl + "'><img style='width:100px; height:100px;' src='" + businessImage + "'></a></div>",
			title = "<div class='text'><h4><a href='"+ businessUrl +"'>" + businessName + "</a></h4>",
			rating = "<div class='rating-very-large'> <i class='"+businessRating+"'></i></div>",
			address = "<p>"+ businessAddress + "<br>" + businessCity +"</p></div></div>";
		return img + title + rating + address;
	}
	

}

ko.applyBindings(new MapViewModel());


