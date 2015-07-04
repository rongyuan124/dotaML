/**
 * Created by spin on 7/3/15.
 */
var mongoose = require('mongoose');

var MatchSchema = new mongoose.Schema({

    _id : String,
    time: {type:Date,default:Date.now},
    radiant_team : mongoose.Schema.Types.Mixed,
    dire_team : mongoose.Schema.Types.Mixed,
    radiant_picks : mongoose.Schema.Types.Mixed,
    dire_picks : mongoose.Schema.Types.Mixed,
    prediction: Number,
    result: Number
});

module.exports = mongoose.model('Match',MatchSchema);