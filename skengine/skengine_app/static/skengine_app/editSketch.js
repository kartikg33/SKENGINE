
$(document).ready(function(){
	
	// GLOBAL VARIABLES
	var screen_centre = {x: screen.width/2, y: screen.height/2}; //centre of screen display
	var window_pos = {x: window.screenX, y: window.screenY}; //position of browser on screen

	//----------INITIALISE PAGE----------//

	//set sizes of html containers
	$(".debug").width($(window).width());	
	$(".debug").height(0);	
	$(".sketch").width($(window).width());
	$(".sketch").height($(window).height());

	//Initialise number of frames
	var numFrames = $(".sketch").children().length+1;
	//Initialise positions of each frame
	$(".container").each(function(){
		var obj = $(this).parent();
		var posX = parseFloat(obj.attr("data-centre-x")) + screen_centre.x - window_pos.x;
		var posY = parseFloat(obj.attr("data-centre-y")) + screen_centre.y - window_pos.y;
		obj.css({
			'position': 'absolute',
			'left': posX,
			'top': 	posY,
		});
	});


	//----------EVENTS----------//

	//RESIZE WINDOW
	$(window).on("resize",function(){
		window_pos = {x: window.screenX, y: window.screenY}; //new position of browser
		
		//set new sizes of html containers
		$(".debug").width($(window).width());	
		$(".debug").height(0);	
		$(".sketch").width($(window).width());
		$(".sketch").height($(window).height());

		//Set new positions of each frame
		$(".container").each(function(){
			var obj = $(this).parent();
			var posX = parseFloat(obj.attr("data-centre-x"))+screen_centre.x - window_pos.x;
			var posY = parseFloat(obj.attr("data-centre-y"))+screen_centre.y - window_pos.y;
			obj.css({
				'position': 'absolute',
				'left': posX,
				'top': 	posY,
			}); 
		});
	});

	// MOUSE EVENTS

	// Variables to store Mouse Position
	var currentMousePos = { x: 0, y: 0 };
    $(document).mousemove(function(event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
    });

    // Hovering Over Frame
	$(document).on("mouseover",".container",function() {
		$(".hovering").removeClass('hovering'); // All Others Not Hovering
		$(this).addClass('hovering'); // Hovering
	});

	// Selecting Frame
	$(document).on("click", ".hovering", function(){
		$(".selected").removeClass('selected'); // Deselects Other Frames
		$(this).addClass('selected'); // Selects This Frame
		$(this).parent().css('z-index',1);
	});

	// Not Hovering Over Frame
	$(document).on("mouseleave",".hovering",function() {
		$(this).removeClass('hovering'); // Not Hovering
	});
	

    // Double Clicking on Page
	$(".sketch").dblclick(function(){
		// Deletes Selected Frame
		if ($(".selected").length>0){
			$(".selected").parent().remove();
		} else { // Else Creates New Frame
			jQuery("<div/>", {
		    	id: numFrames
			}).appendTo(".sketch");
			//$("#"+numFrames).load("box.htm"); // Loads HTML for New Frame
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
				'position': 'absolute'
			}); 
			
			numFrames = numFrames + 1;

			/*
			// DEBUG TEXT
			$('.debug').text('DEBUG pos: '+x+', '+y+'; '+
					'click: '+currentMousePos.x+', '+currentMousePos.y+'; '+ 
					newFrame.width() +', '+ newFrame.height() + ', ' + $(".sketch").children().length +
					', ' + numFrames
			);*/
		} //end else
	});  


	// Start Dragging Frame
	var dragging = null; // Pointer to Frame being Dragged
	$(document).on("mousedown",".selected",function(e) {
		if(dragging==null){ // Only Drag One Frame At A Time
			var dragging=$(this);	//to prevent other elements from being moved
			var position = $(this).position();
			dragging.css('cursor','move');
		
			$(document).on("mousemove",".selected",function(event){
				
				// Calculate Move Amount and Set Window Bounds
				var move_left = Math.max($(".sketch").position().left
					, position.left + event.pageX - e.pageX);
				move_left = Math.min(($(".sketch").position().left+$(window).width())-$(this).width()
					, move_left); 

				var move_top = Math.max($(".sketch").position().top
					, position.top + event.pageY - e.pageY);
				move_top = Math.min(($(".sketch").position().top+$(window).height())-$(this).height()
					, move_top);

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
		} //if(dragging==null)	
	});

	// Stop Dragging Frame
	$(document).on("mouseup",".sketch",function(e) {
		$(document).off("mousemove",".selected");
		if(dragging!=null){
			dragging.css('cursor','auto');
			//$(this).css('cursor','auto');
		}
		dragging = null;
		$('.debug').text('DEBUG '+dragging);
	});	

	// BUTTON EVENTS

	// ADD BUTTON
	$(".addbtn").click(function(){
		remove = "false";
		$(".sketch").css('cursor', 'auto');
		$(".container").css('cursor', 'auto');
		var num = "id"+$(".sketch").children().length;
		jQuery("<div/>", {
		    id: num,
		}).appendTo(".sketch");
		$("#"+num).load("box.htm");
	});

	// REMOVE BUTTON
	var remove = "false";
	$(".rembtn").click(function(){
		if(remove=="false"){
			remove = "true";
			$(".sketch").css('cursor', 'crosshair');
			$(".container").css('cursor', 'crosshair');
		} else {
			remove = "false";
			$(".sketch").css('cursor', 'auto');
			$(".container").css('cursor', 'auto');
		}
		//var num = "id"+($(".sketch").children().length-1);
		//$("#"+num).remove();
	});
});
