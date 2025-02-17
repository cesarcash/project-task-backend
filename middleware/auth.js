const jwt = require('jsonwebtoken');
const { HttpStatus, HttpResponseMessage } = require('../enums/http');
require ('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = (res, status = HttpStatus.UNAUTHORIZED, message = HttpResponseMessage.UNAUTHORIZED) => {
  return res.status(status).send({message});
}

module.exports = (req, res, next) => {

  const {authorization} = req.headers;

  if(!authorization || !authorization.startsWith('Bearer ')){
    return handleAuthError(res);
  }

  const token = authorization.replace('Bearer ', '');

  try{

    if (!JWT_SECRET) {
      console.error("Error: JWT_SECRET no está definido.");
      return handleAuthError(res, HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor");
    }

    const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'secreto';
    const payload = jwt.verify(token, secretKey);

    req.user = payload;

    next();

  }catch(e){
    console.error("Error de autenticación:", err.message);

    if (err.name === 'TokenExpiredError') {
      return handleAuthError(res, HttpStatus.UNAUTHORIZED, "Token expirado");
    } else if (err.name === 'JsonWebTokenError') {
      return handleAuthError(res, HttpStatus.UNAUTHORIZED, "Token inválido");
    } else {
      return handleAuthError(res);
    }

  }

}

