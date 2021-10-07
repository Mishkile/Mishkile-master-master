var express = require('express');
var router = express.Router();
var blMongo = require('../models/personsBL');
var date = new Date();



/* GET users listing. */
router.get('/', async function (req, res, next) {
  if (req.session.authenticated && req.session.user.admin == true) {
    let data2 = await blMongo.getAllUsers()
    res.render('newUser', { data2, msg: null });;
  } else {
    res.redirect('/login')
  }

});


router.post('/', async function (req, res, next) {
  if (req.session.authenticated) {
    if (req.session.user.admin == false) {
      res.redirect('/login')
    } else {
      let obj = {}
      const { userName, userPass, isAdmin } = req.body;
      const today = date.toString().slice(0, 15);
      obj.username = userName;
      obj.password = userPass;
      obj.created = today;


      let users = await blMongo.getAllUsers()
      if (users.find(user => user.username == obj.username)) {
        res.render('newUser', { data2: users, msg: 'User already exists' })
      } else {
        if (typeof isAdmin == 'undefined') {
          obj.role = 'User';
          obj.transactionsPerDay = 15;

          req.session.credits -= 1;
          blMongo.addUser(obj)
          res.render('newUser', { data2: users, msg: 'User added as user' })

        } else {
          obj.role = 'Admin';
          obj.transactionsPerDay = 30;
          req.session.credits -= 1;
          blMongo.addUser(obj)
          res.render('newUser', { data2: users, msg: 'User added as admin' })
        }
      }
    }
  } else {
    res.redirect('/login')
  }

})



router.get('/delete', async function (req, res, next) {
  if (req.session.authenticated && req.session.user.admin) {
    res.redirect('/enwUser');
  } else {
    res.redirect('/login')
  }
})


router.post('/delete', async function (req, res, next) {
  if (req.session.authenticated && req.session.user.admin) {
    const { userNameDel } = req.body;
    req.session.credits -= 1;
    let users = await blMongo.getAllUsers()
    let userToDelete = users.find(user => user.username == userNameDel)._id
    blMongo.deleteUser(userToDelete)
    res.render('menu', { admin: true })
  } else {
    res.redirect('/login')
  }


})

router.post('/edit', async function (req, res, next) {
  if (req.session.authenticated && req.session.user.admin) {
    const { userNamePatch } = req.body;
    res.render('editUser', { userNamePatch, admin: true })
  } else {
    res.redirect('/login')
  }


})

router.get('/edit', async function (req, res, next) {
  if (req.session.authenticated && req.session.user.admin) {

    res.render('editUser', { userNamePatch: '', admin: true })
  } else {
    res.redirect('/login')
  }
})

router.post('/edit/:userName', async function (req, res, next) {
  if (req.session.authenticated && req.session.user.admin) {
    let data = await blMongo.getAllUsers()
    let username = req.body.userName;
    let password = req.body.userPass;
    let isAdmin = req.body.isAdmin;
    if (isAdmin) {
      let obj = { username, password, role: 'Admin' }
      let userId = data.find(user => user.username == username)._id
      req.session.credits -= 1;
      blMongo.editUser(userId, obj)
      res.render('menu', { admin: true })
    } else {
      let obj = { username, password, role: 'User' }
      let userId = data.find(user => user.username == username)._id
      req.session.credits -= 1;
      blMongo.editUser(userId, obj)
      res.render('menu', { admin: true })
    }

  }
  else {
    res.redirect('/login')
  }
  // res.render(`menu`, { userName, password, isAdmin });;
});


module.exports = router;
