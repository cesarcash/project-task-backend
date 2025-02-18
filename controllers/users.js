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
      throw new AuthError(HttpResponseMessage.UNAUTHORIZED);
    }

    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError(HttpResponseMessage.NOT_FOUND);
    }

    res.status(HttpStatus.OK).send({name: user.name, email: user.email});

  }catch(e){
    next(e);
  }

}

const updateUser = async (req, res, next) => {

  try{

    const userId = req.user._id;
    const {name, email, password} = req.body;
    if(!name || !email || !password){
      throw new BadRequestError(HttpResponseMessage.BAD_REQUEST);
    }

    const hashedPAssword = await bcrypt.hash(password, 10);

    const updateUser = await User.findByIdAndUpdate(userId, {name, email, password: hashedPAssword}, {new: true}).orFail(() => {
      throw new NotFoundError(HttpResponseMessage.NOT_FOUND);
    });

    res.status(HttpStatus.OK).send({data: updateUser});

  }catch(e){
    next(e);
  }

}

const createUser = async (req, res, next) => {

  try{

    const {name, email, password} = req.body;
    if(!name || !email || !password){
      throw new BadRequestError(HttpResponseMessage.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({name, email, password: hashedPassword});
    res.status(HttpStatus.CREATED).send({data: {_id: user._id, name: user.name, email: user.email}});

  }catch(e){
    next(e);
  }

}

const login = async (req, res, next) => {

  try{

    const {email, password} = req.body;
    if(!email || !password){
      throw new BadRequestError(HttpResponseMessage.BAD_REQUEST);
    }

    const user = await User.findOne({email}).select('+password');
    if(!user){
      throw new AuthError(HttpResponseMessage.UNAUTHORIZED);
    }

    const matched = await bcrypt.compare(password, user.password);
    if(!matched){
      throw new AuthError(HttpResponseMessage.UNAUTHORIZED);
    }

    const token = jwt.sign({id: user._id}, NODE_ENV === 'production' ? JWT_SECRET : 'secreto', {expiresIn: '7d'});
    res.status(HttpStatus.OK).send({token});

  }catch(e){
    next(e);
  }

}

module.exports = {
  getUser, updateUser, createUser, login
}