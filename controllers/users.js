const User = require('../models/user');
const { HttpStatus, HttpResponseMessage } = require('../enums/http');
const bcrypt = require('bcryptjs');
const AuthError = require('../middleware/errors/AuthError');
const NotFoundError = require('../middleware/errors/NotFoundError');
const BadRequestError = require('../middleware/errors/BadRequestError');

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

module.exports = {
  getUser, updateUser
}