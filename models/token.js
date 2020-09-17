const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
    email: String,
    token: String
})

module.exports = mongoose.model('Token',tokenSchema);