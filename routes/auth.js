const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const db = require('../db')
const users = db.get('users')
const refreshTokens = db.get('refreshtokens')
const userRegistrationSchema = require('../user-registration-schema')
const utils = require('../utils')
const bcrypt = require('bcrypt')

router.get('/', utils.authJWT, utils.adminOnly, async (req, res, next) => {
  try {
    const userlist = await users.find()
    res.json(userlist)
  } catch (error) {
    next(error)
  }
})

router.post('/authenticate', async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await users.findOne({ username: username })
    if (!user) {
      res.status(401).json({ error: 'Username/password incorrect' })
    } else {
      bcrypt.compare(password, user.passhash, async (err, match) => {
        if (err) {
          next(err)
        }
        if (match) {
          const accessToken = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30m' })
          const refreshToken = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_REFRESH_SECRET)
          await refreshTokens.insert({ userid: user._id, token: refreshToken })
          res.json({ accessToken, refreshToken })
        } else {
          res.status(401).json({ error: 'Username/password incorrect' })
        }
      })
    }
  } catch (error) {
    next(error)
  }
})

router.post('/token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) res.status(401).json({ error: 'No refreshToken provided' })
    if (await refreshTokens.count({ token: refreshToken }) < 1) res.status(403).json({ error: 'Invalid refreshToken' })

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        next(err)
      } else {
        const accessToken = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30m' })
        res.json({ accessToken })
      }
    })
  } catch (error) {
    next(error)
  }
})

router.post('/logout', utils.authJWT, async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    await refreshTokens.remove({ token: refreshToken })
    res.json({ message: 'Logout success' })
  } catch (error) {
    next(error)
  }
})

router.post('/register', utils.authJWT, utils.adminOnly, async (req, res, next) => {
  try {
    let user = await userRegistrationSchema.validateAsync(req.body)
    const nameCheck = await users.findOne({ username: user.username })
    if (nameCheck) {
      res.status(409).json({ error: 'User with this username already exists' })
    } else {
      bcrypt.hash(user.password, 10, async (err, hash) => {
        if (err) {
          next(err)
        }
        user = {
          username: user.username,
          passhash: hash,
          role: user.role
        }
        const userInserted = await users.insert(user)
        delete userInserted.passhash
        res.json(userInserted)
      })
    }
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', utils.authJWT, utils.adminOnly, async (req, res, next) => {
  try {
    const { id } = req.params
    await users.remove({ _id: id })
    res.json({ message: 'Succesfully deleted' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
