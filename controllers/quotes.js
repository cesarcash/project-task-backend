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
    res.status(HttpStatus.CREATED).json({data: { _id: quote._id, author: quote.author, content: quote.content  }});

  }catch(e){
    next(e);
  }

}

const getQuotes = async (req, res, next) => {

  const limit = parseInt(req.params.limit);
  const page = parseInt(req.query.page) || 1;

  if(!req.user){
    return next(new AuthError(HttpResponseMessage.UNAUTHORIZED));
  }

  try{
    const quotes = await Quote.find({ owner: req.user._id }).skip((page - 1) * limit).limit(limit).populate('owner');
    const total = await Quote.countDocuments({owner: req.user._id});
    res.status(HttpStatus.OK).json({ total, data: quotes });
  }catch(e){
    next(e);
  }

}

module.exports = {
  addQuote, getQuotes
}