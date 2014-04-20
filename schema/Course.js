'use strict';

exports = module.exports = function(app, mongoose) {

  var courseSchema = new mongoose.Schema ({
    details: {
      type: {
        name : String,
        year : Number,
        department: {type: mongoose.Schema.Types.ObjectId, ref: 'University'},
        creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
      }
    },
    lectures : [{
      title: String,
      questions: [{
        content: String,
        slideNumber: Number,
        whoAsked: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
        answers: String,
        votes: Number,
        whoVoted: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
      }]
    }],
  });

  courseSchema.plugin(require('./plugins/pagedFind'));
  courseSchema.set('autoIndex', (app.get('env') === 'development'));

  /** Here I should add indexes for course */

  app.db.model('Course', courseSchema);
  console.log("Goes here");

};
