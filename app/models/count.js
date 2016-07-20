var mongoose = require('mongoose');

var Schema = mongoose.Schema;



var CountSchema = new Schema({

    id: String,
    Count: Number,
    StartTimeArray: [Date]

});



module.exports = mongoose.model('Count', CountSchema);
