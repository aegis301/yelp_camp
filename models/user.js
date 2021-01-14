const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose); // plugs in username and password and additional method to our schema, avoids double usernames, does a lot of stuff for us

module.exports = mongoose.model('User', UserSchema);