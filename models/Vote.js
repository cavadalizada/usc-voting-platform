const { Schema, model } = require('mongoose')



const voteSchema = new Schema({
    user:[{
        type: Schema.Types.ObjectId,
        ref: 'user'
        }],
    candidate:[{
        type: Schema.Types.ObjectId,
        ref: 'candidate'
        }],
        cast_date: {
          type: Date,
          default: Date.now
        }
});

// Registers an Candidate with given values

const Vote = model('vote', voteSchema);


module.exports = Vote;