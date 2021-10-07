var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.authenticated) {
        if (req.session.user.admin == true) { // if user is admin it will send the menu page and admin attribute where it adds the admin options
            res.render('menu', { admin: true });

        } else {
            res.render('menu', { admin: false }); // will load the regular menu page

        }
    } else {
        res.redirect('/login')
    }

});

module.exports = router;
