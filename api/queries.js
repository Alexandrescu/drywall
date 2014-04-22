module.exports.getCourses = function (req, res) {
  var workflow = req.app.utility.apiflow(req, res);

  workflow.on('validate', function() {

  	workflow.user = req.user;
  	req.app.db.models.Course.find({"details.department": {$in : req.user.institution }}, function(err, questions){
  		if(err) 
  			return workflow.emit('exception', err);

  		workflow.outcome.response.questions = questions;
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


  workflow.on('duplicateCourseCheck', function() {
  	var fieldsToSet = {
      "details.name": req.body.courseName,
      "details.year": req.body.year,
      "details.department": req.user.institution[0],
      "details.creator": req.user._id
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
      details: {
      	name : req.body.courseName,
      	year : req.body.year,
      	department: req.user.institution[0],
      	creator: req.user._id,
      	/* this needs to be modified */
      	pdf: ""
      }
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