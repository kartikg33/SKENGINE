
$(document).ready(function(){
	//----------INITIALISE PAGE----------//
	// VARIABLES
	var screen_centre = {x:screen.width, y:screen.height};
	var window_centre = {x: $(window).width()/2, y: $(window).height()/2}; //centre point of window
	var window_size = {x:$(window).width(), y:$(window).height()};
	//$('.debug').text('DEBUG width: '+window_size.x+', height: '+window_size.y);
	$(".debug").width(window_size.x);		
	$(".sketch").width(window_size.x);
	$(".sketch").height(window_size.y);

	//Intialise number of frames and their positions
	var numFrames = $(".sketch").children().length+1;
	
	$(".container").each(function(){
		var obj = $(this).parent();
		var posX = parseFloat(obj.attr("data-centre-x"))+window_centre.x;
		var posY = parseFloat(obj.attr("data-centre-y"))+window_centre.y;
		var reposition = obj.css({
			'position': 'absolute',
			'left': posX,
			'top': 	posY,
		}); 
	});

	

	$(window).resize(function(){
		window_centre = {x: $(window).width()/2, y: $(window).height()/2}; //centre point of window
		window_size = {x:$(window).width(), y:$(window).height()};
		$(".debug").width(window_size.x);		
		$(".sketch").width(window_size.x);
		$(".sketch").height(window_size.y);
		$(".container").each(function(){
			var obj = $(this).parent();
			var posX = parseFloat(obj.attr("data-centre-x"))+window_centre.x;
			var posY = parseFloat(obj.attr("data-centre-y"))+window_centre.y;
			var reposition = obj.css({
				'position': 'absolute',
				'left': posX,
				'top': 	posY,
			}); 
		});
		$('.debug').text('DEBUG centre: '+window_centre.x+', '+window_centre.y+'; ');
	});
	
	$('.debug').text('DEBUG screen: '+screen.width+', '+screen.height+'; ');


	//----------EVENTS----------//

	// Variables to store Mouse Position
	var currentMousePos = { x: 0, y: 0 };
    $(document).mousemove(function(event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
    });

    // Hovering Over Frame
	$(document).on("mouseover",".container",function() {
		$(this).addClass('selected'); // Selects Frame
	});

	// Moving Mouse Out of Frame
	$(document).on("mouseleave",".selected",function() {
		$(this).removeClass('selected'); // Deselects Frame
	});
	

    // Double Clicking on Page
	$(".sketch").dblclick(function(){
		// Deletes Selected Frame
		if ($(".selected").length>0){
			$(".selected").parent().remove();
		} else { // Else Creates New Frame
			jQuery("<div/>", {
		    	id: numFrames,
		    	width: 100,
		    	height: 100
			}).appendTo(".sketch");
			//$("#"+numFrames).load("box.htm"); // Loads HTML for New Frame
			$("#"+numFrames).html('<div class = "container"><p>Hello</p></div>');
			//Set Position of New Frame
			var newFrame = $("#"+numFrames);
			//newFrame.addClass('ui-widget-content');
			//newFrame
			//	.draggable;
				//.resizable({
					//ghost:true
				//});
			var x = currentMousePos.x-(newFrame.width()/2);
			var y = currentMousePos.y-(newFrame.height()/2);
			var reposition = newFrame.css({
				'position': 'absolute',
				'left': x,
				'top': 	y,
			}); 
			numFrames = numFrames + 1;

			// DEBUG TEXT
			$('.debug').text('DEBUG pos: '+x+', '+y+'; '+
					'click: '+currentMousePos.x+', '+currentMousePos.y+'; '+ 
					newFrame.width() +', '+ newFrame.height() + ', ' + $(".sketch").children().length +
					', ' + numFrames
			);
		}
	});  




	// REDO DRAGGING CODE LOOKING ONLY AT SELECTED CONTAINERS (.container .selected)
	// BUT REMEMBER THAT NEWER FRAMES WILL BE SELECTED WHEN DRAGGED OVER SO NEED TO COMPENSATE
	// Start Dragging Frame
	var dragging = null; // Pointer to Frame being Dragged
	$(document).on("mousedown",".container",function(e) {
		if(dragging==null){ // Only Drag One Frame At A Time
			dragging=$(this);	//to prevent other elements from being moved
			var position = $(this).offset();
			dragging.css('cursor','move');
		
			$(document).on("mousemove",".container",function(event){
				
				// Calculate Move Amount and Set Window Bounds
				var move_left = Math.max($(".sketch").offset().left
					, position.left + event.pageX - e.pageX);
				move_left = Math.min(($(".sketch").offset().left+window_size.x)-$(this).width()
					,move_left); 

				var move_top = Math.max($(".sketch").offset().top
					, position.top + event.pageY - e.pageY);
				move_top = Math.min(($(".sketch").offset().top+window_size.y)-$(this).height()
					, move_top);


				dragging.parent().css({	//only moves what is being dragged, not others by accident.
					'position': 'fixed',
					'left': move_left,
					'top': 	move_top,
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
		$(document).off("mousemove",".container");
		if(dragging!=null){
			dragging.css('cursor','auto');
		}
		dragging = null;
		$('.debug').text('DEBUG '+dragging);
	});	


	



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
