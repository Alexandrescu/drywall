(function() {

  'use strict';

//[0,"ADSA",[0,1]],[1,"Logic and Proof",[2]]];
// [lectureid,name,urlonserver]
var courses = [];
var lectures = [];
var token;
var json;
var liveLecs = [];
var currentLectureId;
var currentLectureIndex;
var PDFJS = "http://localhost:8888/web/viewer.html";

// when DOM elements have been made
$(document).ready(function(){
	var socketio = io.connect("http://localhost:3000");


var token = "09d4521023e02e39080b59c666e9851ece36da649ccac03bc93f011a4a64995f761a6b1660698aa87e263233ecdd7fe8";
            //var token = "token";
var lectureId = "536155e3a237c8a41ec643a6";
var questionId = "536154425b0b8767f5e6d2eb";


socketio.on("lectures", function(data) {
	$.each(data.lectures, function(i, item) {
		$('[name="'+ item + '"]').removeClass('btn-warning');
		$('[name="'+ item + '"]').addClass('btn-success');
	});
});

function setLive() {
    socketio.emit("setLive", {token: token, lectureId: lectureId});    
}
            
function setData(token, lectureId) {
    socketio.emit("connectLecture", {token: token, lectureId: lectureId});
}

socketio.on("questions", function(data) {
	if(data.success == false) {
		alert("Lecture is not live");
		return;
	}

    $('#panel' + currentLectureIndex).empty();
    $('#panel' + currentLectureIndex).append('<button id="joinLecture" class="btn btn-success">Join lecture</button><br>');
    
    $.each(data.result.question, function(i, item) {
    	var test = $('<button/>',
   		 {
        	text: item.content, 
        	class : 'btn btn-success',
       		click: function () {
    		addAnswer(item._id); }
   		 });

    	$('#panel' + currentLectureIndex).append(test).end();
    });
});

function addAnswer(questionId) {
    socketio.emit('addQuestion', {questionId : questionId, slideNumber: 1, height: 10});
}
		$.ajax({
		    'url': '../getToken/',
		    'data': {},
		    'success': function(jsonData) {
		      //Connect to socket.
		      token = jsonData.token;
		    },
		});

		$.ajax({
		    'url': '../getCourses/',
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
	
	function showLectures(cid) {
		var thisLectures = lectures[cid];
		$.each(thisLectures, function(entry,item){
//<input type="file" id="file'+uniqueId+'" class="inputlecture"/><br/>\
			var color = "warning";
			if(!jQuery.inArray( item._id, liveLecs)) {
				color = "success";
			}
			//alert(JSON.stringify(item));
			/*jshint multistr: true */
			var uniqueId = entry + cid * 100;
			var str = '\
			<div class="panel panel-default lecture" lecture="'+uniqueId+'">\
				<div class="panel-heading">\
					<h4 class="panel-title">\
			        	<a data-toggle="collapse" data-parent="#accordion" id="lecturename'+uniqueId+'" href="#'+uniqueId+'">\
			          		' + item.title.split('+').join(' ') + ' </a>\
			        	<a class="arrow" data-toggle="collapse" data-parent="#accordion" href="#'+uniqueId+'" style="float:right"><i class="fa fa-caret-down"></i></a>\
			      	</h4>\
			    </div>\
			    <div id="'+uniqueId+'" class="panel-collapse collapse">\
			     	<div class="panel-body" id="panel' + uniqueId +'">\
		      		<button id="joinLecture" name="'+ item._id +'" class="btn btn-warning">Join lecture</button><br>\
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
	
	$('.lectures').on('click','#joinLecture',function(){
		var theLect = $(this).closest('.lecture');
		var cid = parseInt($('#coursename').attr('courseIndex'));
		var index = parseInt(theLect.attr('lecture'));

		currentLectureId = lectures[cid][index - 100 * cid]._id;
		currentLectureIndex = index;
		setData(token, currentLectureId);
	});
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
