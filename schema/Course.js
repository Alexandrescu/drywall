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
    lectures : [{  type: mongoose.SchemaTypes.ObjectId, ref: 'Lecture'  }]
  });

  courseSchema.plugin(require('./plugins/pagedFind'));
  courseSchema.set('autoIndex', (app.get('env') === 'development'));

  /** Here I should add indexes for course */

  app.db.model('Course', courseSchema);
};
