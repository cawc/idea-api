// * load dotenv
require('dotenv').config();

// * db init
const db = require('monk')(process.env.MONGODB_URI);
db.then(() => {
    console.log('connected to db ✨');
});
const ideas = db.get('ideas');

// * express init
const Express = require('express');
const bodyParser = require('body-parser');
const app = Express();

app.use(bodyParser.json());

app.get('/', async (req, res, next) => {
    try {
        const items = await ideas.find();
        res.json(items);
    } catch (error) {
        next(error);
    }
});


const port = process.env.PORT || 9998;
app.listen(port, () => {console.log(`api now launched on port ${port} 🚀`)});