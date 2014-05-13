module.exports = function(io, mongoose, app) {
  var clients = app.basket;
  //var liveLectures = app.liveLectures;

  io.sockets.on('connection', function (socket) {
    //var workflow = app.utility.apiflow(req, res);

    var lecs = [];

    for(entry in app.liveLectures) {
      lecs.push(entry);
      console.log(entry);
    } 

    socket.emit('lectures', {lectures: lecs});
    
    socket.on('setLive', function(data) {
      //if(data.hasOwnProperty("token") && data.hasOwnProperty("lectureId")) {
      if(data.hasOwnProperty("lectureId")) {
        console.log("going in");

        app.db.models.Lecture.
        findOne({_id: data.lectureId}).
        populate("course", "creator").
        exec(function(err, lecture) {

          if(lecture)
            app.db.models.User.populate(lecture, "course.creator", function(user, err){

              clients[socket.id] = data;

              //if(lecture.course.creator.token == data.token) {
                socket.set(data.lectureId, socket.id);
                app.liveLectures[data.lectureId] = socket.id;

                socket.broadcast.emit('lectureLive', {lectureId: data.lectureId});
                console.log("reaches");
              //}
            

            });

      
        });
      
      }
    });

    //This will add you to the lecture and give you back questions
    socket.on('connectLecture', function(data) {
      var response = {
        success: false,
        result: {},
        errors : []
      };
        
      if(data.hasOwnProperty("token") && data.hasOwnProperty("lectureId") && app.liveLectures.hasOwnProperty(data.lectureId)){
        clients[socket.id] = data;

        for(entry in clients) {
          console.log(entry + " has token " + clients[entry].token + " and lectureId " + clients[entry].lectureId);  
        }
        for(entry in app.liveLectures) {
          console.log("lecture" + entry);
        } 

        app.db.models.Question.find({}, function (err, questions) {
          
          if(err) {
            response.errors.push(err);
            return socket.emit('questions', response);
          }

          response.success = true;
          if(questions) response.result.question = questions;

          response.result.lectures = JSON.stringify(app.liveLectures);

          return socket.emit('questions', response);
        });
      }
      else {
        response.errors.push({notFound: "Property or live lecture"});
        socket.emit('questions', response);
      }
    });



    socket.on('addQuestion', function(data) {
      
      var response = {
          success: false,
          errors : []
      };

      if(clients[socket.id] && data.hasOwnProperty("questionId") && data.hasOwnProperty("slideNumber") && data.hasOwnProperty("height") ) {
        var client = clients[socket.id];

        if(!client.hasOwnProperty("token") && !client.hasOwnProperty("lectureId") ) return socket.emit("responseAddQuestion", response);

        app.db.models.User.findOne({token: client.token}, function(err, user) {
          if(user) {
            /* User is valid */
          
            console.log("User is valid");
            app.db.models.Lecture.findOne({ _id: client.lectureId}, function(err, lecture) {
              
              if(err) {
                response.errors.push(err);
                return socket.emit("responseAddQuestion", response);
              }
              if(lecture) {
                /* Lecture if valid */
                console.log("found lecture");
                app.db.models.Question.findOne({ _id:data.questionId}, function(err, foundedQuestion) {
                  if(err) {
                    response.errors.push(err);
                    return socket.emit("responseAddQuestion", response);
                  }
                  if(foundedQuestion) {
                    var newQuestion = {
                      question: foundedQuestion,
                      user: user._id,
                      height: data.height,
                      slideNumber: data.slideNumber
                    };

                    lecture.questions.push(newQuestion);
                    lecture.save();
                    response.success = true;
                    io.sockets.socket(app.liveLectures[client.lectureId]).emit("newQuestion", newQuestion);
                  }
                  else response.errors.push({notFound : "question"});

                  socket.emit("responseAddQuestion", response);
                });
              }
              else {
                response.errors.push({notFound : "lecture"});
                return socket.emit("responseAddQuestion", response);
              }
            });
          }
          else {
            response.errors.push({notFound : "user"});
            return socket.emit("responseAddQuestion", response);
          }
        });
      }

    });

		//socket.emit('news', {hello : 'hi'});
	
		//Debug purposes
		socket.on('pulse', function(data) {
      socket.emit('news', {hello : data.message});
    });

    socket.on('disconnect', function() {
      var client = clients[socket.id];
      
      if(client)    
        socket.get(client.lectureId, function(err, socketId){
          if(socketId == socket.id) {
            delete app.liveLectures[client.lectureId];
            for(entry in clients) {
              if(clients[entry].lectureId == client.lectureId) 
                io.sockets.socket(entry).emit("lecturerDead", {});
            }
          }
        });

      delete clients[socket.id];
    });
		
	});
};
