
alert("HEREE");


            socketio.on("news", function(data) {
                document.getElementById("chatlog").innerHTML = ("<hr/>" +
                data['hello'] + document.getElementById("chatlog").innerHTML);
            });
            
            socketio.on("newQuestion", function(data) {
                document.getElementById("newQuestion").innerHTML += JSON.stringify(data, undefined, 2);
            });

            socketio.on("responseAddQuestion", function (data) {
                document.getElementById("questionsReply").innerHTML = JSON.stringify(data, undefined, 2);
            });

            socketio.on("lecturerDead", function (data) {
                document.getElementById("byeLecturer").innerHTML = "Lecturer down.";
            });



            function changeToken() {
                token = document.getElementById("token").value;
            }

            function changeLecture() {
                lectureId = document.getElementById("lecId").value;
            }

            function changeQuestion() {
                questionId = document.getElementById("qId").value;
            }