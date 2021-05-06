const Joi = require('joi')

const schema = Joi.object({
  url: Joi.string().max(512).required(),
  token: Joi.string().max(512).required(),
  enabled: Joi.bool().default(true)
})

module.exports = schema
