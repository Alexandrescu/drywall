module.exports.getToken = function(req, res) {
  res.send({token: req.user.token});
}

module.exports.updateLecture = function (req, res) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function (){
    if(!req.body.lectureId) {
      workflow.outcome.errfor.lectureId = 'required';
    }

    if(!req.body.lectureTitle) {
      workflow.outcome.errfor.lectureTitle = 'required';
    }

    if(!req.body.action) {
      workflow.outcome.errfor.action = 'required';
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }
    
    workflow.emit('duplicateLectureCheck');
  });

  /* Need to add option to check if user is Lecturer */

  workflow.on('duplicateLectureCheck', function() {
    var fieldsToSet = {
      _id: req.body.lectureId
    };
    
    req.app.db.models.Lecture.findOne(fieldsToSet, function(err, lecture) {
      if (err) {
        return workflow.emit('exception', err);
      }
      if (!lecture) {
        workflow.outcome.errfor.course = 'Lecture doesnt exists';
        return workflow.emit('response');
      }

      if(req.body.action == "delete") {
        lecture.remove();

        return workflow.emit('response');
      }

      else if(req.body.action = "update") {

        lecture.title = req.body.lectureTitle;
        lecture.save();

        workflow.emit('response');
      }
      
    });
  });

  workflow.emit('validate');
}

module.exports.updateCourse = function (req, res) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function (){
    if(!req.body.courseName) {
      workflow.outcome.errfor.courseName = 'required';
    }

    if(!req.body.courseId) {
      workflow.outcome.errfor.courseId = 'required';
    }

    if(!req.body.action) {
      workflow.outcome.errfor.action = 'required (delete/update)';
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }
    workflow.emit('duplicateCourseCheck')
    //workflow.emit('createCourse');
  });

  /* Need to add option to check if user is Lecturer */

  workflow.on('duplicateCourseCheck', function() {
    var fieldsToSet = {
      _id: req.body.courseId
    };
    
    req.app.db.models.Course.findOne(fieldsToSet, function(err, course) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (!course) {
        workflow.outcome.errfor.course = 'Course doesnt exists';
        return workflow.emit('response');
      }
      if(req.body.action == "delete") {
        course.remove();

        return workflow.emit('response');
      }
      else if(req.body.action = "update") {
        req.app.db.models.Course.findOne({name: req.body.courseName}, function (err, course2) {
          if(err) {
           return workflow.emit('exception', err);
          }

          if (course2) {
            workflow.outcome.errfor.course = 'Course name already exists';
            return workflow.emit('response');
          }

          course.name = req.body.courseName;
          course.save();

          workflow.emit('response');
        });
      }
      
    });
  });

  workflow.emit('validate');
}

module.exports.getMyCourses = function(req, res) {
  var workflow = req.app.utility.apiflow(req, res);

  workflow.on('validate', function() {
    workflow.user = req.user;
    req.app.db.models.Course.find({creator: req.user._id }).
    populate("department").
    populate("creator", "username").
    populate("lectures").
    exec(function(err, courses){
      if(err) 
        return workflow.emit('exception', err);

      workflow.outcome.response.courses = courses;
      workflow.emit('response');
    });
  });

  workflow.emit('validate');
}

module.exports.getCourses = function (req, res) {
  var workflow = req.app.utility.apiflow(req, res);

  workflow.on('validate', function() {

  	workflow.user = req.user;
  	req.app.db.models.Course.find({department: {$in : req.user.institution }}).
    populate("department").
    populate("creator", "username").
    populate("lectures").
    exec(function(err, courses){
  		if(err) 
  			return workflow.emit('exception', err);

  		workflow.outcome.response.courses = courses;
  		workflow.emit('response');
  	});
  });

  workflow.emit('validate');
 
}

