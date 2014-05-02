'use strict';

exports = module.exports = function(app, mongoose) {

  var questionSchema = new mongoose.Schema ({
    content: String
  });

  questionSchema.index({ content: 1 });
  questionSchema.plugin(require('./plugins/pagedFind'));
  questionSchema.set('autoIndex', (app.get('env') === 'development'));
  /** Here I should add indexes for the questions */

  app.db.model('Question', questionSchema);
};
