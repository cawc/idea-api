const Joi = require('joi')

const schema = Joi.object({
  idea: Joi.string().max(128).required(),
  description: Joi.string().max(512).required(),
  done: Joi.bool().required()
})

module.exports = schema
