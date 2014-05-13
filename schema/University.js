'use strict';

exports = module.exports = function(app, mongoose) {
  var univSchema = new mongoose.Schema({
    university: {type: String, unique: true},
    emailExtension: {type: String, unique: true},
    department: String
  }, { collection: "university"});

  univSchema.plugin(require('./plugins/pagedFind'));
  univSchema.index({ university: 1 }, { unique: true });
  univSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('University', univSchema);

};
