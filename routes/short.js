const express = require('express')
const router = express.Router()
const db = require('../db')
const shortenSchema = require('../shorten-schema')
const short = db.get('short')
const utils = require('../utils')

router.get('/', utils.authJWT, utils.adminOnly, async (res, req, next) => {
  try {
    const items = await short.find()
    res.json(items)
  } catch (error) {
    next(error)
  }
})

router.get('/:token', async (req, res, next) => {
  try {
    const { token } = req.params
    const shortObject = await short.findOne({ token: token })
    if (!shortObject) return next()
    res.json(shortObject)
  } catch (error) {
    next(error)
  }
})

router.post('/', utils.authJWT, utils.adminOnly, async (req, res, next) => {
  try {
    const value = await shortenSchema.validateAsync(req.body)
    const item = await short.insert(value)
    res.json(item)
  } catch (error) {
    next(error)
  }
})

router.delete('/:token', utils.authJWT, utils.adminOnly, async (req, res, next) => {
  try {
    const { token } = req.params
    await short.remove({ token: token })
    res.json({ message: 'Succesfully deleted' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
