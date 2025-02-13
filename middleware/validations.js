const {celebrate, Joi} = require('celebrate');
const validator = require('validator');

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(5),
  })
});

const validateLoginUser = celebrate({
  body: Joi.object().keys({
    email: Join.string().email().required(),
    password: Joi.string().required().min(5),
  })
});

module.exports = {
  validateCreateUser,
  validateLoginUser
}