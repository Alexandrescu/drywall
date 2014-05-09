var socketio = io.connect("http://localhost:3000");

            var token = "09d4521023e02e39080b59c666e9851ece36da649ccac03bc93f011a4a64995f761a6b1660698aa87e263233ecdd7fe8";
            //var token = "token";
            var lectureId = "536155e3a237c8a41ec643a6";
            var questionId = "536154425b0b8767f5e6d2eb";

            function setLive() {
                socketio.emit("setLive", {token: token, lectureId: lectureId});    
            }
            
            function setData() {
                socketio.emit("connectLecture", {token: token, lectureId: lectureId});
            }

            socketio.on("news", function(data) {
                document.getElementById("chatlog").innerHTML = ("<hr/>" +
                data['hello'] + document.getElementById("chatlog").innerHTML);
            });
            
            socketio.on("newQuestion", function(data) {
                document.getElementById("newQuestion").innerHTML += JSON.stringify(data, undefined, 2);
            });
            
            socketio.on("questions", function(data) {
                document.getElementById("questions").innerHTML = JSON.stringify(data, undefined, 2);
                document.getElementById("byeLecturer").innerHTML = "";
            });

            socketio.on("responseAddQuestion", function (data) {
                document.getElementById("questionsReply").innerHTML = JSON.stringify(data, undefined, 2);
            });

            socketio.on("lecturerDead", function (data) {
                document.getElementById("byeLecturer").innerHTML = "Lecturer down.";
            });

            function addAnswer() {
                socketio.emit('addQuestion', {questionId : questionId, slideNumber: 1, height: 10});
            }

            function changeToken() {
                token = document.getElementById("token").value;
            }

            function changeLecture() {
                token = document.getElementById("lecId").value;
            }

            function changeQuestion() {
                token = document.getElementById("qId").value;
            }