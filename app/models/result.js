
var mongoose = require('mongoose');

var Schema = mongoose.Schema;



var ResponseSchema = new Schema({

    QuestionID: {type: Schema.Types.ObjectId, ref: 'Question'},
    AnswerID: [String]

});

var ResultSetSchema = new Schema({

    SurveyID: {type: Schema.Types.ObjectId, ref: 'Survey'},
    Responses: [ResponseSchema]

});





module.exports = mongoose.model('Results', ResultSetSchema);
