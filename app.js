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

// * schema
const Joi = require('joi');
const schema = Joi.object({
    idea: Joi.string().max(128).required(),
    description: Joi.string().max(512).required(),
    done: Joi.bool().required()
});

app.use(bodyParser.json());

app.get('/', async (req, res, next) => {
    try {
        const items = await ideas.find();
        res.json(items);
    } catch (error) {
        next(error);
    }
});

app.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await ideas.find({_id: id});
        res.json(item);
    } catch (error) {
        next(error);
    }
});

app.post('/', async (req, res, next) => {
    try {
        const value = await schema.validateAsync(req.body);
        const item = await ideas.insert(value);
        res.json(item);
    } catch (error) {
        next(error);
    }
});

app.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const value = await schema.validateAsync(req.body);
        const item = await ideas.findOne({_id: id});
        if (!item) return next();
        await ideas.update({_id: id}, {$set: value});
        res.json(value);
    } catch (error) {
        next(error);
    }
});

app.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await ideas.remove({_id: id});
        res.json({message: 'Succesfully deleted'});
    } catch (error) {
        next(error);
    }
});

const port = process.env.PORT || 9998;
app.listen(port, () => {console.log(`api now launched on port ${port} 🚀`)});