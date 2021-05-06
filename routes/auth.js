const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const db = require('../db')
const users = db.get('users')
const userSchema = require('../user-schema')
const utils = require('../utils')

router.get('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await users.findOne({ username: username, password: password })
    if (!user) {
      res.status(401).send('Username/password incorrect')
    } else {
      const accessToken = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET)
      res.json({ accessToken })
    }
  } catch (error) {
    next(error)
  }
})

router.post('/register', utils.authJWT, utils.adminOnly, async (req, res, next) => {
  try {
    const user = await userSchema.validateAsync(req.body)
    const nameCheck = await users.findOne({ username: user.username })
    if (nameCheck) {
      res.status(409).send('User with this username already exists')
    } else {
      const userInserted = await users.insert(user)
      res.json(userInserted)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
