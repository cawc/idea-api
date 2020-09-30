// * db init
const db = require('monk')(process.env.MONGODB_URI)
db.then(() => {
  console.log('connected to db ✨')
})

module.exports = db
