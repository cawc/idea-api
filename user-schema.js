const Joi = require('joi')

const schema = Joi.object({
  username: Joi.string().max(32).required(),
  password: Joi.string().max(512).required(),
  role: Joi.string().valid(...['admin', 'user']).required()
})

module.exports = schema
