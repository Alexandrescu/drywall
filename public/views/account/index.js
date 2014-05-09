(function() {
  'use strict';

  // Load lectures into an array

// Examples for testing hardcoded [courseid,coursename,lectureids in order]
// we may want to reorder courses so id=/=index is possible. hence being stored
var courses = [[0,"ADSA",[0,1]],[1,"Logic and Proof",[2]]];
var lectures;

//getAllCourses(); // TODO input university
//getaStudentsCourses(); // TODO input student ID

// when DOM elements have been made
$(document).ready(function(){

	function addCourseToView(id,course){
		$('.courses').append('<div class="course panel panel-default" courseid="'+id+'">'+course+'<button type="submit" style="margin-left:20px" class="btn btn-default removeCourse">Remove</button></div>');
	}
	// Loads in the courses from the courses array
	$.each(courses, function(index,item){
		var course = item[1];
		addCourseToView(index,item);
	});
	$('.courses').on("click",".removeCourse",function(){
		removeCourseFromStudent($(this).parent().attr('courseid'));
		$(this).parent().remove();
	});
	$('.allcourses').on("click",".addCourse",function(){
		addCourseToStudent($(this).parent().attr('courseid'));

		addCourseToView($(this).parent().attr('courseid'),$(this).parent().text().replace('Add',""));
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
	$('#courseNameSearch').change(function(){
		var query = $(this).val();
		query = query.split(' ');
		console.log(query);
		$('.allcourse').show();
		$.each($('.allcourse'),function(index,course){
			var test = false;
			$.each(query,function(i,word){
				if(course.indexOf(word)>=0){
					test=true;
				}
			});
			if(!test){
				course.hide();
			}
		});
	});
	$('#courseNameSearch').keyup(function(){
		var query = $(this).val();
		query = query.split(' ');
		console.log(query);
		$('.allcourse').show();
		$.each($('.allcourse'),function(index,course){
			var test = false;
			$.each(query,function(i,word){
				if(course.indexOf(word)>=0){
					test=true;
				}
			});
			if(!test){
				course.hide();
			}
		});
	});

	$('#deleteCourse').click(function(){
		var courseid = null;
		$.each($('.courses').children(), function(index,course){
			if($(course).hasClass('selected')){
				courseid = $(course).attr('courseid');
				$(course).remove();
				//break;
			}
		});
		if(courseid!==null){ //it deleted a course
			$('.lectureops').hide(); // since no course selected

			// lectures array size > courses array size
			// Updates lectures and courses array
			for(var i=0;i<courses.length;i++){
				if(courses[i][0]===courseid){
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
	
});

function addCourseToStudent(courseid){
	// TODO AJAX REQUEST send course
}

function removeCourseFromStudent(courseid){
	// TODO AJAX REQUEST send course
}


function getAllCourses(){
	// TODO AJAX REQUEST pass university

	var t=$('.allcourses');
	t.html("");
	var str = "";
	// Each course in j add to str and add addcoursebutton
	// give them classnames allcourse

	t.html(str);
}

function getaStudentsCourses(){
	// TODO AJAX REQUEST pass userid return [courseid]

	// var t=$('.courses');
	// t.html("");
	// var str = "";
	// Each course in j add to str and add addcoursebutton
	//addCourseToView(id,name);
}

// TODO CALL whenever a course goes live 
function makeLive(courseid,url){
		var x = $('.course[courseid="'+courseid+'"');
		x.html("<a class='btn btn-default' style='color:#B22222' href='"+url+"'><i class='fa fa-circle'></i> Live</a>   "+x.html());
}

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

  $('.day-of-year').text(moment().format('DDD'));
  $('.day-of-month').text(moment().format('D'));
  $('.week-of-year').text(moment().format('w'));
  $('.day-of-week').text(moment().format('d'));
  $('.week-year').text(moment().format('gg'));
  $('.hour-of-day').text(moment().format('H'));
}());
