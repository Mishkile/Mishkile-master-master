const usersModel = require('../models/personsModel')


exports.getAllUsers = function () {
    return new Promise(function (resolve, reject) {
        usersModel.find({}, function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })

}

exports.getUser = function (id) {
    return new Promise((resolve, reject) => {
        usersModel.findById(id, function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })

}

exports.addUser = function (obj) {
    return new Promise(async (resolve, reject) => {

        let user = new usersModel({
            username: obj.username,
            password: obj.password,
            created: obj.created,
            role: obj.role,
            transactionsPerDay: obj.transactionsPerDay
        });
        user.save(function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(console.log(user))
            }

        })
    })
}


exports.deleteUser = function (id) {
    return new Promise((resolve, reject) => {
        usersModel.findByIdAndDelete(id, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(console.log('User Deleted successfully'))
            }
        })
    })
}

exports.editUser = function (id, obj) {
    return new Promise((resolve, reject) => {
        usersModel.findByIdAndUpdate(id, obj, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(console.log('User Updated successfully'))
            }
        })
    })
}

exports.checkTransactions = function (username) {
    return new Promise((resolve, reject) => {
        usersModel.findOne({ username: username }, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data.transactionsPerDay)
            }
        })
    })
}

