
var mongoose = require('mongoose');

var Schema = mongoose.Schema;



var ResponseSchema = new Schema({

    QuestionID: {type: Schema.Types.ObjectId, ref: 'Question'},
    Answers: {}

});

var ResultSetSchema = new Schema({

    SurveyID: {type: Schema.Types.ObjectId, ref: 'Survey'},
    TimeStart: String,
    TimeFinish: String,
    Responses: [ResponseSchema]

});





module.exports = mongoose.model('Results', ResultSetSchema);
