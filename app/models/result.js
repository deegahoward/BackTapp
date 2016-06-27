/*
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ResultSetSchema = new Schema({

    SurveyID: {type: Schema.Types.ObjectId, ref: 'Survey'},
    Responses: [ResponseSchema]


});

var ResponseSchema = new Schema({

    QuestionID: {type: Schema.Types.ObjectId, ref: 'Question'},
    Value: String



})

module.exports = mongoose.model('Results', ResultSetSchema);*/
