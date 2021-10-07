var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.authenticated) {
    let user = req.session.user;
    if (user.admin) {
      res.render('index', { msg: undefined, admin: true })
    } else {
      res.render('index', { msg: undefined, admin: false })
    }
  } else {
    res.render('index', { msg: undefined, admin: undefined })
  }
  // let isLogged = req.session.user;
})


module.exports = router;
