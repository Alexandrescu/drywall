(function() {

  'use strict';

//[0,"ADSA",[0,1]],[1,"Logic and Proof",[2]]];
// [lectureid,name,urlonserver]
var courses = [];
var lectures = [];
var json;
var PDFJS = "http://localhost:8888/web/viewer.html";

// when DOM elements have been made
$(document).ready(function(){
	
		$.ajax({
		    'url': '../getMyCourses/',
		    'data': {},
		    'success': function(jsonData) {
		      json = jsonData;
		      courses = jsonData.response.courses;

			  $.each(courses, function(index,item){
			    var course = item.name;
			    lectures[index] = item.lectures;

				$('.courses').append('<div class="course panel panel-default" courseIndex="'+index+'">'+course+'</div>');
				$('.lectures').append('<div courseIndex="'+index+'"></div>');
				showLectures(index);
			  });

			  $.each($('.lectures').children(),function(index,course){
				$(course).hide();
			  });
		    },
		});
	// Loads in the courses from the courses array
	

	// Eventlisteners on courses
	$('#Bulkadd').click(function(){
		if($('.course.selected').hasClass('new')) {
			$.ajax({
  			'type': "POST",
		    'url': '../postCourse/',
		    'data': {courseName: $('.course.selected').html(), year:2},
		    'success': function(jsonData) {}
		});
		}
		else {
			//updating
			$.ajax({
			'type': "POST",
		    'url': '../updateCourse/',
		    'data': {action:"update", courseName: $('.course.selected').html(), courseId: courses[parseInt($('.course.selected').attr('courseIndex'))]._id},
		    'success': function(jsonData) {
		      
			}});
		}
	});

	function showLectures(cid) {
		var thisLectures = lectures[cid];
		$.each(thisLectures, function(entry,item){
//<input type="file" id="file'+uniqueId+'" class="inputlecture"/><br/>\

			//alert(JSON.stringify(item));
			/*jshint multistr: true */
			var uniqueId = entry + cid * 100;
			var str = '\
			<div class="panel panel-default lecture" lecture="'+uniqueId+'">\
				<div class="panel-heading">\
					<h4 class="panel-title">\
			        	<a contentEditable data-toggle="collapse" data-parent="#accordion" id="lecturename'+uniqueId+'" href="#'+uniqueId+'">\
			          		' + item.title.split('+').join(' ') + ' </a>\
			        	<a class="arrow" data-toggle="collapse" data-parent="#accordion" href="#'+uniqueId+'" style="float:right"><i class="fa fa-caret-down"></i></a>\
			      	</h4>\
			    </div>\
			    <div id="'+uniqueId+'" class="panel-collapse collapse">\
			     	<div class="panel-body">\
			     		Has PDF. <br>\
		      		<button id="startLecture" class="btn btn-success">Start lecture</button>\
		      		<button id="saveLecture" class="btn btn-warning">Save lecture</button>\
			      		<button type="submit" id="deleteLecture" class="btn btn-danger" style="float:right">Delete Lecture</button>\
			      	</div>\
			    </div>\
			  </div>';

			$('.lectures').find('[courseIndex="'+cid+'"]').append(str);
			$('.lecture[lecture="'+uniqueId+'"] div h4 a').focus();
		});
	}

	$('.courses').on("click",".course",function(){
		var x = $(this);
		$.each(x.parent().children(), function(index,course){
			$(course).removeClass('selected');
		});
		x.addClass('selected');

		$('#coursename').text(x.text());
		$('#coursename').attr('courseIndex',x.attr('courseIndex'));
		// Change lecture view

		$.each($('.lectures').children(),function(index,course){
			if($(course).attr('courseIndex')===x.attr('courseIndex')){
				$(course).show();
			}
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
		var x = $.parseHTML('<div class="new course panel panel-default selected" courseIndex="'+id+'">Unnamed Course</div>');
		$('.courses').append(x);	
		$('.course[courseIndex="'+id+'"]').trigger("click");

		selectText('coursename');
		$('#coursename').focus();

		$('.lectures').append('<div courseIndex="'+id+'"></div>');
		courses.push([id,"Unnamed Course",[]]);

		
	});
	//pulls up confirmDelete, doesn't actually delete
	$('#deleteCourse').click(function(){
		$.ajax({
			'type': "POST",
		    'url': '../updateCourse/',
		    'data': {action:"delete", courseName: $('.course.selected').html(), courseId: courses[parseInt($('.course.selected').attr('courseIndex'))]._id},
		    'success': function(jsonData) {
		      
		var findSelected = null;
		$.each($('.courses').children(), function(index,course){
			if($(course).hasClass('selected')){
				findSelected = $(course).text();
			}
		});

		if(findSelected!==null){
			$('#confirmDelete').removeClass('btn-info');
			$('#confirmDelete').addClass('btn-danger');	
			$('#confirmDelete').text("Delete \""+findSelected+"\"");
		}
		else {
			$('#confirmDelete').addClass('btn-info');
			$('#confirmDelete').removeClass('btn-danger');
			$('#confirmDelete').text("No Course Selected");
		}
			}});

	});
	$('#confirmDelete').click(function(){
		var courseIndex = null;
		$.each($('.courses').children(), function(index,course){
			if($(course).hasClass('selected')){
				courseIndex = $(course).attr('courseIndex');
				$(course).remove();
				//break;
			}
		});
		if(courseIndex!==null){ //it deleted a course
			$('.lectureops').hide(); // since no course selected

			// lectures array size > courses array size
			// Updates lectures and courses array
			for(var i=0;i<courses.length;i++){
				if(courses[i][0]===courseIndex){
					var l = courses[i][2];
					for(var k=0;k<lectures.length;k++){
						for(var j=0;j<l.length;j++){
							if(l===lectures[k][0]){
								delete lectures[k]; 
							}
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
			var cid = $('#coursename').attr('courseIndex');
			var cname = $('#coursename').text();
			$('.courses').find('[courseIndex="'+cid+'"]').text(cname);
		//}
	});
	$('#coursename').change(function(){
		//if($(this).html()!=""){
			var cid = $('#coursename').attr('courseIndex');
			var cname = $('#coursename').text();
			$('.courses').find('[courseIndex="'+cid+'"]').text(cname);
		//}
	});
	$('#coursename').blur(function(){
		if($(this).val() === ""){
			$(this).val('Unnamed Course');
		}
	});

	// Eventlisteners on lectures

	$('#addLecture').click(function(){
		var cid = $('#coursename').attr('courseIndex');
		var uniqueId = lectures[cid].length + 100 * cid;
		/*jshint multistr: true */
		var str = '\
		<div class="panel panel-default lecture" lecture="'+uniqueId+'">\
			<div class="panel-heading">\
				<h4 class="panel-title">\
		        	<a contentEditable data-toggle="collapse" data-parent="#accordion" id="lecturename'+uniqueId+'" href="#'+uniqueId+'">\
		          		Unnamed Lecture\
		        	</a>\
		        	<a class="arrow" data-toggle="collapse" data-parent="#accordion" href="#'+uniqueId+'" style="float:right"><i class="fa fa-caret-down"></i></a>\
		      	</h4>\
		    </div>\
		    <div id="'+uniqueId+'" class="panel-collapse collapse">\
		     	<div class="panel-body">\
		      		<input type="file" id="file'+uniqueId+'" class="inputlecture"/><br/>\
		      		<button id="startLecture" class="btn btn-success">Start lecture</button>\
		      		<button id="saveLecture" class="btn btn-warning">Save lecture</button>\
		      		<button type="submit" id="deleteLecture" class="btn btn-danger" style="float:right">Delete Lecture</button>\
		      	</div>\
		    </div>\
		  </div>';

		$('.lectures').find('[courseIndex="'+cid+'"]').append(str);
		$('.lecture[lecture="'+uniqueId+'"] div h4 a').focus();
		selectText('lecturename'+uniqueId);

		lectures[cid].push({title: "Unnamed Lecture"});
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
		var theLect = $(this).closest('.lecture');
		saveLecture(parseInt($('#coursename').attr('courseIndex')), parseInt(theLect.attr('lecture')), $('#lecturename' + theLect.attr('lecture'))[0].innerHTML, true, false);

		$(this).closest('.lecture').remove();
	});
	
	$('.lectures').on('click','#startLecture',function(){
		var theLect = $(this).closest('.lecture');
		
		saveLecture(parseInt($('#coursename').attr('courseIndex')), parseInt(theLect.attr('lecture')), $('#lecturename' + theLect.attr('lecture'))[0].innerHTML, false, true);
		//for(var key in $(this).closest('.lecture').parent()) {
		//  console.log(key);
		//}

		//alert(($(this).closest('.lecture')).parent().data('lecture'));
	});

	$('.lectures').on('click','#saveLecture',function(){
		var theLect = $(this).closest('.lecture');
		//alert(theLect.attr('lecture'));
		//alert($('#lecturename' + theLect.attr('lecture'))[0].innerHTML);

		saveLecture(parseInt($('#coursename').attr('courseIndex')), parseInt(theLect.attr('lecture')), $('#lecturename' + theLect.attr('lecture'))[0].innerHTML, false, false);
	
		//for(var key in $(this).closest('.lecture').parent()) {
		//  console.log(key);
		//}

		//alert(($(this).closest('.lecture')).parent().data('lecture'));
	});


	function startLecture(cid, index) {
		window.location.href = PDFJS + "?file=/test/pdfs/uploads/" + lectures[cid][index - 100 * cid]._id + ".pdf";
	}

	function saveLecture(cid, index, name, del, call) {
		
		if(lectures[cid][index - 100 * cid]._id  !== undefined) {
			//alert(lectures[cid][index - 100 * cid]._id);
			var theAction;
			if(del) {
				theAction =  "delete"
			}
			else {
				theAction = "update";
			}

			$.ajax({
	  			'type': "POST",
			    'url': '../updateLecture/',
			    'data': {lectureId: lectures[cid][index - 100 * cid]._id,lectureTitle: name, action: theAction},
			    'success': function(jsonData) {
			    	if(call) {
		    			startLecture(cid, index);
		    		}	
			    }
			});
		}
		else {
			//alert( courses[cid]._id);
			var formData = new FormData();

			formData.append("courseId", courses[cid]._id);
			formData.append("lectureTitle", name);
			formData.append("pdf", ($('#file' + index))[0].files[0]);

			$.ajax({
  			'type': "POST",
		    'url': '../postLecture/',
		    'async': false,
        	'contentType': false,
            'processData': false,
		    'enctype': 'multipart/form-data',
		    'data' : formData,
		    //'data': {courseId: cid, lectureTitle:name, pdf: ($('#file' + index)).files},
		    'success': function(jsonData) {
		    //	alert(JSON.stringify(jsonData));
		    	alert(jsonData.errfor._id);
		    	lectures[cid][index - 100 * cid]._id = jsonData.errfor._id;
		    	if(call) {
		    		startLecture(cid, index);
		    	}
		    }
			});
		}
	}
});

function selectText(element) {
    var doc = document;
    var text = doc.getElementById(element);
    var range;
    var selection;    
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
}());
