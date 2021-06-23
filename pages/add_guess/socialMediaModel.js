var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var socialMediaSchema = new Schema({
    facebook: String,
    instagram: String,
    telegram: String,
    blog: String,
    pinterest: String,
    updatedDate: Date
});

socialMediaSchema.pre('save', function (next) {
    var current = new Date();
    this.updatedDate = current;
    next();
})


var socialMediaSchema = mongoose.model('SocialMedia', socialMediaSchema);

module.exports = socialMediaSchema;