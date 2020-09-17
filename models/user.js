const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: String,
    password: String,
    isVerified: Boolean
})

module.exports = mongoose.model('User',userSchema);