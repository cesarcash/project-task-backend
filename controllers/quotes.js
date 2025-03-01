const Quote = require('../models/quotes');
const { HttpStatus, HttpResponseMessage } = require('../enums/http');
const AuthError = require('../middleware/errors/AuthError');
const NotFoundError = require('../middleware/errors/NotFoundError');
const BadRequestError = require('../middleware/errors/BadRequestError');

const addQuote = async ( req, res, next ) => {

  const owner = req.user._id;
  const {author, content, tags} = req.body;
  if(!author || !content || !tags){
    return next(new BadRequestError(HttpResponseMessage.BAD_REQUEST));
  }

  try{

    const quote = await Quote.create({ author, content, tags, owner });
    res.status(HttpStatus.CREATED).json({data: { ...quote }});

  }catch(e){
    next(e);
  }

}

module.exports = {
  addQuote
}