
$(document).ready(function(){
	
	// GLOBAL VARIABLES
	var screen_centre = {x: screen.width/2, y: screen.height/2}; //centre of screen display
	var window_pos = {x: window.screenX, y: window.screenY+window.outerHeight-window.innerHeight}; //position of browser on screen

	//----------INITIALISE PAGE----------//
	//set sizes of html containers
	$(".debug").width(window.width);	
	$(".debug").height(0);	

	//Initialise number of frames
	var numFrames = parseInt($("body").attr("data-num-frames"))+1;
	//Initialise positions of each frame
	$(".container").each(function(){
		var obj = $(this).parent();
		var posX = parseFloat(obj.attr("data-centre-x")) + screen_centre.x - window_pos.x;
		var posY = parseFloat(obj.attr("data-centre-y")) + screen_centre.y - window_pos.y;
		obj.css({
			'left': posX,
			'top': 	posY,
		});
	});


	//----------EVENTS----------//

	//RESIZE WINDOW
	$(window).on("resize",function(){
		window_pos = {x: window.screenX, y: window.screenY+window.outerHeight-window.innerHeight}; //new position of browser
		
		//set new sizes of html containers
		$(".debug").width(window.width);	
		$(".debug").height(0);	


		//Set new positions of each frame
		$(".container").each(function(){
			var obj = $(this).parent();
			var posX = parseFloat(obj.attr("data-centre-x"))+screen_centre.x - window_pos.x;
			var posY = parseFloat(obj.attr("data-centre-y"))+screen_centre.y - window_pos.y;
			obj.css({
				'left': posX,
				'top': 	posY,
			}); 
		});
	});

	// MOUSE EVENTS

	// Variables to store Mouse Position
	var currentMousePos = { x: 0, y: 0 };
    $(document).mousemove(readMouse);

    function readMouse(event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
    };

    // Hovering Over Frame
	$(document).on("mouseover",".container",function() {
		//$(".hovering").removeClass('hovering'); // All Others Not Hovering
		$(this).addClass('hovering'); // Hovering
	});

	// Not Hovering Over Frame
	$(document).on("mouseleave",".hovering",function() {
		$(this).removeClass('hovering'); // Not Hovering
	});

	// Selecting Frame
	$(document).on("click", ".hovering", function(){
		$(".selected").parent().css('z-index',0);
		$(".selected").removeClass('selected'); // Deselects Other Frames
		$(this).addClass('selected'); // Selects This Frame
		$(this).parent().css('z-index',1);
	});

	
	

    // Double Clicking on Page Adds Frame, On Hovering Deletes Frame
	$(document).dblclick(function(){
		// Deletes Selected Frame
		if ($(".hovering").length>0){
			$(".hovering").parent().remove();
		} else { // Else Creates New Frame
			jQuery("<div/>", {
		    	id: numFrames
			}).appendTo("body");
			$("#"+numFrames).html('<div class = "container txt"><p>Enter Text</p></div>');
			var newFrame = $("#"+numFrames);

			//Calculate Position of New Frame
			var left = currentMousePos.x-100;
			var top = currentMousePos.y-100;

			//Calculate Position from Centre
			var posX = left - screen_centre.x + window_pos.x;
			var posY = top - screen_centre.y + window_pos.y;
			newFrame.attr({
				'data-centre-x': posX,
				'data-centre-y': posY
			});

			//Set Position of New Frame
			newFrame.css({
				'width': '200px',
				'height': '200px',
				'left': left,
				'top': 	top,
				'z-index': 0,
				'position': 'fixed'
			}); 
			numFrames = numFrames + 1;
		} //end else
	});  


	// Start Dragging Frame
	$(document).on("mousedown",".selected",function(e) {
		var dragging=$(this);	//to prevent other elements from being moved
		var position = $(this).offset();
		dragging.css('cursor','move');
	
		$(document).on("mousemove",function(event){

			var move_left = position.left + event.pageX - e.pageX;
			var move_top = position.top + event.pageY - e.pageY;

			//Set new position
			dragging.parent().css({	//only moves what is being dragged, not others by accident.
				'left': move_left,
				'top': 	move_top,
			}); 
			//Calculate and set new Position from Centre
			var posX = move_left - screen_centre.x + window_pos.x;
			var posY = move_top - screen_centre.y + window_pos.y;
			dragging.parent().attr({
				'data-centre-x': posX,
				'data-centre-y': posY
			});

			// DEBUG TEXT
			$('.debug').text('DEBUG pos: '+position.left+', '+position.top+'; '+
				'click: '+e.pageX+', '+e.pageY+'; '+
				'current: '+event.pageX+', '+event.pageY+'; '+
				'new_pos: '+move_left+', '+move_top	+'; '+
				dragging.parent().attr('id') 
			);
		});	
	});

	// Stop Dragging Frame
	$(document).on("mouseup",function(e) {
		$(document).off("mousemove");
		$(document).mousemove(readMouse);
		$(".selected").css('cursor','auto');
		/*$.post('/edit', {'id': $(".selected").parent().id}, function(data, textStatus, xhr) {
			//optional stuff to do after success 
		});*/
	});	

	$("#saveButton").on('click', function(event) {
		event.preventDefault();
		console.log("Save Button Pressed")
		save_frames();
	});

	function save_frames(){
		console.log("Saving Frames")
		console.log(numFrames);
	};
	
});
