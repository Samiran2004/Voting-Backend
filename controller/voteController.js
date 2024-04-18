const User = require('../models/userModel');
const Candidate = require('../models/candidateModel');
const getVotingPage = async (req, res) => {
    try {
        const address = req.user.address.toLowerCase();
        const userId = req.user._id;
        const candidateList = await Candidate.find({ state: address });
        res.render('votePage', { candidateList });
    } catch (error) {
        res.render('error', { errorMessage: "Internal Server Error" });
    }
};

const vote = async (req, res) => {
    try {
        const candidateData = await Candidate.findById(req.body.candidate);
        const user = await User.findById(req.user._id);
        if (!candidateData || !user) {
            res.render('error', { errorMessage: "Candidate not found" });
        } else {
            if (candidateData.votedby.includes(user._id)) {
                res.render('error', { errorMessage: "You have already voted for this candidate" });
            } else {
                candidateData.votedby.push(user._id);
                user.isVoted = true;
                await candidateData.save();
                await user.save();
                res.clearCookie('token');
                res.render('home');
            }
        }
    } catch (error) {
        res.render('error', { errorMessage: 'Internal Server Error' })
    }
}

const getData = async (req, res) => {
    try {
        const candidateData = await Candidate.find();

        const candidateInfo = candidateData.map(candidate => {
            return {
                name: candidate.name.toUpperCase(),
                image: candidate.image,
                state: candidate.state.toUpperCase(),
                votedByCount: candidate.votedby.length,
                age: candidate.age,
                party:candidate.party
            };
        });
        const candidateInfoSorted = candidateInfo.sort((a, b) => b.votedByCount - a.votedByCount);
        res.render('getdata', { candidateData: candidateInfoSorted })
    } catch (error) {
        res.render('error', { errorMessage: "Internal Server Error" })
    }
}

module.exports = {
    getVotingPage,
    vote,
    getData
}