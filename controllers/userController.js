const { User, Thought} = require('../models');

module.exports = {
    getUsers(req, res) {
        User.find()
            .then((users) => res.join(users))
            .catch((err) => res.status(500).json(err));
    },

    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .then((user) => 
                !user
                    ? res.status(404).json({ message: 'No user with that id found '})
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.join(user))
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
};