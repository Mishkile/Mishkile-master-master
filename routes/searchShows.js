var express = require('express');
const { appendFile } = require('fs');
var router = express.Router();
var path = require('path');
var dal = require('../DALs/showsDAL')


/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.authenticated) {
        res.render('search', { authenticated: true });
    } else {
        res.render('search', { authenticated: false })
    }

});


router.get('/results', async function (req, res, next) {
    res.redirect('/searchShow')
})
router.post('/results', async function (req, res, next) {
    let { query } = req.body;
    query = query.toLowerCase();
    let searchedShows = await dal.searchShows(query);
    searchedShows = searchedShows.data
    let localShows = await dal.getUserAddedShows(query);
    localShows = localShows.filter(shows => shows.Name === query) // search for locally added shows before sending them to the page

    console.log(localShows);

    res.render('results', { searchedShows, localShows });

});


router.get('/results/:id', async function (req, res, next) {
    let showId = req.params.id
    let show = await dal.searchShowsById(showId)
    if (typeof show !== 'undefined') {
        let plot = show.data.summary
        res.render(`showDetails`, { show: show.data, plot: plot });
    } else {
        res.redirect('/searchShow')
    }
});


module.exports = router;