module.exports.postCourse = function (req, res) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function (){
  	if(!req.body.courseName) {
  		workflow.outcome.errfor.courseName = 'required';
  	}

  	if(!req.body.year) {
  		workflow.outcome.errfor.year = 'required';
  	}

  	if (workflow.hasErrors()) {
      return workflow.emit('response');
    }
    workflow.emit('duplicateCourseCheck')
    //workflow.emit('createCourse');
  });

  /* Need to add option to check if user is Lecturer */

  workflow.on('duplicateCourseCheck', function() {
  	var fieldsToSet = {
      name: req.body.courseName,
      year: req.body.year,
      department: req.user.institution[0],
      creator: req.user._id
  	};
  	
    req.app.db.models.Course.findOne(fieldsToSet, function(err, course) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (course) {
        workflow.outcome.errfor.course = 'Course already exists';
        return workflow.emit('response');
      }
      workflow.emit('createCourse');
    });
  });

  workflow.on('createCourse', function() {
    var fieldsToSet = {
      name: req.body.courseName,
      year: req.body.year,
      department: req.user.institution[0],
      creator: req.user._id
    };
    req.app.db.models.Course.create(fieldsToSet, function(err, course) {
    	if (err) {
        	return workflow.emit('exception', err);
        }
        workflow.emit('response');
    });
  });

  workflow.emit('validate');
}

module.exports.addLecture = function (req, res) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function (){
    if(!req.body.courseId) {
      workflow.outcome.errfor.courseId = 'required';
    }

    if(!req.body.lectureTitle) {
      workflow.outcome.errfor.lectureTitle = 'required';
    }

    if(!req.hasOwnProperty('files') || !req.files.pdf) {
      workflow.outcome.errfor.pdf = 'required';
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }
    
    workflow.emit('checkDuplicates');
  });

  workflow.on('checkDuplicates', function () {
    var fieldsToSet = {
      _id: req.body.courseId
      //lectures.title: req.body.lectureTitle
    };

    req.app.db.models.Course.findOne(fieldsToSet).populate("lectures", "title").exec(function(err, course) {
      if(err) {
        return workflow.emit('exception', err);
      }

      course.lectures.forEach(function(entry) {
        if(entry.title == req.body.lectureTitle)
          workflow.outcome.errfor.lectureTitle = 'Aleardy exists.';  
      });

      if(workflow.hasErrors()) {
        return workflow.emit('response');
      }
      workflow.emit('addLecture');
    });
  });

  workflow.on('addLecture', function () {
    var fieldsToSet = {
      _id: req.body.courseId
    };

    req.app.db.models.Course.findOne(fieldsToSet, function(err, course) {
      if(err) {
        return workflow.emit('exception', err);
      }

      if(!course.creator.equals(req.user._id)) {
        workflow.outcome.errfor.permission = 'denied';
        return workflow.emit('response');
      }

      /**
        PDF feature needs update here 
      **/
      var lecture = {
        title: req.body.lectureTitle,
        course: course._id,
        questions: []
      };



      req.app.db.models.Lecture.create(lecture, function(err, newLecture){
        if(err) 
          return workflow.emit('exception', err);

        req.app.db.models.Course.findByIdAndUpdate(course._id, 
          {$push: {lectures : newLecture._id}}, 
          {safe: true, upsert: true},
          function(err, model) {
            if(err) {
              return workflow.emit('exception', err);
            }
            var fs = require('fs');
            //Moving the file around
              

            /* fs.rename(req.files.pdf.path, newPath, function (err) {
              if (err) throw err;
              console.log('renamed complete');

              workflow.emit('response');
            }); */

            fs.readFile(req.files.pdf.path, function (err, data) {
               if(err) {
                  return workflow.emit('exception', err);
                }
              var newPath = __dirname + "\\pdfjs\\test\\pdfs\\uploads\\" + newLecture._id + ".pdf";
              console.log(req.files.pdf.path);
              console.log(newPath);
              console.log(data);
              fs.writeFile(newPath, data, function (err) {
                if(err) {
                  return workflow.emit('exception', err);
                }
                workflow.outcome.errfor._id = newLecture._id;
                workflow.emit('response');
                //res.redirect("back");
              });
            });

          }
        );
      });
    });
  });

  workflow.emit('validate');
}