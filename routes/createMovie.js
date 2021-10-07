var express = require('express');
var router = express.Router();
var path = require('path');
var dal = require('../DALs/showsDAL')
var usersBL = require('../models/personsBL')



/* GET page. */
router.get('/', function (req, res, next) {
    if (req.session.authenticated) {
        res.render('createMovie', { msg: null });
    } else {
        res.redirect('/login')
    }
});

router.post('/newMovie', async function (req, res, next) {
    if (req.session.authenticated) {                                                  //will let user add item only if user is logged
        let shows = await dal.getUserAddedShows()
        let transactions = req.session.credits // checks the amount of transactions
        console.log(transactions)
        let obj = {}
        const { movieName, movieLang, movieGenres } = req.body;
        obj.Name = movieName.toLowerCase();
        obj.Lang = movieLang.toLowerCase();
        obj.Genres = [];
        obj.Genres.push(movieGenres)

        if (shows.find(show => show.Name == obj.Name)) {
            res.render('createMovie', { msg: 'Already exists' });
        } else {
            dal.addShowMovie(obj)
            req.session.credits -= 1;
            res.render('menu', { admin: true });
        }
    } else {
        res.redirect('/login')
    }



})
module.exports = router;
