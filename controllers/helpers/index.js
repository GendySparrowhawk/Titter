const { User } = require('../../models/');


async function isLoggedIn(req, res, next) {
    const user_id = req.session.user_id;

    if(user_id) {
        const user = await User.findById(user_id);
        const email = req.body.email;

        if(user.email !== email) return next();

        return res.json(user);
    }

    next();
}

function isAuthenticated(req, res, next) {
    const user_id = req.session.user_id;

    if(!user_id) return res.status(401).send({
        message: 'Not authenticated, try again later'
    });

    next();
}

async function authenticate(req, res, next) {
    const user = await User.findById(req.session.user_id);

    req.user = user;

    next();
}

module.exports = { isLoggedIn, isAuthenticated, authenticate };
