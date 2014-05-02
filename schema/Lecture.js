'use strict';

exports = module.exports = function(app, mongoose) {

  var lectureSchema = new mongoose.Schema ({
    title: String,
    course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
    pdf: String,
    questions: [ {
      question: {type: mongoose.Schema.Types.ObjectId, ref: 'Question'},
      user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      height: Number,
      slideNumber: Number
    }]
  });

  lectureSchema.index({ title: 1 });
  lectureSchema.plugin(require('./plugins/pagedFind'));
  lectureSchema.set('autoIndex', (app.get('env') === 'development'));
  /** Here I should add indexes for the lectures */

  app.db.model('Lecture', lectureSchema);
};
