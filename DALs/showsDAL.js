const axios = require('axios')
const jFile = require('jsonfile')
const path = require('path')
const newMoviesPath = path.join(__dirname, '../DALs/newMovies.json')

async function getShows() {
    return axios.get('https://api.tvmaze.com/shows')


}
function getUserAddedShows() {
    return new Promise((resolve, reject) => {
        jFile.readFile(newMoviesPath, (err, data) => {
            if (err) {
                reject(err)
            } else {

                resolve(data)
            }
        })
    })

}

async function searchShows(query) {
    const resp = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`)
    return new Promise((resolve, reject) => {
        if (resp) {
            resolve(resp)
        } else {
            reject('Something Went Wrong')
        }
    })

}

async function searchShowsById(id) {
    return axios.get(`https://api.tvmaze.com/shows/${id}`)


}


async function addShowMovie(obj) {

    return new Promise((resolve, reject) => {
        jFile.readFile(newMoviesPath, (err, data) => {
            if (err) {
                reject(err)
            } else {
                data.push(obj)
                console.log('Adding:')
                console.log(obj)
                jFile.writeFile(newMoviesPath, data, (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(console.log('Show added successfully'))
                    }
                })

            }
        })
    })




}


module.exports = { getShows, addShowMovie, searchShows, searchShowsById, getUserAddedShows }

