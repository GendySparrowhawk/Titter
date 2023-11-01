const router = require('express').Router();
const { User, Thought } = require('../models');
// const { isLoggedIn, authenticate } = require('./helpers');

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
router.post('/login', async (req, res) => {
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
router.put('/users/:user_id', async (req, res) => {
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
router.delete('/users/:user_id', async (req, res) => {
    const user_id = req.params.user_id;
    try {
        const deletedUser = await User.findByIdAndDelete(user_id);

        if (!deletedUser) {
            return res.status(404).send({ message: 'no user found by that id' });
        }
        // this deletes associated thoughts
        await Thought.deleteMany({ user: user_id })
        res.status(200).json({ message: 'User and their mark on civilization has been erased' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});
// this route adds a freind to a user, this is not a two way function you can be friends with someone but they are not made a friend to you. Its a more honest system.
router.put('/users/:user_id/friends/:friend_id', async (req, res) => {
    const { user_id, friend_id } = req.params;

    try {
        const user = await User.findById(user_id);
        const friend = await User.findById(friend_id);
        // if no user or friend id error catch
        if (!user || !friend) {
            return res.status(404).json({ error: 'User and/or friend not found' })
        }
        // do not add the same user as a friend more than once
        if (!user.friends.includes(friend_id)) {
            user.friends.push(friend_id);
            await user.save();
        } else {
            return res.status(400).json({ error: 'Friend already added' });
        }

        res.json({ message: 'Friend added successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'server error' })
    }
});

router.delete('/users/:user_id/friends/:friend_id', async (req, res) => {
    const { user_id, friend_id } = req.params;

    try {
        const user = await User.findById(user_id);
        if(!user) {
            return res.status(404).json({ error: 'Could not find user' })
        }

        const friendIndex = user.friends.indexOf(friend_id);
        if(friendIndex === -1) {
            return res.status(404).json({ error: 'You were never friends it seems...'})
        }

        user.friends.splice(friendIndex, 1);
        await user.save();
        res.json({ message: 'nothing lasts...friend deleted...you monster'});     
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'bff means something, try again' })
    }
});
// logout a user so they can stop thinking thoughts
// router.get('/logout', (req, res) => {
//     req.session.destroy();

//     res.json({
//         message: 'You escaped, time to get up to some real mischief!'
//     });
// });

module.exports = router;