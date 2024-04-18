const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    state: {
        type: String
    },
    votedby: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            date: {
                type: Date,
                default: Date.now()
            }
        }
    ]
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;