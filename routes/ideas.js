const express = require('express')
const router = express.Router()
const db = require('../db')
const ideaSchema = require('../idea-schema')
const ideas = db.get('ideas')
const utils = require('../utils')

router.get('/', utils.authJWT, async (req, res, next) => {
  try {
    const items = await ideas.find()
    res.json(items)
  } catch (error) {
    next(error)
  }
})

router.get('/random', utils.authJWT, async (req, res, next) => {
  try {
    const items = await ideas.find()
    const item = items[Math.floor(Math.random() * items.length)]
    res.json(item)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', utils.authJWT, async (req, res, next) => {
  try {
    const { id } = req.params
    const item = await ideas.find({ _id: id })
    res.json(item[0])
  } catch (error) {
    next(error)
  }
})

router.post('/', utils.authJWT, utils.adminOnly, async (req, res, next) => {
  try {
    const value = await ideaSchema.validateAsync(req.body)
    const item = await ideas.insert(value)
    res.json(item)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', utils.authJWT, utils.adminOnly, async (req, res, next) => {
  try {
    const { id } = req.params
    const value = await ideaSchema.validateAsync(req.body)
    const item = await ideas.findOne({ _id: id })
    if (!item) return next()
    await ideas.update({ _id: id }, { $set: value })
    res.json(value)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', utils.authJWT, utils.adminOnly, async (req, res, next) => {
  try {
    const { id } = req.params
    await ideas.remove({ _id: id })
    res.json({ message: 'Succesfully deleted' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
