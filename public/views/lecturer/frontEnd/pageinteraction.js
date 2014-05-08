// Load lectures into an array

// Examples for testing hardcoded [courseid,coursename,lectureids in order]
// we may want to reorder courses so id=/=index is possible. hence being stored
var courses = [[0,"ADSA",[0,1]],[1,"Logic and Proof",[2]]];
// [lectureid,name,urlonserver]
var lectures = [];

// when DOM elements have been made
$(document).ready(function(){

	// Loads in the courses from the courses array
	$.each(courses, function(index,item){
		var course = item[1];
		$('.courses').append('<div class="course panel panel-default" courseid="'+index+'">'+course+'</div>');
		$('.lectures').append('<div courseid="'+index+'"></div>');
	});


	// Eventlisteners on courses

	$('.courses').on("click",".course",function(){
		var x = $(this);
		$.each(x.parent().children(), function(index,course){
			$(course).removeClass('selected');
		});
		x.addClass('selected');

		$('#coursename').text(x.text());
		$('#coursename').attr('courseid',x.attr('courseid'));
		// Change lecture view

		$.each($('.lectures').children(),function(index,course){
			if($(course).attr('courseid')==x.attr('courseid'))
				$(course).show();
			else{
				$(course).hide();
			}
		});
		$('.lectureops').show();
	});
	$('#addCourse').click(function(){
		$.each($('.courses').children(), function(index,course){
			$(course).removeClass('selected');
		});

		var id = courses.length;
		var x = $.parseHTML('<div class="course panel panel-default selected" courseid="'+id+'">Unnamed Course</div>');
		$('.courses').append(x);	
		$('.course[courseid="'+id+'"]').trigger("click");

		selectText('coursename');
		$('#coursename').focus();

		$('.lectures').append('<div courseid="'+id+'"></div>');
		courses.push([id,"Unnamed Course",[]]);
	});
	//pulls up confirmDelete, doesn't actually delete
	$('#deleteCourse').click(function(){
		var findSelected = null;
		$.each($('.courses').children(), function(index,course){
			if($(course).hasClass('selected'))
				findSelected = $(course).text();
		});

		if(findSelected!=null){
			$('#confirmDelete').removeClass('btn-info');
			$('#confirmDelete').addClass('btn-danger');	
			$('#confirmDelete').text("Delete \""+findSelected+"\"");
		}
		else {
			$('#confirmDelete').addClass('btn-info');
			$('#confirmDelete').removeClass('btn-danger');
			$('#confirmDelete').text("No Course Selected");
		}
	});
	$('#confirmDelete').click(function(){
		var courseid = null;
		$.each($('.courses').children(), function(index,course){
			if($(course).hasClass('selected')){
				courseid = $(course).attr('courseid');
				$(course).remove();
				//break;
			}
		});
		if(courseid!=null){ //it deleted a course
			$('.lectureops').hide(); // since no course selected

			// lectures array size > courses array size
			// Updates lectures and courses array
			for(i=0;i<courses.length;i++){
				if(courses[i][0]===courseid){
					var l = courses[i][2];
					for(k=0;k<lectures.length;k++){
						for(j=0;j<l.length;j++){
							if(l===lectures[k][0])
								delete lectures[k]; 
						}
					}
					
					delete courses[i];
					//break;	
				}
			}			
		}
	});
	$('#coursename').keyup(function(){
		//if($(this).html()!=""){
			var cid = $('#coursename').attr('courseid');
			var cname = $('#coursename').text();
			$('.courses').find('[courseid="'+cid+'"]').text(cname);
		//}
	});
	$('#coursename').change(function(){
		//if($(this).html()!=""){
			var cid = $('#coursename').attr('courseid');
			var cname = $('#coursename').text();
			$('.courses').find('[courseid="'+cid+'"]').text(cname);
		//}
	});
	$('#coursename').blur(function(){
		if($(this).val() === "")
			$(this).val('Unnamed Course');
	})

	// Eventlisteners on lectures

	$('#addLecture').click(function(){
		var str = '\
		<div class="panel panel-default lecture" lecture="'+lectures.length+'">\
			<div class="panel-heading">\
				<h4 class="panel-title">\
		        	<a contentEditable data-toggle="collapse" data-parent="#accordion" id="lecturename'+lectures.length+'" href="#'+lectures.length+'">\
		          		Unnamed Lecture\
		        	</a>\
		        	<a class="arrow" data-toggle="collapse" data-parent="#accordion" href="#'+lectures.length+'" style="float:right"><i class="fa fa-caret-down"></i></a>\
		      	</h4>\
		    </div>\
		    <div id="'+lectures.length+'" class="panel-collapse collapse">\
		     	<div class="panel-body">\
		      		<input type="file" class="inputlecture"/><br/>\
		      		<button class="btn btn-warning">Start lecture</button>\
		      		<button type="submit" id="deleteLecture" class="btn btn-danger" style="float:right">Delete Lecture</button>\
		      	</div>\
		    </div>\
		  </div>';

		var cid = $('#coursename').attr('courseid');
		$('.lectures').find('[courseid="'+cid+'"]').append(str);
		console.log(lectures.length);
		$('.lecture[lecture="'+lectures.length+'"] div h4 a').focus();
		selectText('lecturename'+lectures.length);

		lectures.push([lectures.length,"Unnamed Lecture",""]);
	});

	$('.lectures').on('hidden.bs.collapse','.lecture', function () {
		$(this).find('.arrow').html('<i class="fa fa-caret-down"></i>');
	  // do something…
	});
	$('.lectures').on('shown.bs.collapse','.lecture', function () {
		$(this).find('.arrow').html('<i class="fa fa-caret-right"></i>');
	  // do something…
	});
	$('.lectures').on('click','#deleteLecture',function(){
		$(this).closest('.lecture').remove();
	});
	
});

function selectText(element) {
    var doc = document
        , text = doc.getElementById(element)
        , range, selection
    ;    
    if (doc.body.createTextRange) { //ms
        range = doc.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) { //all others
        selection = window.getSelection();        
        range = doc.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

// course object
/*
function course(name){
	this.name = name;
	this.lectures = [];

	function addlecture(lecture,id){	
		this.lectures.push([lecture,id]);
	}
	return this;
}

function addCourse(name,id){
	courses.push([id,name,new course(name)]);
}
*/