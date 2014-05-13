/** Adding sockets - can't be bothered to make it a new file */

var socketio = io.connect("http://localhost:3000");

//var token = "09d4521023e02e39080b59c666e9851ece36da649ccac03bc93f011a4a64995f761a6b1660698aa87e263233ecdd7fe8";
            //var token = "token";
//var lectureId = "536155e3a237c8a41ec643a6";

function setLiveLecture(lectureId) {
	var arr = lectureId.split("/");
	var id = (arr[arr.length - 1].split("."))[0];
	socketio.emit("setLive", {lectureId: id});    
}


socketio.on("newQuestion", function(data) {
	writeQuestion(1, 1, data.question.content, 0, 0.51, 1, null);
	//document.getElementById("newQuestion").innerHTML += JSON.stringify(data, undefined, 2);
});

/* API FOR SHOWING QUESTIONS */

//page is an integer greater than 0
//startposition is a percentage in decimal form (0.51) of page height
//question is the question
//numasked is how often this question was asked for this chunk of text

var questionsExisting = [];
function writeQuestion(id,page,question,startposition,endposition,numasked,colorscheme){
	questionsExisting.push([id,page,question,startposition,endposition,numasked,colorscheme]);
	var ifbar = document.getElementById("instantFeedback"+page);
	var newQ = document.createElement('div');
	newQ.className += "instantFeedbackQuestion ";
	newQ.className += colorscheme;
	newQ.id = "q"+id;
	newQ.innerHTML = question;
	newQ.style.position = "relative";
	var x = parseInt(ifbar.style.height,10)*startposition;
	newQ.style.top = x+"px";
	newQ.style.left = "0px";

	console.log(newQ.style.height);
	var newL = document.createElement('div');
	newL.className += "instantFeedbackLine ";
	newL.className += colorscheme;
	newL.style.top = x+15+"px";
	newL.style.left = "-30px";
	ifbar.appendChild(newL);
	ifbar.appendChild(newQ);	
}

function writeExistingQuestion(id,page,question,startposition,endposition,numasked,colorscheme){
	if(document.getElementById("q"+id)==null){
	var ifbar = document.getElementById("instantFeedback"+page);
	var newQ = document.createElement('div');
	newQ.className += "instantFeedbackQuestion ";
	newQ.className += colorscheme;
	newQ.id = "q"+id;
	newQ.innerHTML = question;
	newQ.style.position = "relative";
	var x = parseInt(ifbar.style.height,10)*startposition;
	newQ.style.top = x+"px";
	newQ.style.left = "0px";

	console.log(newQ.style.height);
	var newL = document.createElement('div');
	newL.className += "instantFeedbackLine ";
	newL.className += colorscheme;
	newL.style.top = x+15+"px";
	newL.style.left = "-30px";
	ifbar.appendChild(newL);
	ifbar.appendChild(newQ);
	}	
}

function rerenderQuestions(){
	console.log();
	// maybe need to empty instanFeedbackXs before just to be safe
	for(var i = 0;i<questionsExisting.length;i++){
		writeExistingQuestion(
			questionsExisting[i][0],
			questionsExisting[i][1],
			questionsExisting[i][2],
			questionsExisting[i][3],
			questionsExisting[i][4],
			questionsExisting[i][5],
			questionsExisting[i][6]
		)
	}
}