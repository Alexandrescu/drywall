module.exports.getCourses = function (req, res) {
  //res.json(req.user);
  req.app.db.models.Course.find({"details.department": {$in : req.user.institution }}, function(err, questions){
  	res.json(questions);
  });
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

    workflow.emit('createCourse');
  });

  workflow.on('createCourse', function() {
  	var fieldsToSet = {
      details: {
      	name : req.body.courseName,
      	year : req.body.year,
      	department: req.user.institution[0],
      	creator: req.user._id
      }
  	};
    req.app.db.models.Course.create(fieldsToSet, function(err, course) {
    	if (err) {
        	return workflow.emit('exception', err);
        }

        workflow.course = course;
        workflow.emit('response');
    });
  });

  workflow.emit('validate');
}