$(function(){
	$("#queue").sortable();

	$("#add-song").click(function(){
		
	});

  var config =  {
    playlist: {
      title: 'Random videos',
      videos: [
        { id: 'hPzNl6NKAG0', title: 'Maru the cat' }
      ]
    }
  };


  var player = $("#player").player(config);
  console.log(player);
  player.player('cueVideo', { id: "hNAKWF1uQ08" });
});