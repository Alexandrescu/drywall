'use strict';

exports = module.exports = function(app, mongoose) {

  var lectureSchema = new mongoose.Schema ({
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
      pdf: String,
      questions: [{
        content: String,
        slideNumber: Number,
        whoAsked: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
        answer: String,
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
