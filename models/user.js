/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
        {
            email: {
                type: String,
                trim: true,
                index: true,
                unique: true,
                required: true
            },
            password: {
                type: String,
                required: true
            }
        },
        {
            timestamps: true
        },
        );

// eslint-disable-next-line func-names
userSchema.pre('save', async function (next) {
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', userSchema);
