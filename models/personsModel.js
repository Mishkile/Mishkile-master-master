const mongoose = require('mongoose');

let usersSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
    created: String,
    transactionsPerDay: Number

});

module.exports = mongoose.model('users', usersSchema);

