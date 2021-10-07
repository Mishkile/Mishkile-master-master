const e = require('express');
var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    if (req.session.authenticated) {
        req.session.authenticated = false; // setting this to false will end the session
        res.redirect('/login')
    } else {
        res.redirect('/login')
    }
})

module.exports = router;