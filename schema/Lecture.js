'use strict';

exports = module.exports = function(app, mongoose) {

  var lectureSchema = new mongoose.Schema ({
    title: String,
    pdf: String,
    questions: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Question'} ]
  });

  lectureSchema.index({ title: 1 });
  lectureSchema.plugin(require('./plugins/pagedFind'));
  lectureSchema.set('autoIndex', (app.get('env') === 'development'));
  /** Here I should add indexes for the lectures */

  app.db.model('Lecture', lectureSchema);
};
