const jwt = require('jsonwebtoken')

// * jwt auth middleware
const authJWT = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403)
      }
      req.user = user
      next()
    })
  } else {
    res.sendStatus(401)
  }
}

const adminOnly = (req, res, next) => {
  console.log(req.user.role)
  if (req.user.role === 'admin') {
    next()
  } else {
    res.sendStatus(403)
  }
}

module.exports = { authJWT, adminOnly }
