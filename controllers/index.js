const router = require('express').Router();

const user_routes = require('../controllers/user_routes');
const thought_routes = require('../controllers/thought_routes');

router.use('/api', [
    user_routes,
    thought_routes
]);

router.use('/auth', user_routes);

module.exports = router;