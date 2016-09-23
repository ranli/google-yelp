var url = 'https://api.yelp.com/oauth2/token';
var data = {
	"grant_type": 'client_credentials',
	"client_id": '8GoXswdouIGvjq2J-y1zOA',
	"client_secret": '5e3LQUDl08HjfLhDB0RhIrjTkYXkMMrNkQ7W4H0dKzT6L8SXmC7HtEhkntQO4GSF'
};


$.ajax({
	type:'POST',
	url: url,
	data: data,
	beforeSend: function(req){
		req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	},
	async: true,
    success: function (data) {
        console.log(JSON.stringify(data));
    },
    error: function (xhr, textStatus, errorMessage) {
        
    }               
});
var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
        var location = [{title: 'asdsad', position:{lat: -34.397, lng: 150.644}},
        				{title: 'qweeee', position:{lat: -35.397, lng: 150.644}},
        				{title: 'dasdasd', position:{lat: -32.397, lng: 150.644}},
        				{title: 'mghjjad', position:{lat: -33.397, lng: 150.644}}];
    	var markers = [];
    	var largeInfowindow = new google.maps.InfoWindow();
    	var bounds = new google.maps.LatLngBounds();
    	for (var i = 0; i < location.length; i++) {
    		var marker = new google.maps.Marker({
        	position: location[i].position,
        	map:map,
        	title: location[i].title,
        	animation: google.maps.Animation.DROP,
        });

    		markers.push(marker);
    		bounds.extend(marker.position);
    		marker.addListener('click',function(){
    			populateinfowindow(this, largeInfowindow)
    		});
    	}
    	map.fitBounds(bounds);
        
       
        function populateinfowindow(marker, infowindow){
        	if(infowindow.marker != marker){
        		infowindow.marker = marker;
        	}
        	infowindow.setContent('<div>' + marker.title + '</div>');
        	infowindow.open(map,marker);
        	infowindow.addListener('closeclick',function(){
        		infowindow.setMarker(null);
        	})

        }
        
      }
