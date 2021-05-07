const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const db = require('../db')
const users = db.get('users')
const userSchema = require('../user-schema')
const utils = require('../utils')
const bcrypt = require('bcrypt')

router.get('/', async (req, res, next) => {
  try {
    const userlist = await users.find()
    res.json(userlist)
  } catch (error) {
    next(error)
  }
})

router.get('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await users.findOne({ username: username })
    if (!user) {
      res.status(401).send('Username/password incorrect')
    } else {
      bcrypt.compare(password, user.passhash, (err, match) => {
        if (err) {
          next(err)
        }
        if (match) {
          const accessToken = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET)
          res.json({ accessToken })
        } else {
          res.status(401).send('Username/password incorrect')
        }
      })
    }
  } catch (error) {
    next(error)
  }
})

router.post('/register', async (req, res, next) => {
  try {
    let user = await userSchema.validateAsync(req.body)
    const nameCheck = await users.findOne({ username: user.username })
    if (nameCheck) {
      res.status(409).send('User with this username already exists')
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

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    await users.remove({ _id: id })
    res.json({ message: 'Succesfully deleted' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
