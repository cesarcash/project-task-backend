const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { HttpStatus, HttpResponseMessage } = require('../enums/http');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true
  },
  email: {
    type: String,
    minLength: 2,
    maxLength: 20,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: (props) => `${props.value} is not a valid email address`,
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    select: false
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/.test(v);
      },
      message: (props) => `${props.value} Invalid avatar URL`,
    },
    default: 'https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png',
  },
});

userSchema.statics.findUserByCredentials = async function(email,password){

  const user = await this.findOne({email});
  if(!user){
    const error = new Error(HttpResponseMessage.UNAUTHORIZED);
    error.statusCode = HttpStatus.UNAUTHORIZED;
    throw error;
  }

  const matched = await bcrypt.compare(password, user.password);
  if(!matched){
    const error = new Error(HttpResponseMessage.UNAUTHORIZED);
    error.statusCode = HttpStatus.UNAUTHORIZED;
    throw error;
  }

  return user;

}

module.exports = mongoose.model('User', userSchema);