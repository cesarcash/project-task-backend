const User = require('../models/user');
const { HttpStatus, HttpResponseMessage } = require('../enums/http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthError = require('../middleware/errors/AuthError');
const NotFoundError = require('../middleware/errors/NotFoundError');
const BadRequestError = require('../middleware/errors/BadRequestError');

require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = async (req, res, next) => {

  try {

    if (!req.user) {
      return next(new AuthError(HttpResponseMessage.UNAUTHORIZED));
    }

    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return next(new NotFoundError(HttpResponseMessage.NOT_FOUND));
    }

    res.status(HttpStatus.OK).json({name: user.name, email: user.email, avatar: user.avatar, _id: user._id});

  }catch(e){
    next(e);
  }

}

const getUserById = async (req, res, next) => {

  const { userId } = req.params;

  try{

    const user = await User.findById(userId).select('-password');
    if(!user){
      return next(new NotFoundError(HttpResponseMessage.NOT_FOUND));
    }

    res.status(HttpStatus.OK).json({data: user});

  }catch(e){
    next(e);
  }

}

const updateUser = async (req, res, next) => {

  try{

    const userId = req.user._id;
    const {name, email, password} = req.body;
    if(!name || !email){
      return next(new BadRequestError(HttpResponseMessage.BAD_REQUEST));
    }

    const updateData = {name, email};

    if(password){
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(userId, updateData, {new: true})
    .orFail(() => {
      return next(new NotFoundError(HttpResponseMessage.NOT_FOUND));
    })
    .select('-password');

    res.status(HttpStatus.OK).json({data: updateUser});

  }catch(e){
    next(e);
  }

}

const createUser = async (req, res, next) => {

  try{

    const {name, email, password} = req.body;
    if(!name || !email || !password){
      return next(new BadRequestError(HttpResponseMessage.BAD_REQUEST));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({name, email, password: hashedPassword});
    res.status(HttpStatus.CREATED).json({data: {_id: user._id, name: user.name, email: user.email, avatar: user.avatar }});

  }catch(e){
    next(e);
  }

}

const login = async (req, res, next) => {

  try{

    const {email, password} = req.body;
    if(!email || !password){
      return next(new BadRequestError(HttpResponseMessage.BAD_REQUEST));
    }

    const user = await User.findOne({email}).select('+password');
    if(!user){
      return next(new AuthError(HttpResponseMessage.UNAUTHORIZED));
    }

    const matched = await bcrypt.compare(password, user.password);
    if(!matched){
      return next(new AuthError(HttpResponseMessage.UNAUTHORIZED));
    }

    const token = jwt.sign({_id: user._id}, NODE_ENV === 'production' ? JWT_SECRET : 'secreto', {expiresIn: '7d'});
    res.status(HttpStatus.OK).json({token, data: {name: user.name, email: user.email, avatar: user.avatar, _id: user._id }});

  }catch(e){
    next(e);
  }

}

module.exports = {
  getUser, updateUser, createUser, login, getUserById
}