const jwt = require('jsonwebtoken')

// * jwt auth middleware
const authJWT = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Token error' })
      }
      req.user = user
      next()
    })
  } else {
    res.status(401).json({ error: 'Not authenticated' })
  }
}

const adminOnly = (req, res, next) => {
  if (req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ error: 'Not authorized to view this page' })
  }
}

module.exports = { authJWT, adminOnly }
