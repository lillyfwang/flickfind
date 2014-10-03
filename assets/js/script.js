var pagination = 1;
var search_terms = {};
var flickr = new Flickr({
		api_key: "7e068b89b2a42d5f9b92841ddb7fdd02"
	});

$(document).ready(function(){
	$( "#upsince" ).datepicker();
	$( "#upuntill" ).datepicker();
	$( "#photos" ).masonry('bindResize')
});

function readForm(){
	pagination = 1;
	search_terms = {};
	search_terms["text"] = document.getElementById('search-bar').value.replace(/\s/g, '+');
	search_terms["min_upload_date"] = document.getElementById('upsince').value;
	search_terms["max_upload_date"] = document.getElementById('upuntil').value;
	search_terms["per_page"] = '10';
	if (document.getElementById('username').value.length>0) {
		getUserID(document.getElementById('username').value);
	}
	else {
		findPhotos(search_terms);
	}
}

function nextPage(){
	pagination++;
	findPhotos(search_terms);
}

function prevPage(){
	if (pagination > 1){
		pagination--;
		findPhotos(search_terms);
	}
}

function getUserID(username){
	var id = {};
	id["username"] = username;
	flickr.people.findByUsername(id, function(err, result){
		if(err){
			console.log("username error");
		} else {
			search_terms["user_id"] = result.user.nsid;
			findPhotos(search_terms);
		}
	});
}

function findByUsername(item){
	var id = {};
	id["user_id"] = item.owner;
	flickr.people.getUsername(id, function(err, result){
		if(err){
			console.log("username error");
		} else {
			displayPhotos(item);
		}
	});
}

function getUsername(item){
	var id = {};
	id["user_id"] = item.owner;
	flickr.people.getInfo(id, function(err, result){
		if(err){
			console.log("username error");
		} else {
			var username = result.person.username._content;
			displayPhotos(item, username);
		}
	});
}

function findPhotos(search_terms){
	search_terms["page"] = pagination.toString();
	$('#photos').html("");
	flickr.photos.search(search_terms, function(err, result) {
		if(err) {
			console.log("photos error");
		} else {
			var photo = result.photos.photo;
			$.each(photo, function(i,item){
				getUsername(item);
			});
		}
	});
}

function displayPhotos(item, name){
	var photoID = item.id;
	var username = name;
	var photoURL = 'http://farm'+item.farm+'.static.flickr.com/'+item.server+'/'+item.id+'_'+item.secret+'_n.jpg'
	var imgCont = '<div class="flickr-image">'+'<div class="information-hidden"><a class="title"'
		+'href="http://www.flickr.com/photos/'+ item.owner + '/' + photoID + '">' + item.title.substr(0,15) + '...</a>'
		+'<br><span class="owner"><a href="http://flickr.com/photos/' + item.owner + '">'+ username
		+ '</a></span></div><img src="' + photoURL + '"></div>';
	$(imgCont).appendTo('#photos');
	$('#photos').masonry({
	  columnWidth: 320,
	  itemSelector: '.flickr-image'
	});
}




