const router = require('express').Router();
const { User, Thought } = require('../models');

// const { isAuthenticated, authenticate } = require('./helpers');

// a route to get all thoughts and associated users and reactions
router.get('/thoughts', async (req, res) => {
    const thoughts = await Thought.find()
        .populate('user')
        .populate('reactions');

    res.json(thoughts);
});

// get a thought by id with assocaitions
router.get('/thoughts/:thought_id', async (req, res) => {
    const thought_id = req.params.thought_id;

    const thought = await Thought.findById(thought_id)
        .populate('user')
        .populate('reactions');

    res.json(thought);
});

// route to create a thought for a user
router.post('/thoughts', async (req, res) => {
    const { thoughtText, username, user_id } = req.body;

    try {
        const newThought = await Thought.create({
            thoughtText,
            username,
        });

        const user = await User.findById(user_id);
        // error handling if no user
        if (!user) {
            return res.status(404).json({ error: 'no user found' });
        }

        user.thoughts.push(newThought._id);
        await user.save();
        res.json(newThought);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'could not get to thinkin' })

    }
});


// route to update a thoughts text
router.put('/thoughts/:thought_id', async (req, res) => {
    const thought_id = req.params.thought_id;
    const { thoughtText } = req.body;
    // error handling if no thought with that id
    if (!thought_id) {
        return res.status(404).json({ error: 'no thought found. Try again in the shower or at 3am' })
    }
    try {
        const updatedThought = await Thought.findByIdAndUpdate(
            thought_id,
            { thoughtText },
            { new: true }
        );

        res.json(updatedThought);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'could not think, meditation is not working out for you is it?' })
    }
});

// route to delete a thought by id
router.delete('/thoughts/:thought_id', async (req, res) => {
    const thought_id = req.params.thought_id;

    // error handling if no thought id
    if (!thought_id) {
        return res.status(404).json({ error: 'no thought found, it\'s always in the last place you look' });
    }
    try {
        const deletedThought = await Thought.findByIdAndDelete(thought_id);
        res.status(200).json({ message: "That thought won't bother you again, get some sleep" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'sorry, got to go to therapy to get rid of that thought' })
    }
});


// route to add a reaction to a useres thought 
router.post('/thoughts/:thought_id/reactions', async (req, res) => {
    const thought_id = await req.params.thought_id;
    const { reactionBody, username } = req.body;

    // error handling if no thought with that id
    if (!thought_id) {
        return res.status(404).json({ error: 'no thought found, it\'s always in the last place you look' });
    }
    try {
        // use the thought mode to chaneg the reactoinsScema
        const thought = await Thought.findByIdAndUpdate(
            thought_id,
            {
                $push: {
                    reactions: {
                        reactionBody,
                        username
                    }
                }
            },
            { new: true }
        );

        res.json(thought);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'please just be chill, this is not that hill bud.' })
    };
});

router.delete('/thoughts/:thought_id/reactions/:reaction_id', async (req, res) => {
    const { thought_id, reaction_id } = await req.params;
    
    // error handling if no thought with that id
    if (!thought_id || !reaction_id) {
        return res.status(404).json({ error: 'no thought found, it\'s always in the last place you look' });
    }

    try {
        const thought = await Thought.findByIdAndUpdate(
            thought_id,
            {
                $pull: {
                    reactions: {
                        _id: reaction_id
                    }
                }
            },
            { new: true }
        );
        if (!thought) {
            return res.status(404).json({ error: 'could not delete reaction no id found' });
        }

        res.json(thought);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'oh no, it lives HERE now! Everyone will know what you think!' })
    };
});

module.exports = router;