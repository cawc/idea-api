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
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

// * routers
const ideaRouter = require('./routes/ideas')
const shortRouter = require('./routes/short')
const authRouter = require('./routes/auth')

app.use(bodyParser.json())

app.use(morgan('tiny'))

app.use('/ideas/', ideaRouter)
app.use('/s/', shortRouter)
app.use('/auth/', authRouter)

const port = process.env.PORT || 9998
app.listen(port, () => { console.log(`api now launched on port ${port} 🚀`) })
