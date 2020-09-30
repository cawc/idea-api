// * load dotenv
require('dotenv').config()

// * morgan
const morgan = require('morgan')

// * express init
const Express = require('express')
const bodyParser = require('body-parser')
const app = Express()

app.disable('etag')

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  next()
})

// * routers
const ideaRouter = require('./routes/ideas')

app.use(bodyParser.json())

app.use(morgan('tiny'))

app.use('/', ideaRouter)

const port = process.env.PORT || 9998
app.listen(port, () => { console.log(`api now launched on port ${port} 🚀`) })
