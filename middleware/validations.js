const {celebrate, Joi} = require('celebrate');
const validator = require('validator');

const validateDate = (value, helpers) => {
  if(validator.isDate(value)){
    return value;
  }
  return helpers.message('Invalid date format');
}

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(5),
  })
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(5),
  })
});

const validateLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(5),
  })
});

const validateCreateTask = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    description: Joi.string().required().min(2).max(30),
    endDate: Joi.string().required().custom(validateDate),
  })
});

const validateId = celebrate({
  params: Joi.object().keys({
    taskId: Joi.string().required().hex().length(24)
  })
})

module.exports = {
  validateCreateUser,
  validateLoginUser,
  validateCreateTask,
  validateId,
  validateUpdateUser
}