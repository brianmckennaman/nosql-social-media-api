const { User, Thought} = require('../models');

module.exports = {
    getUsers(req, res) {
        User.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },

    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .populate(thoughts)
            .then((user) => 
                !user
                    ? res.status(404).json({ message: 'No user with that id found '})
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that id found' })
                    : Thought.deleteMany({ _id: { $in: user.thoughts } })
                    )
            .then(() => res.json({ message: 'User and thoughts successfully deleted' }))
            .catch((err) => res.status(500).json(err));
    },

    updateUser(req, res) {
        User.findByIdAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) => 
                !user
                    ? res.status(404).json({ message: 'No user with that id found' })
                    : res.json(user)
                    )
            .catch((err) => res.status(500).json(err));
    },

    addFriend(req, res) {
        User.findOneAndUpdate(
          { _id: req.params.userId },
          { $addToSet: { friends: req.params.friendId } },
          { runValidators: true, new: true }
        )
          .then((user) =>
            !user
              ? res
                  .status(404)
                  .json({ message: 'No user found with that ID :(' })
              : res.json(user)
          )
          .catch((err) => res.status(500).json(err));
        },

    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: { friendId: req.params.friendId } } },
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