const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const userSchema = new Schema({
    email: {
        type: String,
        require: true,
    },
    first_name: {
        type: String,
        require: true,
    },
    last_name: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    date_of_birth: {
        type: String,
        require: true,
    },
});

/* ====== Saving user details when registration take place ======= */
userSchema.pre('save', function (next) {
    const user = this;
    if (this.isModified('password') || this.isNew)
        bcrypt.genSalt(10, function (error, salt) {
            if (error) return next(error);
            bcrypt.hash(user.password, salt, function (error, hash) {
                if (error) return next(error)
                user.password = hash;
                next();
            });
        });
    else return next();
});


/* ========== Comparing the password when signin take place ========== */
userSchema.methods.comparePassword = (password, callback) => {
    bcrypt.compare(password, this.password, (error, isMatch) => {
        if (error)
            return callback(error);
        callback(null, isMatch);
    });
};

let User = mongoose.model('user', userSchema);

module.exports = User;
