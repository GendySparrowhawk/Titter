const router = require('express').Router();
const Thought = require('../models/Thought');
const { isAuthenticated, authenticate } = require('./helpers');


router.get('/thoughts', async (req, res) => {
    const thoughts = await Thought.find()
    .populate('user')
    .populate('reactions');

    res.json(thoughts);
});

router.get('/thoughts/:thought_id', async (req, res) => {
    const thought_id = req.params.thought_id;

    const thought = await Thought.findById(thought_id)
    .populate('user')
    .populate('reactions');

    res.json(thought);
});

module.exports = router;