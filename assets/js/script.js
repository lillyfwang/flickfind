var pagination = 1;
var total_pages = 0;
var search_terms = {};
var flickr = new Flickr({
		api_key: "7e068b89b2a42d5f9b92841ddb7fdd02"
	});

$(document).ready(function(){
	$( "#upsince" ).datepicker();
	$( "#upuntil" ).datepicker();
	$(function() {
	    $( "#navbar" ).accordion({
	      collapsible: true,
	      active: false,
	      heightStyle: "content"
	    });
	  });
	$('#search-bar').keypress(function(e){
        if(e.which == 13){
            $('#submit').click();
        }
    });
    $('#username').keypress(function(e){
        if(e.which == 13){
            $('#submit').click();
        }
    });
	$( window ).resize(function() {
	  $( ".col-m-4" ).css("height", $( ".col-m-4" ).width());
	  $( ".col-sm-6" ).css("height", $( ".col-sm-6" ).width());
	});
	checkPagination();
});

function readForm(){
	pagination = 1;
	total_pages=0;
	search_terms = {};
	search_terms["text"] = document.getElementById('search-bar').value.replace(/\s/g, '+');
	search_terms["min_upload_date"] = document.getElementById('upsince').value;
	search_terms["max_upload_date"] = document.getElementById('upuntil').value;
	search_terms["per_page"] = '9';
	if (document.getElementById('username').value.length>0) {
		getUserID(document.getElementById('username').value);
	}
	else {
		findPhotos(search_terms);
	}
	checkPagination();
	$( "#navbar" ).accordion( "option", "active", "false" );
}

function nextPage(){
	pagination++;
	findPhotos(search_terms);
}

function prevPage(){
	pagination--;
	findPhotos(search_terms);
}

function getUserID(username){
	var id = {};
	id["username"] = username;
	flickr.people.findByUsername(id, function(err, result){
		if(err){
			$('#photos').html('<div id="intro">FlickFind<br>'
				+'<span style="font-family: Oxygen, sans-serif; font-size: .5em; color: #8C0000">Invalid Username</span></div>');
			$(error).appendTo('#photos')
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
			$('#photos').html('<div id="intro">FlickFind</div>');
		} else {
			total_pages = result.photos.total;
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
	var photoURL = 'http://farm'+item.farm+'.static.flickr.com/'+item.server+'/'+item.id+'_'+item.secret+'_z.jpg'
	var imgCont = '<div class="col-xs-12 col-sm-6 col-md-4 flickr-image">'+'<div class="information-hidden"><a class="title"'
		+'href="http://www.flickr.com/photos/'+ item.owner + '/' + photoID + '">"' + item.title.substr(0,20) + '..."</a>'
		+'<br><span class="owner"><i>by</i><br><a href="http://flickr.com/photos/' + item.owner + '">'+ username
		+ '</a></span></div><img src="' + photoURL + '"></div>';
	$(imgCont).appendTo('#photos');
	$( ".col-m-4" ).css("height", $( ".col-m-4" ).width());
	$( ".col-sm-6" ).css("height", $( ".col-sm-6" ).width());
	checkPagination();
}

function checkPagination(){
	if (pagination <= 1) {
		$("#back").css("display", "none");
	} else {
		$("#back").css("display", "block");
	}
	if (pagination < total_pages){
		$("#forward").css("display", "block");
	} else {
		$("#forward").css("display", "none");
	}
}
