const { Thought, User } = require('../models');

module.exports = {
    getThoughts(req, res) {
      Thought.find()
        .then((thoughts) => res.json(thoughts))
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },

    getSingleThought(req, res) {
      Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .then(async (thought) =>
          !thought
            ? res.status(404).json({ message: 'No thought with that id found' })
            : res.json(thought)
        )
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },

    createThought(req, res) {
      Thought.create(req.body)
        .then((thought) => {
          User.findOneAndUpdate({_id: req.body.userId}, { $push: {thoughts: thought._id} })
          .then((user) => 
            !user
            ? res.status(404).json({ message: 'No user with that id found'})
            : res.json(user)
          )
         
        })
        .catch((err) => res.status(500).json(err));
    },

    deleteThought(req, res) {
      Thought.findOneAndRemove({ _id: req.params.thoughtId })
        .then((thought) =>
          !thought
            ? res.status(404).json({ message: 'No thought with that id found' })
            : User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
              )
        )
        .then((thought) =>
          !thought
            ? res.status(404).json({
                message: 'Thought deleted, but no user found',
              })
            : res.json({ message: 'Thought successfully deleted' })
        )
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    },
  
    addReaction(req, res) {
      console.log(req.body, req.params);
      Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: {
          reactionBody: req.body.reactionBody, username: req.body.username
        }} },
        { runValidators: true, new: true }
      )
        .then((thought) =>
          !thought
            ? res
                .status(404)
                .json({ message: 'No thought found with that ID :(' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

    removeReaction(req, res) {
      Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reaction: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      )
        .then((thought) =>
          !thought
            ? res
                .status(404)
                .json({ message: 'No thought found with that ID :(' })
            : res.json(student)
        )
        .catch((err) => res.status(500).json(err));
    },
  };