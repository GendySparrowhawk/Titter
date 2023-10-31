const router = require('express').Router();
const { User } = require('../models');
const { isLoggedIn, authenticate } = require('./helpers');

router.post('/register', isLoggedIn, async (req, res) => {
    try {
        const user = await User.create(req.body);
        req.session.user_id = user_id;

        res.json(user);
    } catch (err) {
        res.status(401).send({ error: message })
    }
});

router.post('/login', isLoggedIn, async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if(!user) {
        return res.status(403).send({
            message: 'no user found with that wmail address'
        });
    }

    const pass_is_vaild = await user.validatePass(password);

    if(!pass_is_vaild) {
        return res.status(401).send({ message: 'password is invaild'})
    }
});

router.get('./authenticate', authenticate, (req, res) => {
    res.json(req.user);
});


router.get('/logout', (req, res) => {
    req.session.destroy();

    res.json({
        message: 'You escaped, time to get up to some real mischief!'
    });
});

module.exports = router;