const express = require(`express`)
const app = express()
app.use(express.json())

const menuController = require(`../controllers/menu.controller`)
const { authorization }  = require (`../controllers/auth.controller`)

app.post(`/menu`,authorization(["admin", "manager"]), menuController.addMenu)
app.get(`/menu`,authorization(["admin", "manager","kasir"]), menuController.getMenu)
app.post(`/menu/find`,authorization(["admin", "manager"]), menuController.findMenu)
app.put(`/menu/:id_menu`,authorization(["admin", "manager"]), menuController.updateMenu)
app.delete(`/menu/:id_menu`,authorization(["admin", "manager"]), menuController.deleteMenu)

module.exports = app