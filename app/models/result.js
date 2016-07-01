
var mongoose = require('mongoose');

var Schema = mongoose.Schema;



var ResponseSchema = new Schema({

    QuestionID: String,//{type: Schema.Types.ObjectId, ref: 'Question'},
    AnswerID: String

});

var ResultSetSchema = new Schema({

    SurveyID: String,//{type: Schema.Types.ObjectId, ref: 'Survey'},
    Responses: [ResponseSchema]

});



module.exports = mongoose.model('Results', ResultSetSchema);
