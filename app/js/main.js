'use strict'

$(document).ready(function(){

	const mainUrl = 'https://www.googleapis.com/youtube/v3/search';
	const mainKey = 'AIzaSyDM_M7Zexu25rNdFU7xGtCrFOTe4RwTnBs';
	var page = {};
	const arrWithCurrVideos = [];

	$('#form').on('submit',(e)=>{
		e.preventDefault();
		searchYouTube();
		setTimeout(function(){
			$('.playlist').removeClass('show_playlist');
			$('.playlist').addClass('show_playlist')
		},1000);
	})
	$('.tokenClass').on('click', function (){
			page.current = $(this).attr('data-name') == "NextCard" ? page.nextToken : page.prevToken;
			searchYouTube();

			$('.current_video_play').addClass('hide_video');
			setTimeout(function(){
				$('.current_video_play').removeClass('hide_video');
				$('.current_video_play').addClass('show_video');
			},1000)	
	})
	$('.playlist').on('click','.playlist_item',function(){
		let clicked_videoID = $(this).attr('videosrc');
		$('.current_video_play').html('<iframe width="560" height="315" src="https://www.youtube.com/embed/'+ clicked_videoID +'" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
	})
	$('.playlist').on('click','.show_list_btn',()=>{
		if( $('.playlist').hasClass('show_playlist') ){
			$('.show_list_btn').removeClass('active');
			$('.playlist').removeClass('show_playlist');
		}
		else{
			$('.show_list_btn').addClass('active');
			$('.playlist').addClass('show_playlist')
		}
	})
	// JESZCZE NE WIEM
	// \    /
	//  \  /
	//   v
// const checkPlaylistActive = () => {
// 	if($('.playlist').attr('aria-expanded') === 'false'){
// 		$('.playlist').attr('aria-expanded', 'true');
// 		$('.show_list_btn').addClass('active');
// 	}	
// 	else{
// 		$('.playlist').attr('aria-expanded', 'false');
// 		$('.show_list_btn').removeClass('active');
// 	}
// }
const searchYouTube = () =>{

		let search_value = $('.search_value').val();
		$.ajax({
			url: mainUrl,
			type:'GET',
			dataType: 'json',
			data :{
					q:search_value,
					part:'snippet',
					key: mainKey,
					maxResults: 5,
					pageToken: page.current,
			}
		}).done(data => {

	
			page.nextToken = data.nextPageToken;
			page.prevToken = data.prevPageToken;
			let mainVideoTitle = '';
			let mainVideoImage = '';
			let mainVideoImageId = '';
			let ul = '<ul>';
			const showListButton = '<button class="show_list_btn"></button>';
				$.each(data.items,(index,value) =>{
					arrWithCurrVideos.push(value);
					if(index == 0){
						mainVideoTitle += value.snippet.title;
						mainVideoImage += value.snippet.thumbnails.medium.url;
						mainVideoImageId += value.id.videoId;
					}
					ul += '<li class="playlist_item" data-index="'+ index +'" videosrc="'+ value.id.videoId +'"><img src="'+ value.snippet.thumbnails.default.url +'"><h3>' + value.snippet.title + '</h3></li>';
				})
				
			
			$('.current_video_play').html('<iframe width="560" height="315" src="https://www.youtube.com/embed/'+mainVideoImageId+'" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
			$('.playlist').html(showListButton + ul)
		})
	}
});


// AIzaSyDM_M7Zexu25rNdFU7xGtCrFOTe4RwTnBs 

//https://www.googleapis.com/youtube/v3/search?q=test&part=snippet&key=AIzaSyDM_M7Zexu25rNdFU7xGtCrFOTe4RwTnBs