$(function(){
	$("#queue").sortable();

  $("#play").click(function(){
    if(playing)
      ytplayer.pauseVideo();
    else
      ytplayer.playVideo();

    playing = !playing
  });

  $("#next").click(function(){
    loadNextVideoFromQueue(); 
  });
});

var ytplayer
  , params = { allowScriptAccess: "always" }
  , atts = { id: "myytplayer" }
  , playing = false
  , queue;

$.get("/nextSong", function(data){
  console.log("Data recieved: ");
  console.log(data);
  queue = data;
})


swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&playerapiid=ytplayer&version=2",
                   "ytapiplayer", "425", "356", "8", null, null, params, atts);

function onYouTubePlayerReady(playerId) {
  console.log("loaded");
  ytplayer = document.getElementById("myytplayer");
  ytplayer.addEventListener("onStateChange", "stateChangeCallBack");

  ytplayer.loadVideoById("bHQqvYy5KYo", 5, "large");
  
  // ytplayer.loadPlaylist({listType: 'search',
  //             list: 'Green Day Holiday'
  //             // index: 0,
  //             // startSeconds: 0,
  //             /*suggestedQuality: 'best'*/});
}

function stateChangeCallBack(i){
  // Possible States
  // YT.PlayerState.ENDED
  // YT.PlayerState.PLAYING
  // YT.PlayerState.PAUSED
  // YT.PlayerState.BUFFERING
  // YT.PlayerState.CUED

  console.log("YouTube state change: " + i);
  switch(i) {
    case YT.PlayerState.PLAYING:
      playing = true;
      break;
    case YT.PlayerState.PAUSED:
      playing = false;
      break;
    case YT.PlayerState.ENDED:
      playing = false;
      loadNextVideoFromQueue();
      break;
  }
}

function loadNextVideoFromQueue(){
  if(queue) {
    var song = queue.shift();
    console.log(song);
    console.log(ytplayer.loadPlaylist({list: song.name + " " + song.artist, listType: "search"}));
  } else {
    console.log("Error: queue from server is empty");
  }
}