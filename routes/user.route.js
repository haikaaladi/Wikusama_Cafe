// load express library
const express = require(`express`)

// create object of express
const app = express()

// allow to read a request from body with json
app.use(express.json())

//load controller of user
const userController = require(`../controllers/user.controller`)

const { authorization } = require("../controllers/auth.controller")

// create route for search user
app.post(`/user/find`, authorization(["admin", "kasSir","manajer"]), userController.findUser)

app.get(`/user`, authorization(["admin", "kasir","manajer"]), userController.getUser)

app.post(`/user`, authorization(["admin", "kasir","manajer"]), userController.addUser)

app.put(`/user/:id_user`, authorization(["admin", "kasir","manajer"]), userController.updateUser)

app.delete(`/user/:id_user`, authorization(["admin", "kasir","manajer"]), userController.deleteUser)

module.exports = app