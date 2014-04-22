'use strict';

exports = module.exports = function(app, mongoose) {

  var questionSchema = new mongoose.Schema ({
    content: String,
    slideNumber: Number,
    whoAsked: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
    answer: String,
    votes: Number,
    whoVoted: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
  });

  questionSchema.index({ content: 1 });
  questionSchema.plugin(require('./plugins/pagedFind'));
  questionSchema.set('autoIndex', (app.get('env') === 'development'));
  /** Here I should add indexes for the questions */

  app.db.model('Question', questionSchema);
};
