$(function(){
  queueList = $("#queue");

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
  , queue
  , queueList;

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
    if(queue.length > 0) {
      var song = queue.shift();
      ytplayer.loadVideoByUrl(song.url, 0, "large");
      updateQueueDisplay();
    } else {
      displayEmptyQueue();
    }
    console.log(song);
  } else {
    console.log("Error: queue from server is empty");
  }
}

function displayEmptyQueue(){
  console.log(queueList.find("li"));
  queueList.find("li").remove();
  // queueList.insertInto($("<div class='well well-small'>Nope</div>"));
}

function updateQueueDisplay(){
  queue.forEach(function(song){
    $("<li>" + song.song + "</li>").appendTo(queueList);
  });
}