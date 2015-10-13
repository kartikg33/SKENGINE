
$(document).ready(function(){
	
	// GLOBAL VARIABLES
	var screen_centre = {x: screen.width/2, y: screen.height/2}; //centre of screen display
	var window_pos = {x: window.screenX, y: window.screenY+window.outerHeight-window.innerHeight}; //position of browser on screen

	//----------INITIALISE PAGE----------//
	//set sizes of html containers
	$(".debug").width(window.width);	
	$(".debug").height(0);	

	//Initialise number of frames
	var numFrames = parseInt($("body").attr("data-num-frames"));
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

	// Get Session Cookie for Posting
	function getCookie(name) {
	    var cookieValue = null;
	    if (document.cookie && document.cookie != '') {
	        var cookies = document.cookie.split(';');
	        for (var i = 0; i < cookies.length; i++) {
	            var cookie = jQuery.trim(cookies[i]);
	            // Does this cookie string begin with the name we want?
	            if (cookie.substring(0, name.length + 1) == (name + '=')) {
	                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
	                break;
	            }
	        }
	    }
	    return cookieValue;
	}
	var csrftoken = getCookie('csrftoken');

	function csrfSafeMethod(method) {
	    // these HTTP methods do not require CSRF protection
	    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	}
	$.ajaxSetup({
	    beforeSend: function(xhr, settings) {
	        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
	            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	        }
	    }
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

	// Click away from any frame
	$(document).live("click",function(){
		if ($(".hovering").length==0){ 
			console.log("click not hovering")
			console.log($(".editing").length)
			if ($(".editing").length>0){
				console.log("kill the edits")
				finishEditingText();
			} else {
				console.log("kill the selected")
				deselect_all();
			}
		}
	});

    // Hovering Over Frame
	$(document).on("mouseover",".container",function() {
		$(this).addClass('hovering'); // Hovering
	});

	// Not Hovering Over Frame
	$(document).on("mouseleave",".hovering",function() {
		$(this).removeClass('hovering'); // Not Hovering
	});

	// Selecting Frame
	$(document).on("click", ".hovering", function(event){
		if(!event.shiftKey){
			deselect_all();
		}
		select_frame($(this));
	});

	// Checking for Key Presses
	$(document).on("keydown", function(keydown_event){
		// Pressing Delete Key on Selected Deletes Frame
		if(keydown_event.which == 8){ // Delete Key Down
			$(".selected").each(function(){
				if(!$(this).hasClass('editing')){
					delete_frame($(this));
					$(this).parent().remove();
				}
			});	
		}
		console.log(keydown_event.which)
		if(keydown_event.which == 13){
			keydown_event.preventDefault();
			if ($(".editing").length>0){
				console.log("kill the edits")
				finishEditingText();
			}
		}
	});

    // Double Clicking on Page Adds Frame
	$(document).dblclick(function(event){
		// If not hovering over a frame
		if ($(".hovering").length==0){ 
			//Update No. Frames
			numFrames = numFrames + 1;
			//Create New HTML
			jQuery("<div/>", {
		    	id: numFrames
			}).appendTo("body");
			$("#"+numFrames).html('<div class = "container edit">Enter Text</div>');
			var newFrame = $("#"+numFrames);

			//Calculate Position of New Frame
			var left = event.pageX;
			var top = event.pageY;

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
			//Update Body Data
			$("body").attr('data-num-frames', numFrames);
			save_frame(newFrame.children()); //need to pass container through
		} //end else
	});  


	// Start Dragging Frame
	//$(document).on("mousedown",".selected",function(e) {
	$(".selected").live("mousedown", function(e){	
		var dragging=$(".selected"); // move all selected elements

		// find initial position of each selected element
		var position = [];
		dragging.each(function(index){
			position.push($(this).offset());
		});
					
		$(document).on("mousemove",function(event){
			dragging.each(function(index){ // for each selected element
				$(this).css('cursor','move');
				// Find new position
				var move_left = position[index].left + event.pageX - e.pageX;
				var move_top = position[index].top + event.pageY - e.pageY;

				//Set new position
				 $(this).parent().css({	//only moves what is being dragged, not others by accident.
					'left': move_left,
					'top': 	move_top,
				}); 
				//Calculate and set new Position from Centre
				var posX = move_left - screen_centre.x + window_pos.x;
				var posY = move_top - screen_centre.y + window_pos.y;
				 $(this).parent().attr({
					'data-centre-x': posX,
					'data-centre-y': posY
				});

				// DEBUG TEXT
				$('.debug').text('DEBUG pos: '+position.left+', '+position.top+'; '+
					'click: '+e.pageX+', '+e.pageY+'; '+
					'current: '+event.pageX+', '+event.pageY+'; '+
					'new_pos: '+move_left+', '+move_top	+'; '+
					 $(this).parent().attr('id') 
				);
			});	

		});
	});

	// Stop Dragging Frame
	$(document).on("mouseup",function(e) {
		$(document).off("mousemove");
		$(".selected").css('cursor','auto');
		save_frame($(".selected"));
	});	


	// EDITING CONTENT

	//$(".edit").jqte();

	// Edit text in place
	//$(".selected.edit").live("dblclick", editText);

	// Select all text on focus
	$(".editBox").focus(function(event) {
		this.select();
	});


	// FUNCTIONS!!!

	function editText(){
		$(".selected.edit").off('dblclick', editText);
		console.log("replacing text")
		if($(".editing").length==0){
			oldText = $(this).html();
			oldText.replace("\"", "\\\"");
			//$(this).html("");
			$(this).html("<form><input type=\"text\" class=\"editBox\" value=\""+ oldText + "\"/></form>");
			$(this).addClass('editing');
		}
		$(".editBox").focus(); // gains focus - alerts user if they attempt to click another
	};

	function finishEditingText(){
		$(".editBox").blur(); // loses focus
		console.log("killing edits")
		newText = $(".editing").children("form").children('.editBox').val();
		newText.replace("\"", "\\\"");
		console.log(newText)
		$(".editing").html(newText);
		//save_frame($(".editing"));
		$(".editing").removeClass('editing');
		$(".selected.edit").live("dblclick", editText);
	};



	function select_frame(frame){
		frame.addClass('selected'); // Selects This Frame
		frame.parent().css('z-index',1);
	};

	function deselect_frame(frame){
		frame.parent().css('z-index',0);
		frame.removeClass('selected'); 
	};

	// Deselects All Frames
	function deselect_all(){
		$(".selected").parent().css('z-index',0);
		$(".selected").removeClass('selected'); 
	};

	function save_frame(selected){
		//saves each selected element
		selected.each(function(){ 
			var frame = parseInt($(this).parent().attr('id'));
			console.log(frame)
			$.ajax({
				url: ".",
				type: 'POST',
				data: {
					task: "save",
					id: frame, 
					posX: $("#"+frame).attr('data-centre-x'), 
					posY: $("#"+frame).attr('data-centre-y'),
					width: $("#"+frame).width(),
					height: $("#"+frame).height(),
					text: $("#"+frame+" .container").html()
				},
			});	
		});
	};

	function delete_frame(selected){
		//deletes each selected element
		selected.each(function(){ 
			var frame = parseInt($(this).parent().attr('id'));
			console.log("Deleting Frame " + frame)	
			$.ajax({
				url: ".",
				type: 'POST',
				data: {
					task: "delete",
					id: frame, 
				},
			});
		});
	};

	
});
