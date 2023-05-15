const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    image: {
        type: String,
        default: function () {
            return this._id.toString()
        }
    }
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (err) {
            return next(err);
        }
    }
    next();
});

module.exports = mongoose.model('User', userSchema);