const router = require('express').Router();
const { User, Thought } = require('../models');
const { isLoggedIn, authenticate } = require('./helpers');

// this serves to create a user
router.post('/register', async (req, res) => {
    try {
        const user = await User.create(req.body);
        // req.session.user_id = user_id;

        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(401).send({ message: 'could not register user' })
    }
});


// login a user so they can create thoughts
router.post('/login', isLoggedIn, async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(403).send({
            message: 'no user found with that email address'
        });
    }

    const pass_is_vaild = await user.validatePass(password);

    if (!pass_is_vaild) {
        return res.status(401).send({ message: 'password is invaild' })
    }
});


router.get('./authenticate', authenticate, (req, res) => {
    res.json(req.user);
});

// route to get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);

    } catch (error) {
        return res.status(403).send({ message: 'could not get all user data' });
    }
});

// route to get user by id and associated data
router.get('/users/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;

        if (!user_id) {
            return res.status(403).send({ message: 'not a valid user_id' })
        }
        const user = await User.findById(user_id)
            .populate('thoughts')
            .populate('friends');

        res.json(user);

    } catch (error) {
        console.error(error);
        return res.status(403).send({ message: 'could not get user data' })
    }
});

// update a user by id and change their username
router.put('users/:user_id', async (req, res) => {
    const user_id = req.params.user_id;
    const { newUsername } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            user_id,
            { username: newUsername },
            { new: true });

        res.json(updatedUser)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// route to delete user
router.delete('users/:user_id', async (req, res) => {
    const user_id = req.params.user_id;
    try {
        const deletedUser = await User.findByIdAndDelete(user_id);
        
        if(!deletedUser) {
            return res.status(404).send({ message: 'no user found by that id'});
        }
    // this deletes associated thoughts
        await Thought.deleteMany({ user: user_id })
        res.status(200).json({ message: 'User and their mark on civilization has been erased' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// logout a user so they can stop thinking thoughts
router.get('/logout', (req, res) => {
    req.session.destroy();

    res.json({
        message: 'You escaped, time to get up to some real mischief!'
    });
});

module.exports = router;