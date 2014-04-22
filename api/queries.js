module.exports.getCourses = function (req, res) {
  var workflow = req.app.utility.apiflow(req, res);

  workflow.on('validate', function() {

  	workflow.user = req.user;
  	req.app.db.models.Course.find({department: {$in : req.user.institution }}, function(err, courses){
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
        pdf: "",
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

      
            workflow.emit('response');
          }
        );
      });
    });
  });

  workflow.emit('validate');
}