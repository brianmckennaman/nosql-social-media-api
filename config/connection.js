const { connect, conneciton } =require('mongoose');

const connectionString = 
    process.env.MONGODB_URI;

connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = connection