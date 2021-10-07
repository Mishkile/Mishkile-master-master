var express = require('express');
var router = express.Router();
var usersBL = require('../models/personsBL')
var path = require('path')
var blMongo = require('../models/personsBL')
var date = new Date()

const filePath = path.join(__dirname, '../DALs/db/users.json')



/* GET Login page. */
router.get('/', (req, res, next) => {
    if (req.session.authenticated) {
        res.redirect('/menu')
    } else {
        res.render('login', { err: '' })
    }
})


router.post('/', async function (req, res, next) {
    const { username, password } = req.body; //get username and password from form (destructuring)
    const { testUsername, testPassword } = req.body; //get username and password from form for testing purposes

    let data = await blMongo.getAllUsers() // find all users

    if (req.session.authenticated) { // if theres a session active then redirect to menu page
        res.redirect('/menu')
    } else if (testUsername == 'test' && testPassword == '1234') {
        // this is a test user so you dont have to manually create it on your mongoDB

        const today = date.toString().slice(0, 15);
        // let obj = { username: 'test', password: '1234', created: today, role: 'Admin', transactionsPerDay: 1000 }
        // let resp = await usersBL.addUser(obj)
        // console.log(resp)
        req.session.authenticated = true;
        req.session.credits = 1000;
        req.session.user = { // adding user attributes to the session object for future check
            username: testUsername, admin: true
        }
        res.redirect('/menu')
    } else { // no session, executes
        let user = data.find(users => users.username == username && users.password == password) // find the user using the username and password we saved above
        if (typeof user == 'undefined') { // if user is NOT found it will return an "undefined" to user variable

            res.render('login', { err: 'User / Password Not Found' }) // sends error message to login page

        } else if (user.role == 'Admin') { // user did not return undefined therefore user exists, now check if user is admin

            req.session.authenticated = true; // authenticating user for future checks

            req.session.credits = await blMongo.checkTransactions(user.username); // getting the amount of credits the user has and setting them inside the session

            console.log(req.session.credits)
            req.session.user = { // adding user attributes to the session object for future check
                username: username, admin: true
            }
            console.log(user)
            console.log(req.session.user)
            res.redirect('/menu')
        }
        else if (user.role !== 'Admin') {

            req.session.authenticated = true;
            req.session.credits = await blMongo.checkTransactions(username);
            console.log(req.session.credits)



            req.session.user = {
                username, admin: false
            }
            res.redirect('/menu')
        } else {
            res.render('login', { err: 'User / Password Not Found' })
        }
    }








});
module.exports = router;
